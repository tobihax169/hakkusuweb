<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          {{ $t('orders.title') }}
        </h1>
        <router-link 
          to="/orders/new" 
          class="btn-primary"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          {{ $t('orders.newOrder') }}
        </router-link>
      </div>

      <!-- Filters -->
      <div class="card p-4 mb-6 flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-slate-700 dark:text-gray-300">Trạng thái:</label>
          <select 
            v-model="filters.status" 
            @change="fetchOrders"
            class="form-input py-1.5 w-40"
          >
            <option value="">Tất cả</option>
            <option value="pending">Đang chờ</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Empty -->
      <div v-else-if="orders.length === 0" class="card p-12 text-center">
        <ShoppingBagIcon class="w-16 h-16 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
        <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">
          {{ $t('orders.noOrders') }}
        </h3>
        <p class="text-slate-500 dark:text-slate-400 mb-4">
          Bạn chưa có đơn hàng nào. Hãy đặt dịch vụ ngay!
        </p>
        <router-link to="/services" class="btn-primary">
          Xem dịch vụ
        </router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div
          v-for="order in orders"
          :key="order._id"
          class="card card-hover p-6"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- Info -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ order.orderCode }}
                </h3>
                <span :class="getStatusBadgeClass(order.status)">
                  {{ $t(`orders.status.${order.status}`) }}
                </span>
              </div>
              <p class="text-slate-600 dark:text-gray-300 mb-2">
                {{ order.packageName }}
              </p>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                {{ $t('orders.createdAt') }}: {{ formatDate(order.createdAt) }}
              </p>
            </div>

            <!-- Price & Actions -->
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-lg font-bold text-slate-900 dark:text-white">
                  {{ formatPrice(order.totalPrice) }} ₫
                </p>
                <p class="text-sm" :class="getPaymentStatusClass(order.paymentStatus)">
                  {{ $t(`orders.paymentStatus.${order.paymentStatus}`) }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  v-if="order.paymentStatus === 'pending' && order.status !== 'cancelled'"
                  @click="payOrder(order)"
                  class="btn-primary"
                >
                  {{ $t('orders.pay') }}
                </button>
                
                <button
                  v-if="order.canCancel"
                  @click="confirmCancel(order)"
                  class="btn-outline text-red-600 hover:text-red-700"
                >
                  {{ $t('orders.cancel') }}
                </button>

                <router-link
                  :to="`/orders/${order._id}`"
                  class="btn-outline"
                >
                  {{ $t('common.view') }}
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="flex items-center justify-between card p-4">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Hiển thị {{ orders.length }} / {{ pagination.total }} đơn hàng
          </p>
          <div class="flex items-center gap-2">
            <button
              :disabled="pagination.page === 1"
              @click="changePage(pagination.page - 1)"
              class="btn-outline py-1 px-3"
            >
              Trước
            </button>
            <span class="text-sm text-slate-600 dark:text-slate-400">
              Trang {{ pagination.page }} / {{ pagination.pages }}
            </span>
            <button
              :disabled="pagination.page === pagination.pages"
              @click="changePage(pagination.page + 1)"
              class="btn-outline py-1 px-3"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { orderApi } from '@/services/api.js';
import {
  ShoppingBagIcon,
  PlusIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const router = useRouter();
const toast = useToast();

const loading = ref(true);
const orders = ref([]);
const filters = reactive({
  status: '',
  page: 1,
  limit: 10
});
const pagination = ref({
  page: 1,
  pages: 1,
  total: 0
});

const formatPrice = (price) => {
  return price?.toLocaleString('vi-VN') || '0';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'badge-warning',
    processing: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    refunded: 'badge-danger'
  };
  return classes[status] || 'badge-info';
};

const getPaymentStatusClass = (status) => {
  const classes = {
    pending: 'text-yellow-600 dark:text-yellow-400',
    paid: 'text-green-600 dark:text-green-400',
    failed: 'text-red-600 dark:text-red-400',
    refunded: 'text-slate-500'
  };
  return classes[status] || 'text-slate-500';
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await orderApi.getMyOrders({
      status: filters.status,
      page: filters.page,
      limit: filters.limit
    });
    
    if (response.success) {
      orders.value = response.data;
      pagination.value = response.pagination;
    }
  } catch (error) {
    toast.error('Không thể tải đơn hàng');
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  filters.page = page;
  fetchOrders();
};

const payOrder = (order) => {
  router.push({
    path: `/orders/${order._id}`,
    query: { action: 'pay' }
  });
};

const confirmCancel = async (order) => {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

  try {
    const response = await orderApi.cancelOrder(order._id, 'Người dùng hủy');
    if (response.success) {
      toast.success('Đã hủy đơn hàng');
      fetchOrders();
    }
  } catch (error) {
    toast.error(error.message || 'Không thể hủy đơn hàng');
  }
};

onMounted(fetchOrders);
</script>
