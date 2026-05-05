<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Quản lý đơn hàng
        </h1>
        <p class="text-slate-400 mt-1">Xem và quản lý tất cả đơn hàng trong hệ thống</p>
      </div>

      <!-- Filters -->
      <GlassCard class="p-4 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="relative flex-1 min-w-[300px]">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="Tìm kiếm mã đơn, khách hàng..."
              class="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 outline-none focus:border-blue-500/50"
              @keyup.enter="fetchOrders"
            >
          </div>
          <select v-model="filters.status" @change="fetchOrders" class="px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <button @click="fetchOrders" class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all">
            <MagnifyingGlassIcon class="w-5 h-5" />
          </button>
        </div>
      </GlassCard>

      <!-- Orders Table -->
      <GlassCard>
        <div v-if="loading" class="p-12 flex justify-center">
          <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
        <div v-else-if="orders.length === 0" class="p-12 text-center">
          <ShoppingBagIcon class="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <p class="text-slate-400">Không tìm thấy đơn hàng nào</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-700/30">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Mã đơn</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Khách hàng</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Sản phẩm</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Giá</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr v-for="order in orders" :key="order._id" class="hover:bg-slate-700/30 transition-colors">
                <td class="px-6 py-4 text-white font-medium">{{ order.orderCode }}</td>
                <td class="px-6 py-4 text-slate-300">{{ order.userId?.username || 'N/A' }}</td>
                <td class="px-6 py-4 text-slate-300">{{ order.productName || order.packageName || 'N/A' }}</td>
                <td class="px-6 py-4 text-blue-400 font-medium">{{ formatPrice(order.totalPrice) }}</td>
                <td class="px-6 py-4">
                  <select 
                    v-model="order.status" 
                    @change="updateOrderStatus(order)"
                    class="px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white outline-none"
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                    <option value="refunded">Hoàn tiền</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <router-link 
                    :to="`/orders/${order._id}`"
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
                  >
                    <EyeIcon class="w-4 h-4" />
                    Xem
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="flex items-center justify-between p-4 border-t border-slate-700/50">
          <span class="text-sm text-slate-400">Trang {{ pagination.page }} / {{ pagination.pages }}</span>
          <div class="flex gap-2">
            <button 
              :disabled="pagination.page === 1" 
              @click="changePage(pagination.page - 1)"
              class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Trước
            </button>
            <button 
              :disabled="pagination.page === pagination.pages" 
              @click="changePage(pagination.page + 1)"
              class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { orderApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  EyeIcon
} from '@heroicons/vue/24/solid';

const toast = useToast();
const loading = ref(true);
const orders = ref([]);
const filters = reactive({ search: '', status: '', page: 1, limit: 20 });
const pagination = ref({ page: 1, pages: 1, total: 0 });

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await orderApi.getAllOrders(filters);
    if (response.success) {
      orders.value = response.data;
      pagination.value = response.pagination;
    }
  } catch (error) {
    toast.error('Không thể tải đơn hàng');
    // Fallback data
    orders.value = [
      { _id: '1', orderCode: 'ORD001', userId: { username: 'user1' }, productName: 'Discord Nitro', totalPrice: 150000, status: 'completed' },
      { _id: '2', orderCode: 'ORD002', userId: { username: 'user2' }, productName: 'Spotify Premium', totalPrice: 50000, status: 'processing' },
      { _id: '3', orderCode: 'ORD003', userId: { username: 'user3' }, productName: 'Game Pass', totalPrice: 200000, status: 'pending' }
    ];
  } finally {
    loading.value = false;
  }
};

const updateOrderStatus = async (order) => {
  try {
    await orderApi.updateOrder(order._id, { status: order.status });
    toast.success('Cập nhật trạng thái thành công');
  } catch (error) {
    toast.error('Không thể cập nhật trạng thái');
  }
};

const changePage = (page) => {
  filters.page = page;
  fetchOrders();
};

onMounted(fetchOrders);
</script>
