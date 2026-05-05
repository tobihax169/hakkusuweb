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
            Sản phẩm của tôi
          </h1>
          <p class="text-slate-400 mt-1">Quản lý sản phẩm đang bán</p>
        </div>
        <router-link to="/seller/products/create" class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
          <PlusIcon class="w-5 h-5" />
          Thêm sản phẩm
        </router-link>
      </div>

      <!-- Products Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-slate-800/50 rounded-2xl h-80 animate-pulse" />
      </div>

      <div v-else-if="products.length === 0" class="text-center py-20">
        <CubeIcon class="w-16 h-16 mx-auto text-slate-600 mb-4" />
        <h3 class="text-xl font-semibold text-white mb-2">Chưa có sản phẩm nào</h3>
        <p class="text-slate-400 mb-6">Bắt đầu thêm sản phẩm để bán hàng</p>
        <router-link to="/seller/products/create" class="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
          Thêm sản phẩm đầu tiên
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <GlassCard 
          v-for="product in products" 
          :key="product._id"
          hover
          class="overflow-hidden"
        >
          <div class="relative aspect-video bg-slate-700/50">
            <img v-if="product.iconUrl" :src="product.iconUrl" class="w-full h-full object-cover" alt="">
            <div v-else class="w-full h-full flex items-center justify-center">
              <CubeIcon class="w-12 h-12 text-slate-600" />
            </div>
            <div class="absolute top-3 right-3">
              <Badge :variant="getStatusVariant(product)">{{ getStatusLabel(product) }}</Badge>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-white font-medium mb-2 line-clamp-1">{{ product.name }}</h3>
            <p class="text-blue-400 font-bold text-lg">{{ formatPrice(product.price) }}</p>
            <div class="flex items-center gap-2 mt-3 text-sm text-slate-400">
              <EyeIcon class="w-4 h-4" />
              <span>{{ product.metadata?.views ?? 0 }} lượt xem</span>
              <span class="mx-1">•</span>
              <ShoppingBagIcon class="w-4 h-4" />
              <span>{{ product.salesCount ?? 0 }} đã bán</span>
            </div>
            <div class="flex gap-2 mt-4">
              <button 
                @click="editProduct(product._id)"
                class="flex-1 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
              >
                Sửa
              </button>
              <button 
                @click="deleteProduct(product._id)"
                class="flex-1 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
              >
                Xóa
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { productApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import Badge from '@/components/ui/Badge.vue';
import {
  PlusIcon,
  CubeIcon,
  EyeIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/solid';

const router = useRouter();
const toast = useToast();
const loading = ref(true);
const products = ref([]);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);

const getStatusVariant = (product) => {
  if (product.approvalStatus === 'rejected') return 'danger';
  if (product.approvalStatus === 'pending') return 'warning';
  return product.isActive ? 'success' : 'default';
};

const getStatusLabel = (product) => {
  if (product.approvalStatus === 'rejected') return 'Từ chối';
  if (product.approvalStatus === 'pending') return 'Chờ duyệt';
  return product.isActive ? 'Đang bán' : 'Ngừng bán';
};

const fetchProducts = async () => {
  try {
    const response = await productApi.getMyProducts();
    if (response.success) products.value = response.data?.products || [];
  } catch (error) {
    toast.error(error.message || 'Không thể tải sản phẩm');
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const editProduct = (id) => router.push(`/seller/products/edit/${id}`);

const deleteProduct = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
  try {
    await productApi.deleteProduct(id);
    toast.success('Đã xóa sản phẩm');
    products.value = products.value.filter(p => p._id !== id);
  } catch (error) {
    toast.error(error.message || 'Không thể xóa sản phẩm');
  }
};

onMounted(fetchProducts);
</script>
