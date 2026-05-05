<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-3xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button @click="$router.back()" class="p-2 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors">
          <ArrowLeftIcon class="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-white">Chi tiết đơn hàng</h1>
          <p class="text-slate-400 text-sm">{{ order?.orderCode }}</p>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>

      <div v-else-if="!order" class="text-center py-12">
        <p class="text-slate-400">Không tìm thấy đơn hàng</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Status Card -->
        <GlassCard class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm mb-2">Trạng thái đơn hàng</p>
              <Badge :variant="getStatusVariant(order.status)" size="lg">
                {{ getStatusLabel(order.status) }}
              </Badge>
            </div>
            <div class="text-right">
              <p class="text-slate-400 text-sm mb-2">Ngày đặt</p>
              <p class="text-white">{{ formatDate(order.createdAt) }}</p>
            </div>
          </div>
        </GlassCard>

        <!-- Product Info -->
        <GlassCard class="p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Thông tin sản phẩm</h2>
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 bg-slate-700/50 rounded-xl flex items-center justify-center">
              <CubeIcon class="w-10 h-10 text-blue-400" />
            </div>
            <div>
              <h3 class="text-white font-medium text-lg">{{ order.productName || order.packageName }}</h3>
              <p class="text-blue-400 font-bold text-2xl mt-1">{{ formatPrice(order.totalPrice) }}</p>
            </div>
          </div>
        </GlassCard>

        <!-- Delivery Info -->
        <GlassCard class="p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Thông tin giao hàng</h2>
          <div class="bg-slate-900/50 rounded-xl p-4">
            <p class="text-white whitespace-pre-wrap">{{ order.deliveryInfo || 'Chưa cập nhật' }}</p>
          </div>
        </GlassCard>

        <!-- Notes -->
        <GlassCard v-if="order.notes" class="p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Ghi chú</h2>
          <p class="text-slate-300">{{ order.notes }}</p>
        </GlassCard>

        <!-- Actions -->
        <div v-if="order.status === 'pending'" class="flex gap-4">
          <button 
            @click="cancelOrder" 
            :disabled="cancelling"
            class="flex-1 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {{ cancelling ? 'Đang hủy...' : 'Hủy đơn hàng' }}
          </button>
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
import GlassCard from '@/components/ui/GlassCard.vue';
import Badge from '@/components/ui/Badge.vue';
import { ArrowLeftIcon, CubeIcon } from '@heroicons/vue/24/solid';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const order = ref(null);
const loading = ref(true);
const cancelling = ref(false);

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

const fetchOrder = async () => {
  try {
    const response = await orderApi.getOrderById(route.params.id);
    if (response.success) {
      order.value = response.data;
    }
  } catch (error) {
    toast.error('Không thể tải thông tin đơn hàng');
  } finally {
    loading.value = false;
  }
};

const cancelOrder = async () => {
  if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
  cancelling.value = true;
  try {
    await orderApi.cancelOrder(order.value._id);
    toast.success('Đã hủy đơn hàng');
    order.value.status = 'cancelled';
  } catch (error) {
    toast.error('Không thể hủy đơn hàng');
  } finally {
    cancelling.value = false;
  }
};

onMounted(fetchOrder);
</script>
