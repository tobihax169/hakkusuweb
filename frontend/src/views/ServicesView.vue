<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('services.title') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {{ $t('services.subtitle') }}
        </p>

        <!-- Search Box -->
        <div class="max-w-md mx-auto relative">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            >
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
          <p v-if="searchQuery" class="text-sm text-gray-500 mt-2">
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
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-bounce">
          <CubeIcon class="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Chưa có sản phẩm nào
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          Vui lòng quay lại sau hoặc liên hệ admin để thêm sản phẩm
        </p>
      </div>

      <!-- Empty State - Search No Results -->
      <div v-else-if="filteredServices.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <MagnifyingGlassIcon class="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          Không có sản phẩm nào khớp với "{{ searchQuery }}"
        </p>
        <button
          @click="searchQuery = ''"
          class="mt-4 px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          Xóa tìm kiếm
        </button>
      </div>

      <!-- Packages Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(pkg, index) in filteredServices"
          :key="pkg.id"
          :class="[
            'card card-hover relative flex flex-col animate-slide-up',
            pkg.popular ? 'ring-2 ring-primary-500' : ''
          ]"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Popular Badge -->
          <div v-if="pkg.popular" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="badge badge-info">
              <StarIcon class="w-3 h-3 mr-1" />
              {{ $t('services.popular') }}
            </span>
          </div>

          <!-- Header -->
          <div class="p-6 text-center border-b border-gray-100 dark:border-gray-700">
            <div class="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <component :is="getIcon(pkg.icon)" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ pkg.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ pkg.description }}</p>
          </div>

          <!-- Price -->
          <div class="p-6 text-center">
            <div class="flex items-baseline justify-center gap-1">
              <span v-if="pkg.price > 0" class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ formatPrice(pkg.price) }}
              </span>
              <span v-else class="text-4xl font-bold text-gray-900 dark:text-white">
                {{ $t('services.contact') }}
              </span>
            </div>
            <span v-if="pkg.price > 0" class="text-gray-500 dark:text-gray-400">VND</span>
          </div>

          <!-- Features -->
          <div class="flex-1 px-6 pb-6">
            <ul class="space-y-3">
              <li
                v-for="(feature, idx) in pkg.features"
                :key="idx"
                class="flex items-start gap-3"
              >
                <CheckIcon class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ feature.text }}</span>
              </li>
            </ul>
          </div>

          <!-- Action -->
          <div class="p-6 pt-0">
            <button
              @click="selectPackage(pkg)"
              :class="[
                'w-full btn',
                pkg.popular ? 'btn-primary' : 'btn-secondary'
              ]"
            >
              {{ $t('services.orderNow') }}
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
