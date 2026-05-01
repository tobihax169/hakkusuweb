<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back -->
      <button 
        @click="$router.back()"
        class="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon class="w-5 h-5" />
        Quay lại
      </button>

      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="order" class="space-y-6">
        <!-- Header Card -->
        <div class="card p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ order.orderCode }}
                </h1>
                <span :class="getStatusBadgeClass(order.status)">
                  {{ $t(`orders.status.${order.status}`) }}
                </span>
              </div>
              <p class="text-gray-500 dark:text-gray-400">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>

            <div class="text-right">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatPrice(order.totalPrice) }} ₫
              </p>
              <p class="text-sm" :class="getPaymentStatusClass(order.paymentStatus)">
                {{ $t(`orders.paymentStatus.${order.paymentStatus}`) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Order Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Package Info -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin gói
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Gói:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ order.packageName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Giá gốc:</span>
                <span>{{ formatPrice(order.basePrice) }} ₫</span>
              </div>
              <div v-if="order.discountAmount > 0" class="flex justify-between text-green-600">
                <span>Giảm giá:</span>
                <span>-{{ formatPrice(order.discountAmount) }} ₫</span>
              </div>
              <div class="flex justify-between font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Tổng:</span>
                <span class="text-primary-600">{{ formatPrice(order.totalPrice) }} ₫</span>
              </div>
            </div>
          </div>

          <!-- Discord Info -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Thông tin Discord
            </h3>
            <div class="space-y-3">
              <div v-if="order.discordServerId" class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Server ID:</span>
                <span class="font-mono">{{ order.discordServerId }}</span>
              </div>
              <div v-if="order.discordServerName" class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Server Name:</span>
                <span>{{ order.discordServerName }}</span>
              </div>
              <div v-if="!order.discordServerId" class="text-gray-500 italic">
                Chưa cung cấp thông tin Discord
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mô tả yêu cầu
          </h3>
          <p class="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
            {{ order.description || 'Không có mô tả' }}
          </p>
        </div>

        <!-- Actions -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thao tác
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              v-if="order.paymentStatus === 'pending' && order.status !== 'cancelled'"
              @click="showPayModal = true"
              class="btn-primary"
            >
              <CreditCardIcon class="w-5 h-5 mr-2" />
              Thanh toán ngay
            </button>

            <button
              v-if="order.canCancel"
              @click="confirmCancel"
              class="btn-outline text-red-600"
            >
              <XCircleIcon class="w-5 h-5 mr-2" />
              Hủy đơn
            </button>

            <button
              v-if="order.status === 'completed' && !order.rating"
              @click="showReviewModal = true"
              class="btn-outline"
            >
              <StarIcon class="w-5 h-5 mr-2" />
              Đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { orderApi } from '@/services/api.js';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  XCircleIcon,
  StarIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const loading = ref(true);
const order = ref(null);
const showPayModal = ref(false);
const showReviewModal = ref(false);

const formatPrice = (price) => {
  return price?.toLocaleString('vi-VN') || '0';
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('vi-VN');
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
    refunded: 'text-gray-500'
  };
  return classes[status] || 'text-gray-500';
};

const fetchOrder = async () => {
  try {
    const response = await orderApi.getOrderById(route.params.id);
    if (response.success) {
      order.value = response.data;
    }
  } catch (error) {
    toast.error('Không thể tải đơn hàng');
  } finally {
    loading.value = false;
  }
};

const confirmCancel = async () => {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

  try {
    const response = await orderApi.cancelOrder(order.value._id);
    if (response.success) {
      toast.success('Đã hủy đơn hàng');
      fetchOrder();
    }
  } catch (error) {
    toast.error(error.message || 'Không thể hủy đơn hàng');
  }
};

onMounted(fetchOrder);
</script>
