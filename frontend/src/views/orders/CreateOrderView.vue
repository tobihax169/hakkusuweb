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
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Tạo đơn hàng</h1>
          <p class="text-slate-400 mt-1">Điền thông tin để hoàn tất đơn hàng</p>
        </div>
      </div>

      <!-- Product Selection -->
      <div v-if="!selectedProduct" class="space-y-4">
        <h2 class="text-lg font-semibold text-white mb-4">Chọn sản phẩm</h2>
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="bg-slate-800/50 rounded-2xl h-24 animate-pulse" />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard 
            v-for="product in products" 
            :key="product.id"
            hover
            class="p-4 cursor-pointer"
            @click="selectProduct(product)"
          >
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center">
                <CubeIcon class="w-8 h-8 text-blue-400" />
              </div>
              <div class="flex-1">
                <h3 class="text-white font-medium">{{ product.name }}</h3>
                <p class="text-blue-400 font-bold text-lg">{{ formatPrice(product.price) }}</p>
              </div>
              <ChevronRightIcon class="w-5 h-5 text-slate-500" />
            </div>
          </GlassCard>
        </div>
      </div>

      <!-- Order Form -->
      <div v-else>
        <GlassCard class="p-6 mb-6">
          <div class="flex items-center justify-between pb-6 border-b border-slate-700/50">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center">
                <CubeIcon class="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-white">{{ selectedProduct.name }}</h2>
                <p class="text-blue-400 font-bold text-xl">{{ formatPrice(selectedProduct.price) }}</p>
              </div>
            </div>
            <button @click="selectedProduct = null" class="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <XMarkIcon class="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </GlassCard>

        <GlassCard class="p-6">
          <form @submit.prevent="createOrder" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Thông tin nhận hàng / Account</label>
              <textarea 
                v-model="formData.deliveryInfo" 
                rows="3" 
                required
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                placeholder="Nhập thông tin tài khoản hoặc địa chỉ nhận hàng..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Ghi chú (tùy chọn)</label>
              <textarea 
                v-model="formData.notes" 
                rows="2"
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                placeholder="Ghi chú thêm cho đơn hàng..."
              />
            </div>

            <div class="pt-6 border-t border-slate-700/50">
              <div class="flex items-center justify-between mb-6">
                <span class="text-slate-400">Tổng thanh toán</span>
                <span class="text-2xl font-bold text-blue-400">{{ formatPrice(selectedProduct.price) }}</span>
              </div>
              <button 
                type="submit" 
                :disabled="submitting"
                class="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
              >
                {{ submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng' }}
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { serviceApi, orderApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import { ArrowLeftIcon, CubeIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const products = ref([]);
const selectedProduct = ref(null);
const formData = reactive({ deliveryInfo: '', notes: '' });
const loading = ref(true);
const submitting = ref(false);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);
};

const selectProduct = (product) => {
  selectedProduct.value = product;
};

const createOrder = async () => {
  submitting.value = true;
  try {
    const response = await orderApi.createOrder({
      productId: selectedProduct.value.id,
      deliveryInfo: formData.deliveryInfo,
      notes: formData.notes,
      totalPrice: selectedProduct.value.price
    });
    if (response.success) {
      toast.success('Đặt hàng thành công!');
      router.push('/orders');
    }
  } catch (error) {
    toast.error(error.message || 'Không thể tạo đơn hàng');
  } finally {
    submitting.value = false;
  }
};

const fetchProducts = async () => {
  try {
    const response = await serviceApi.getServices();
    products.value = response.data || [];
    
    const productId = route.query.product;
    if (productId) {
      const product = products.value.find(p => p.id === productId || p._id === productId);
      if (product) selectedProduct.value = product;
    }
  } catch (error) {
    toast.error('Không thể tải sản phẩm');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProducts);
</script>
