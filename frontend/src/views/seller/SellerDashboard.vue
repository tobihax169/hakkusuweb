<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Bảng điều khiển người bán
          </h1>
          <p class="text-slate-400 mt-1">Quản lý cửa hàng và sản phẩm</p>
        </div>
        <router-link to="/seller/products/create" class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
          <PlusIcon class="w-5 h-5" />
          Thêm sản phẩm
        </router-link>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-500/20 rounded-xl">
              <CubeIcon class="w-6 h-6 text-blue-400" />
            </div>
            <span class="text-xs text-slate-500">Sản phẩm</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.products }}</p>
        </GlassCard>

        <GlassCard class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-500/20 rounded-xl">
              <ShoppingBagIcon class="w-6 h-6 text-emerald-400" />
            </div>
            <span class="text-xs text-slate-500">Đơn hàng</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.orders }}</p>
        </GlassCard>

        <GlassCard class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-amber-500/20 rounded-xl">
              <CurrencyDollarIcon class="w-6 h-6 text-amber-400" />
            </div>
            <span class="text-xs text-slate-500">Doanh thu</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ formatPrice(stats.revenue) }}</p>
        </GlassCard>

        <GlassCard class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-violet-500/20 rounded-xl">
              <EyeIcon class="w-6 h-6 text-violet-400" />
            </div>
            <span class="text-xs text-slate-500">Lượt xem</span>
          </div>
          <p class="text-3xl font-bold text-white">{{ stats.views }}</p>
        </GlassCard>
      </div>

      <!-- Recent Orders -->
      <GlassCard>
        <div class="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white">Đơn hàng gần đây</h2>
          <router-link to="/seller/orders" class="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Xem tất cả
          </router-link>
        </div>
        <div v-if="loading" class="p-8 flex justify-center">
          <div class="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
        <div v-else-if="recentOrders.length === 0" class="p-8 text-center">
          <p class="text-slate-400">Chưa có đơn hàng nào</p>
        </div>
        <div v-else class="divide-y divide-slate-700/50">
          <div 
            v-for="order in recentOrders" 
            :key="order._id"
            class="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
          >
            <div>
              <p class="text-white font-medium">{{ order.orderCode }}</p>
              <p class="text-slate-500 text-sm">{{ order.productName }} - {{ order.buyer?.username }}</p>
            </div>
            <div class="text-right">
              <p class="text-blue-400 font-medium">{{ formatPrice(order.totalPrice) }}</p>
              <Badge :variant="getStatusVariant(order.status)">{{ getStatusLabel(order.status) }}</Badge>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { sellerApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import Badge from '@/components/ui/Badge.vue';
import {
  PlusIcon,
  CubeIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  EyeIcon
} from '@heroicons/vue/24/solid';

const toast = useToast();
const loading = ref(true);
const stats = ref({ products: 0, orders: 0, revenue: 0, views: 0 });
const recentOrders = ref([]);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);

const getStatusVariant = (status) => ({
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  cancelled: 'danger'
}[status] || 'default');

const getStatusLabel = (status) => ({
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
}[status] || status);

const fetchDashboard = async () => {
  try {
    const response = await sellerApi.getDashboard();
    if (response.success && response.data?.stats) {
      const s = response.data.stats;
      stats.value = {
        products: s.products?.total ?? 0,
        orders: s.orders?.total ?? 0,
        revenue: s.revenue?.total ?? 0,
        views: s.views ?? 0
      };
      recentOrders.value = response.data.recentOrders || [];
    }
  } catch (error) {
    toast.error(error.message || 'Không thể tải dữ liệu');
    stats.value = { products: 0, orders: 0, revenue: 0, views: 0 };
    recentOrders.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDashboard);
</script>
