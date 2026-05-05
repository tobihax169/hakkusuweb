<template>
  <div class="min-h-screen">
    <!-- Animated Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <!-- Animated gradient blobs -->
      <div class="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-600/20 via-indigo-500/15 to-violet-500/10 rounded-full blur-[100px] animate-pulse" />
      <div class="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-indigo-500/15 rounded-full blur-[80px] animate-pulse" style="animation-delay: 1s;" />
      <div class="absolute -bottom-[10%] right-[20%] w-[500px] h-[500px] bg-gradient-to-tl from-violet-500/15 via-fuchsia-500/10 to-blue-500/10 rounded-full blur-[90px] animate-pulse" style="animation-delay: 2s;" />

      <!-- Grid pattern overlay -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <!-- Floating particles -->
      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce" style="animation-duration: 3s;" />
      <div class="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-indigo-400/40 rounded-full animate-bounce" style="animation-duration: 4s; animation-delay: 1s;" />
      <div class="absolute bottom-1/3 left-1/3 w-2 h-2 bg-violet-400/40 rounded-full animate-bounce" style="animation-duration: 3.5s; animation-delay: 0.5s;" />
      <div class="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400/40 rounded-full animate-bounce" style="animation-duration: 5s; animation-delay: 2s;" />
    </div>

    <div class="relative z-10">
      <!-- Hero Banner -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto text-center">
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p class="text-blue-100/90 text-base mb-5">Khám phá hàng ngàn sản phẩm từ các seller uy tín</p>

          <!-- Search -->
          <div class="relative max-w-lg mx-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:bg-white/20 outline-none text-sm"
              @keyup.enter="searchProducts"
            >
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Categories -->
          <aside class="lg:w-64 flex-shrink-0">
            <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 sticky top-24">
              <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bars3Icon class="w-5 h-5 text-blue-400" />
                Danh mục
              </h2>
              <nav class="space-y-1">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="selectedCategory = category.id"
                  :class="[
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
                    selectedCategory === category.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  ]"
                >
                  <component :is="category.icon" class="w-5 h-5" />
                  <span class="text-sm font-medium">{{ category.name }}</span>
                  <span class="ml-auto text-xs text-slate-500">{{ category.count }}</span>
                </button>
              </nav>
            </div>
          </aside>

          <!-- Products Grid -->
          <main class="flex-1">
            <!-- Filters & Sort -->
            <div class="flex items-center justify-between mb-6">
              <span class="text-slate-400 text-sm">{{ filteredProducts.length }} sản phẩm</span>
              <select v-model="sortBy" class="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white outline-none">
                <option value="popular">Phổ biến nhất</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div v-for="i in 8" :key="i" class="bg-slate-800/50 rounded-2xl h-72 animate-pulse" />
            </div>

            <!-- Empty -->
            <div v-else-if="filteredProducts.length === 0" class="text-center py-20">
              <ShoppingBagIcon class="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <p class="text-slate-400">Không tìm thấy sản phẩm nào</p>
            </div>

            <!-- Products -->
            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="product in filteredProducts"
                :key="product.id"
                class="group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                @click="viewProduct(product)"
              >
                <div class="relative aspect-square overflow-hidden bg-slate-700/50">
                  <img 
                    v-if="product.image" 
                    :src="product.image" 
                    :alt="product.name" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  >
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <CubeIcon class="w-16 h-16 text-slate-600" />
                  </div>
                  <div v-if="product.discount" class="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                    -{{ product.discount }}%
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-sm text-white font-medium line-clamp-2 mb-2 min-h-[2.5rem]">{{ product.name }}</h3>
                  <div class="flex items-baseline gap-2 mb-2">
                    <span class="text-lg font-bold text-blue-400">{{ formatPrice(product.price) }}</span>
                    <span v-if="product.originalPrice" class="text-xs text-slate-500 line-through">{{ formatPrice(product.originalPrice) }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs">
                    <div class="flex items-center">
                      <StarIcon class="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span class="text-slate-400 ml-1">{{ product.rating || '4.5' }}</span>
                    </div>
                    <span class="text-slate-600">|</span>
                    <span class="text-slate-400">Đã bán {{ formatNumber(product.sold || 0) }}</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-2">{{ product.seller?.storeName || 'Hakkusu Store' }}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.js';
import { serviceApi } from '@/services/api.js';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  StarIcon,
  Bars3Icon,
  CubeIcon,
  GiftIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  PuzzlePieceIcon,
  SparklesIcon
} from '@heroicons/vue/24/solid';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const loading = ref(true);
const products = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('all');
const sortBy = ref('popular');

const categories = ref([
  { id: 'all', name: 'Tất cả', icon: ShoppingBagIcon, count: 0 },
  { id: 'game', name: 'Game', icon: PuzzlePieceIcon, count: 0 },
  { id: 'software', name: 'Software', icon: ComputerDesktopIcon, count: 0 },
  { id: 'mobile', name: 'Mobile', icon: DevicePhoneMobileIcon, count: 0 },
  { id: 'giftcard', name: 'Gift Cards', icon: GiftIcon, count: 0 },
  { id: 'service', name: 'Dịch vụ', icon: SparklesIcon, count: 0 }
]);

const filteredProducts = computed(() => {
  let result = [...products.value];
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(p => p.name?.toLowerCase().includes(query));
  }
  
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value);
  }
  
  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  return result;
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);
};

const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

const viewProduct = (product) => {
  if (!authStore.isAuthenticated) {
    toast.info('Vui lòng đăng nhập để mua hàng');
    router.push('/auth/login');
    return;
  }
  router.push(`/orders/new?product=${product.id}`);
};

const searchProducts = () => {};

const fetchProducts = async () => {
  try {
    const response = await serviceApi.getServices();
    products.value = (response.data || []).map((s, i) => ({
      id: s.id || s._id || i,
      name: s.name,
      price: s.price,
      originalPrice: s.originalPrice,
      image: s.image,
      category: s.category || 'other',
      rating: (4 + Math.random() * 0.9).toFixed(1),
      sold: Math.floor(Math.random() * 5000) + 100,
      discount: s.discount || Math.floor(Math.random() * 30),
      seller: s.seller,
      createdAt: s.createdAt || new Date()
    }));
    categories.value[0].count = products.value.length;
  } catch (error) {
    toast.error('Không thể tải sản phẩm');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProducts);
</script>
