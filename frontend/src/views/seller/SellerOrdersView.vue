<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="relative z-10 max-w-5xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/seller/dashboard" class="p-2 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 text-slate-400">
          ←
        </router-link>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Đơn hàng của tôi
          </h1>
          <p class="text-slate-400 mt-1">Đơn marketplace gắn với cửa hàng của bạn</p>
        </div>
      </div>

      <GlassCard>
        <div v-if="loading" class="p-12 flex justify-center">
          <div class="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
        <div v-else-if="orders.length === 0" class="p-12 text-center text-slate-400">
          Chưa có đơn hàng nào
        </div>
        <div v-else class="divide-y divide-slate-700/50">
          <div
            v-for="order in orders"
            :key="order._id"
            class="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
          >
            <div>
              <p class="text-white font-medium">{{ order.orderCode }}</p>
              <p class="text-slate-500 text-sm">{{ order.packageName }} — {{ order.userId?.username }}</p>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-blue-400 font-medium">{{ formatPrice(order.totalPrice) }}</p>
              <Badge :variant="statusVariant(order.status)">{{ order.status }}</Badge>
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

const toast = useToast();
const loading = ref(true);
const orders = ref([]);

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);

const statusVariant = (status) =>
  ({ pending: 'warning', processing: 'info', completed: 'success', cancelled: 'danger', refunded: 'default' }[status] ||
    'default');

const load = async () => {
  loading.value = true;
  try {
    const res = await sellerApi.getMyOrders({ limit: 50 });
    if (res.success) orders.value = res.data?.orders || [];
  } catch (e) {
    toast.error(e.message || 'Không thể tải đơn hàng');
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>
