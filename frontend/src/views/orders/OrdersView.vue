<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-6xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Đơn hàng của tôi
          </h1>
          <p class="text-slate-400 mt-1">Quản lý và theo dõi đơn hàng</p>
        </div>
        <router-link 
          to="/orders/new" 
          class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 self-start"
        >
          <PlusIcon class="w-5 h-5" />
          Tạo đơn hàng
        </router-link>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-3 mb-6">
        <button 
          v-for="status in statusFilters" 
          :key="status.value"
          @click="selectedStatus = status.value"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            selectedStatus === status.value
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'
          ]"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- Orders List -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-slate-800/50 rounded-2xl h-32 animate-pulse" />
      </div>

      <div v-else-if="filteredOrders.length === 0" class="text-center py-20">
        <ShoppingBagIcon class="w-16 h-16 mx-auto text-slate-600 mb-4" />
        <h3 class="text-xl font-semibold text-white mb-2">Chưa có đơn hàng nào</h3>
        <p class="text-slate-400 mb-6">Bắt đầu mua sắm ngay hôm nay</p>
        <router-link to="/services" class="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
          Khám phá sản phẩm
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <GlassCard 
          v-for="order in filteredOrders" 
          :key="order._id" 
          hover
          class="p-6 cursor-pointer"
          @click="viewOrder(order._id)"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-white font-semibold">{{ order.orderCode }}</span>
                <Badge :variant="getStatusVariant(order.status)">
                  {{ getStatusLabel(order.status) }}
                </Badge>
              </div>
              <p class="text-slate-300">{{ order.productName || order.packageName }}</p>
              <p class="text-slate-500 text-sm mt-1">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-xl font-bold text-blue-400">{{ formatPrice(order.totalPrice) }}</span>
              <ChevronRightIcon class="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { orderApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import Badge from '@/components/ui/Badge.vue';
import { PlusIcon, ShoppingBagIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const toast = useToast();

const loading = ref(true);
const orders = ref([]);
const selectedStatus = ref('');

const statusFilters = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Đang chờ' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
];

const filteredOrders = computed(() => {
  if (!selectedStatus.value) return orders.value;
  return orders.value.filter(o => o.status === selectedStatus.value);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusVariant = (status) => ({
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  cancelled: 'danger'
}[status] || 'default');

const getStatusLabel = (status) => ({
  pending: 'Đang chờ',
  processing: 'Đang xử lý',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
}[status] || status);

const viewOrder = (id) => {
  router.push(`/orders/${id}`);
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await orderApi.getMyOrders();
    if (response.success) {
      orders.value = response.data;
    }
  } catch (error) {
    toast.error('Không thể tải đơn hàng');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchOrders);
</script>
