<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p class="text-slate-400 mt-1">Tổng quan hệ thống</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span class="text-sm text-emerald-400">Hệ thống hoạt động</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-500/20 rounded-xl">
              <UsersIcon class="w-6 h-6 text-blue-400" />
            </div>
            <Badge variant="info">Người dùng</Badge>
          </div>
          <p class="text-3xl font-bold text-white">{{ formatNumber(stats.users) }}</p>
          <p class="text-slate-400 text-sm mt-1">Tổng số user</p>
        </GlassCard>

        <GlassCard class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-500/20 rounded-xl">
              <ShoppingBagIcon class="w-6 h-6 text-emerald-400" />
            </div>
            <Badge variant="success">Đơn hàng</Badge>
          </div>
          <p class="text-3xl font-bold text-white">{{ formatNumber(stats.orders) }}</p>
          <p class="text-slate-400 text-sm mt-1">Tổng số đơn</p>
        </GlassCard>

        <GlassCard class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-amber-500/20 rounded-xl">
              <BuildingStorefrontIcon class="w-6 h-6 text-amber-400" />
            </div>
            <Badge variant="warning">Seller</Badge>
          </div>
          <p class="text-3xl font-bold text-white">{{ formatNumber(stats.sellers) }}</p>
          <p class="text-slate-400 text-sm mt-1">Tổng số seller</p>
        </GlassCard>

        <GlassCard class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-violet-500/20 rounded-xl">
              <CubeIcon class="w-6 h-6 text-violet-400" />
            </div>
            <Badge variant="primary">Sản phẩm</Badge>
          </div>
          <p class="text-3xl font-bold text-white">{{ formatNumber(stats.products) }}</p>
          <p class="text-slate-400 text-sm mt-1">Tổng số sản phẩm</p>
        </GlassCard>
      </div>

      <!-- Recent Orders -->
      <GlassCard>
        <div class="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white">Đơn hàng gần đây</h2>
          <router-link to="/admin/orders" class="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Xem tất cả
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-700/30">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Mã đơn</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Khách hàng</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Sản phẩm</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Giá</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr v-for="order in recentOrders" :key="order._id" class="hover:bg-slate-700/30 transition-colors">
                <td class="px-6 py-4 text-white font-medium">{{ order.orderCode }}</td>
                <td class="px-6 py-4 text-slate-300">{{ order.buyer?.username || 'N/A' }}</td>
                <td class="px-6 py-4 text-slate-300">{{ order.productName || order.packageName }}</td>
                <td class="px-6 py-4 text-blue-400 font-medium">{{ formatPrice(order.totalPrice) }}</td>
                <td class="px-6 py-4">
                  <Badge :variant="getStatusVariant(order.status)">
                    {{ getStatusLabel(order.status) }}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { orderApi, userApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import Badge from '@/components/ui/Badge.vue';
import {
  UsersIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  CubeIcon
} from '@heroicons/vue/24/solid';

const toast = useToast();
const loading = ref(true);
const stats = ref({ users: 0, orders: 0, sellers: 0, products: 0 });
const recentOrders = ref([]);

const formatNumber = (num) => num?.toLocaleString('vi-VN') || '0';
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
    // Mock data for sellers and products
    stats.value.sellers = 42;
    stats.value.products = 128;
  } catch (error) {
    toast.error('Không thể tải dữ liệu');
    // Fallback data
    stats.value = { users: 1250, orders: 3847, sellers: 42, products: 128 };
    recentOrders.value = [
      { _id: '1', orderCode: 'ORD001', buyer: { username: 'user1' }, productName: 'Discord Nitro', totalPrice: 150000, status: 'completed' },
      { _id: '2', orderCode: 'ORD002', buyer: { username: 'user2' }, productName: 'Spotify Premium', totalPrice: 50000, status: 'processing' },
      { _id: '3', orderCode: 'ORD003', buyer: { username: 'user3' }, productName: 'Game Pass', totalPrice: 200000, status: 'pending' }
    ];
  }
};

onMounted(fetchDashboardData);
</script>
