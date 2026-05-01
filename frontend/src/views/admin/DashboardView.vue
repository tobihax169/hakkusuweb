<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ $t('admin.dashboard') }}
    </h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.totalUsers') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ formatNumber(stats.users) }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UsersIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.totalOrders') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ formatNumber(stats.orders) }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <ShoppingBagIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ $t('admin.totalRevenue') }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ formatCurrency(stats.revenue) }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <CurrencyDollarIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Đơn đang xử lý
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ formatNumber(stats.processing) }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="card">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('admin.recentOrders') }}
        </h2>
      </div>
      
      <div v-if="loading" class="p-8 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="recentOrders.length === 0" class="p-8 text-center text-gray-500">
        Chưa có đơn hàng nào
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Mã đơn
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Khách hàng
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Gói
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Giá
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Trạng thái
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Ngày tạo
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="order in recentOrders" :key="order._id">
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                {{ order.orderCode }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                {{ order.userId?.username || 'Unknown' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                {{ order.packageName }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                {{ formatCurrency(order.totalPrice) }}
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusBadgeClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(order.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { orderApi, userApi } from '@/services/api.js';
import {
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const toast = useToast();

const loading = ref(true);
const stats = ref({
  users: 0,
  orders: 0,
  revenue: 0,
  processing: 0
});
const recentOrders = ref([]);

const formatNumber = (num) => {
  return num?.toLocaleString('vi-VN') || '0';
};

const formatCurrency = (amount) => {
  return (amount || 0).toLocaleString('vi-VN') + ' ₫';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'badge-warning',
    processing: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    refunded: 'badge-danger'
  };
  return `badge ${classes[status] || 'badge-info'}`;
};

const fetchDashboardData = async () => {
  try {
    const [ordersRes, usersRes] = await Promise.all([
      orderApi.getAllOrders({ limit: 5 }),
      userApi.getAdminUserStats()
    ]);

    if (ordersRes.success) {
      recentOrders.value = ordersRes.data;
      stats.value.orders = ordersRes.pagination?.total || 0;
    }

    if (usersRes.success) {
      stats.value.users = usersRes.data?.overview?.total || 0;
    }
  } catch (error) {
    toast.error('Không thể tải dữ liệu dashboard');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboardData);
</script>
