<template>
  <div class="py-12 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Modern Header -->
      <div class="text-center mb-12">
        <span class="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium mb-4">サービス Services</span>
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4 font-display">
          {{ $t('services.title') }}
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 mb-8">
          {{ $t('services.subtitle') }}
        </p>

        <!-- Modern Search Box -->
        <div class="max-w-md mx-auto relative">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              class="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-blue-100 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-800 dark:text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50 outline-none transition-all shadow-lg shadow-blue-100/50"
            >
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
          <p v-if="searchQuery" class="text-sm text-slate-500 mt-3 flex items-center justify-center gap-1">
            Tìm thấy {{ filteredServices.length }} sản phẩm
          </p>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <CardSkeleton v-for="i in 4" :key="i" :show-image="false" />
      </div>

      <!-- Empty State - No Services -->
      <div v-else-if="services.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
          <svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          Chưa có sản phẩm nào
        </h3>
        <p class="text-slate-500 dark:text-slate-400">
          Vui lòng quay lại sau hoặc liên hệ admin để thêm sản phẩm
        </p>
      </div>

      <!-- Empty State - Search No Results -->
      <div v-else-if="filteredServices.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center">
          <svg class="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p class="text-slate-500 dark:text-slate-400">
          Không có sản phẩm nào khớp với "{{ searchQuery }}"
        </p>
        <button
          @click="searchQuery = ''"
          class="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          Xóa tìm kiếm
        </button>
      </div>

      <!-- Modern Packages Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(pkg, index) in filteredServices"
          :key="pkg.id"
          class="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl relative flex flex-col overflow-hidden border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2"
          :class="{ 'ring-2 ring-blue-400 dark:ring-blue-500/50': pkg.popular }"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Popular Badge -->
          <div v-if="pkg.popular" class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <span class="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-lg">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              {{ $t('services.popular') }}
            </span>
          </div>

          <!-- Header -->
          <div class="p-6 text-center border-b border-slate-100 dark:border-slate-700/50">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <component :is="getIcon(pkg.icon)" class="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2">{{ pkg.name }}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ pkg.description }}</p>
          </div>

          <!-- Price -->
          <div class="p-6 text-center">
            <div class="flex items-baseline justify-center gap-1">
              <span v-if="pkg.price > 0" class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
                {{ formatPrice(pkg.price) }}
              </span>
              <span v-else class="text-4xl font-bold text-blue-500">
                {{ $t('services.contact') }}
              </span>
            </div>
            <span v-if="pkg.price > 0" class="text-slate-500 dark:text-slate-400 text-sm">VND</span>
          </div>

          <!-- Features -->
          <div class="flex-1 px-6 pb-6">
            <ul class="space-y-3">
              <li
                v-for="(feature, idx) in pkg.features"
                :key="idx"
                class="flex items-start gap-3"
              >
                <div class="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckIcon class="w-3 h-3 text-blue-500" />
                </div>
                <span class="text-sm text-slate-600 dark:text-slate-300">{{ feature.text }}</span>
              </li>
            </ul>
          </div>

          <!-- Action -->
          <div class="p-6 pt-0">
            <button
              @click="selectPackage(pkg)"
              class="w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              :class="pkg.popular 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-300/50 hover:shadow-xl hover:scale-[1.02]' 
                : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20'"
            >
              <span>{{ $t('services.orderNow') }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.js';
import { serviceApi } from '@/services/api.js';
import {
  CubeIcon,
  StarIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import CardSkeleton from '@/components/common/CardSkeleton.vue';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const loading = ref(true);
const services = ref([]);
const searchQuery = ref('');

// Filtered services based on search query
const filteredServices = computed(() => {
  if (!searchQuery.value.trim()) {
    return services.value;
  }
  const query = searchQuery.value.toLowerCase().trim();
  return services.value.filter(service =>
    service.name?.toLowerCase().includes(query) ||
    service.description?.toLowerCase().includes(query) ||
    service.packageId?.toLowerCase().includes(query)
  );
});

const iconMap = {
  CubeIcon,
  StarIcon,
  SparklesIcon,
  PuzzlePieceIcon
};

const getIcon = (iconName) => iconMap[iconName] || CubeIcon;

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN');
};

const selectPackage = (pkg) => {
  if (!authStore.isAuthenticated) {
    toast.info('Vui lòng đăng nhập để đặt hàng');
    router.push('/auth/login?redirect=/orders/new');
    return;
  }
  
  router.push({
    path: '/orders/new',
    query: { package: pkg.id }
  });
};

const fetchServices = async () => {
  try {
    const response = await serviceApi.getServices();
    services.value = response.data;
  } catch (error) {
    toast.error('Không thể tải dịch vụ');
  } finally {
    loading.value = false;
  }
};

onMounted(fetchServices);
</script>
