<template>
  <div>
    <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
      {{ $t('admin.orders') }}
    </h1>

    <!-- Filters -->
    <div class="card p-4 mb-6 flex flex-wrap items-center gap-4">
      <input
        v-model="filters.search"
        type="text"
        class="form-input py-1.5 w-64"
        placeholder="Search orders..."
        @keyup.enter="fetchOrders"
      />
      <select v-model="filters.status" @change="fetchOrders" class="form-input py-1.5 w-40">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <button @click="fetchOrders" class="btn-primary py-1.5">
        <MagnifyingGlassIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Orders Table -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="p-8 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Order</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Package</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="order in orders" :key="order._id">
              <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                {{ order.orderCode }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-gray-300">
                {{ order.userId?.username || 'Unknown' }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-gray-300">
                {{ order.packageName }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                {{ formatPrice(order.totalPrice) }}
              </td>
              <td class="px-6 py-4">
                <select 
                  v-model="order.status" 
                  @change="updateOrderStatus(order)"
                  class="form-input py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </td>
              <td class="px-6 py-4">
                <router-link :to="`/orders/${order._id}`" class="text-blue-600 hover:text-blue-500">
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="flex items-center justify-between p-4 border-t">
        <span class="text-sm text-slate-500">Total: {{ pagination.total }}</span>
        <div class="flex gap-2">
          <button :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)" class="btn-outline py-1 px-3">Prev</button>
          <button :disabled="pagination.page === pagination.pages" @click="changePage(pagination.page + 1)" class="btn-outline py-1 px-3">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { orderApi } from '@/services/api.js';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const toast = useToast();

const loading = ref(true);
const orders = ref([]);
const filters = reactive({
  search: '',
  status: '',
  page: 1,
  limit: 20
});
const pagination = ref({ page: 1, pages: 1, total: 0 });

const formatPrice = (price) => {
  return (price || 0).toLocaleString('vi-VN') + ' ₫';
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await orderApi.getAllOrders(filters);
    if (response.success) {
      orders.value = response.data;
      pagination.value = response.pagination;
    }
  } catch (error) {
    toast.error('Failed to fetch orders');
  } finally {
    loading.value = false;
  }
};

const updateOrderStatus = async (order) => {
  try {
    await orderApi.updateOrder(order._id, { status: order.status });
    toast.success('Order status updated');
  } catch (error) {
    toast.error('Failed to update status');
  }
};

const changePage = (page) => {
  filters.page = page;
  fetchOrders();
};

onMounted(fetchOrders);
</script>
