<template>
  <div class="py-8 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium mb-3">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          Seller Dashboard
        </span>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent font-display">
          Quản lý cửa hàng
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Theo dõi doanh thu, sản phẩm và đơn hàng của bạn
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner class="w-12 h-12" />
      </div>

      <!-- Stats Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Revenue -->
        <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-5 border-2 border-blue-100 dark:border-blue-500/20 shadow-lg hover:shadow-xl transition-all">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <CurrencyDollarIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Tổng doanh thu</p>
              <p class="text-2xl font-bold text-slate-800 dark:text-white">
                {{ formatPrice(stats.revenue.total) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Available Balance -->
        <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-5 border-2 border-indigo-100 dark:border-indigo-500/20 shadow-lg hover:shadow-xl transition-all">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <WalletIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Số dư khả dụng</p>
              <p class="text-2xl font-bold text-slate-800 dark:text-white">
                {{ formatPrice(stats.revenue.available) }}
              </p>
            </div>
          </div>
          <button
            @click="showWithdrawalModal = true"
            :disabled="stats.revenue.available < 10000"
            class="mt-4 w-full text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-slate-400"
          >
            Rút tiền →
          </button>
        </div>

        <!-- Products -->
        <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-5 border-2 border-cyan-100 dark:border-cyan-500/20 shadow-lg hover:shadow-xl transition-all">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <CubeIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Sản phẩm</p>
              <p class="text-2xl font-bold text-slate-800 dark:text-white">
                {{ stats.products.total }}
              </p>
            </div>
          </div>
          <p v-if="stats.products.pending > 0" class="mt-2 text-sm text-amber-600">
            {{ stats.products.pending }} chờ duyệt
          </p>
        </div>

        <!-- Orders -->
        <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-5 border-2 border-violet-100 dark:border-violet-500/20 shadow-lg hover:shadow-xl transition-all">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg">
              <ShoppingBagIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">Đơn hàng</p>
              <p class="text-2xl font-bold text-slate-800 dark:text-white">
                {{ stats.orders.total }}
              </p>
            </div>
          </div>
          <p v-if="stats.orders.pending > 0" class="mt-2 text-sm text-amber-600">
            {{ stats.orders.pending }} đang xử lý
          </p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex flex-wrap gap-4 mb-8">
        <router-link
          to="/seller/products/create"
          class="btn btn-primary inline-flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          Đăng Sản Phẩm Mới
        </router-link>
        <router-link
          to="/seller/products"
          class="btn btn-secondary inline-flex items-center gap-2"
        >
          <CubeIcon class="w-5 h-5" />
          Quản Lý Sản Phẩm
        </router-link>
        <router-link
          to="/seller/orders"
          class="btn btn-secondary inline-flex items-center gap-2"
        >
          <ShoppingBagIcon class="w-5 h-5" />
          Xem Đơn Hàng
        </router-link>
      </div>

      <!-- Recent Orders -->
      <div class="card">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Đơn Hàng Gần Đây
        </h2>
        <div v-if="recentOrders.length === 0" class="text-center py-8 text-gray-500">
          Chưa có đơn hàng nào
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th class="pb-3">Mã đơn</th>
                <th class="pb-3">Sản phẩm</th>
                <th class="pb-3">Doanh thu</th>
                <th class="pb-3">Trạng thái</th>
                <th class="pb-3">Ngày</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in recentOrders"
                :key="order._id"
                class="border-b border-gray-100 dark:border-gray-800 text-sm"
              >
                <td class="py-3 font-medium">{{ order.orderCode }}</td>
                <td class="py-3">{{ order.packageName }}</td>
                <td class="py-3 text-green-600">+{{ formatPrice(order.sellerAmount) }}</td>
                <td class="py-3">
                  <span :class="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="py-3 text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Seller Info Alert -->
      <div v-if="sellerInfo && !sellerInfo.isVerified" class="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div class="flex items-start gap-3">
          <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 class="font-semibold text-yellow-800 dark:text-yellow-200">Tài khoản đang chờ xác minh</h3>
            <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Tài khoản seller của bạn đang chờ admin phê duyệt. Bạn có thể đăng sản phẩm nhưng sản phẩm sẽ chỉ hiển thị sau khi được duyệt.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { sellerApi } from '@/services/sellerApi.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import {
  CurrencyDollarIcon,
  WalletIcon,
  CubeIcon,
  ShoppingBagIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

const toast = useToast();
const loading = ref(true);
const showWithdrawalModal = ref(false);

const sellerInfo = ref({});
const stats = ref({
  products: { total: 0, pending: 0 },
  orders: { total: 0, pending: 0 },
  revenue: { total: 0, available: 0, pending: 0 }
});
const recentOrders = ref([]);

const formatPrice = (price) => {
  return price?.toLocaleString('vi-VN') + 'đ' || '0đ';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

const getStatusClass = (status) => {
  const classes = {
    pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-xs',
    processing: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-xs',
    completed: 'text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-xs',
    cancelled: 'text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-xs'
  };
  return classes[status] || 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 px-2 py-1 rounded text-xs';
};

const fetchDashboard = async () => {
  try {
    const response = await sellerApi.getDashboard();
    const data = response.data.data;
    sellerInfo.value = data.sellerInfo;
    stats.value = data.stats;
    recentOrders.value = []; // Will be populated from orders API
  } catch (error) {
    toast.error('Không thể tải dashboard');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboard);
</script>
