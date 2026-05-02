<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
          {{ $t('admin.dashboard') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Tổng quan hệ thống và hoạt động gần đây</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ currentDate }}</span>
        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>
    </div>

    <!-- Stats Cards - Glassmorphism -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Users Card -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <UsersIcon class="w-6 h-6 text-white" />
            </div>
            <span class="flex items-center gap-1 text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              <ArrowUpIcon class="w-4 h-4" /> 12%
            </span>
          </div>
          <p class="text-blue-100 text-sm font-medium">{{ $t('admin.totalUsers') }}</p>
          <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.users) }}</p>
        </div>
      </div>

      <!-- Orders Card -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <ShoppingBagIcon class="w-6 h-6 text-white" />
            </div>
            <span class="flex items-center gap-1 text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              <ArrowUpIcon class="w-4 h-4" /> 8%
            </span>
          </div>
          <p class="text-emerald-100 text-sm font-medium">{{ $t('admin.totalOrders') }}</p>
          <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.orders) }}</p>
        </div>
      </div>

      <!-- Revenue Card -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <CurrencyDollarIcon class="w-6 h-6 text-white" />
            </div>
            <span class="flex items-center gap-1 text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              <ArrowUpIcon class="w-4 h-4" /> 24%
            </span>
          </div>
          <p class="text-amber-100 text-sm font-medium">{{ $t('admin.totalRevenue') }}</p>
          <p class="text-3xl font-bold mt-1">{{ formatCurrency(stats.revenue) }}</p>
        </div>
      </div>

      <!-- Processing Card -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <ClockIcon class="w-6 h-6 text-white" />
            </div>
            <span class="px-2 py-1 text-xs font-medium bg-white/20 rounded-full">Cần xử lý</span>
          </div>
          <p class="text-purple-100 text-sm font-medium">Đơn đang xử lý</p>
          <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.processing) }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Orders - Glass Card -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <ShoppingBagIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ $t('admin.recentOrders') }}
          </h2>
        </div>
        <router-link to="/admin/orders" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
          Xem tất cả
          <ArrowRightIcon class="w-4 h-4" />
        </router-link>
      </div>
      
      <div v-if="loading" class="p-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else-if="recentOrders.length === 0" class="p-12 text-center">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <ShoppingBagIcon class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-500 dark:text-gray-400">Chưa có đơn hàng nào</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50/50 dark:bg-gray-800/50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mã đơn</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Khách hàng</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gói</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giá</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ngày tạo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="order in recentOrders" :key="order._id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-semibold text-gray-900 dark:text-white">
                  #{{ order.orderCode }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {{ order.userId?.username?.charAt(0) || '?' }}
                  </div>
                  <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">{{ order.userId?.username || 'Unknown' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ order.packageName }}</td>
              <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{{ formatCurrency(order.totalPrice) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusBadgeClass(order.status)">{{ getStatusLabel(order.status) }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(order.createdAt) }}</td>
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
  ClockIcon,
  ArrowUpIcon,
  ArrowRightIcon
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

const currentDate = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const formatNumber = (num) => {
  return num?.toLocaleString('vi-VN') || '0';
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount || 0);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    processing: 'px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    completed: 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    cancelled: 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    refunded: 'px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
  };
  return classes[status] || classes.processing;
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    refunded: 'Hoàn tiền'
  };
  return labels[status] || status;
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
