<template>
  <div class="py-8 bg-slate-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
            Sản Phẩm Của Tôi
          </h1>
          <p class="text-slate-600 dark:text-slate-400 mt-1">
            Quản lý tất cả sản phẩm đã đăng
          </p>
        </div>
        <router-link
          to="/seller/products/create"
          class="btn btn-primary inline-flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          Đăng Sản Phẩm
        </router-link>
      </div>

      <!-- Filter Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="currentTab = tab.value"
          :class="[
            'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
            currentTab === tab.value
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700'
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            :class="[
              'ml-2 px-2 py-0.5 rounded-full text-xs',
              currentTab === tab.value
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-slate-400'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner class="w-12 h-12" />
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
          <CubeIcon class="w-12 h-12 text-slate-400" />
        </div>
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Chưa có sản phẩm nào
        </h3>
        <p class="text-slate-500 dark:text-slate-400 mb-6">
          Bắt đầu bằng cách đăng sản phẩm đầu tiên của bạn
        </p>
        <router-link
          to="/seller/products/create"
          class="btn btn-primary inline-flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          Đăng Sản Phẩm
        </router-link>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product._id"
          class="card card-hover"
        >
          <!-- Status Badge -->
          <div class="flex items-center justify-between mb-4">
            <span :class="getStatusBadgeClass(product.approvalStatus)">
              {{ getStatusLabel(product.approvalStatus) }}
            </span>
            <div class="flex gap-2">
              <router-link
                :to="`/seller/products/${product._id}/edit`"
                class="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
                title="Sửa"
              >
                <PencilIcon class="w-4 h-4" />
              </router-link>
              <button
                @click="confirmDelete(product)"
                class="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                title="Xóa"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <component :is="getIcon(product.icon)" class="w-6 h-6 text-blue-600" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-slate-900 dark:text-white truncate">
                {{ product.name }}
              </h3>
              <p class="text-lg font-bold text-blue-600">
                {{ formatPrice(product.price) }}
              </p>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-gray-800 pt-4">
            <span class="flex items-center gap-1">
              <ShoppingBagIcon class="w-4 h-4" />
              {{ product.salesCount || 0 }} đã bán
            </span>
            <span v-if="product.totalRevenue > 0" class="text-green-600">
              +{{ formatPrice(product.totalRevenue) }}
            </span>
          </div>

          <!-- Rejection Reason -->
          <div
            v-if="product.approvalStatus === 'rejected' && product.rejectionReason"
            class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300"
          >
            <strong>Lý do từ chối:</strong> {{ product.rejectionReason }}
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="card max-w-md w-full">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Xác nhận xóa
        </h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Bạn có chắc chắn muốn xóa sản phẩm "{{ productToDelete?.name }}"? Hành động này không thể hoàn tác.
        </p>
        <div class="flex gap-4">
          <button
            @click="deleteProduct"
            :disabled="deleting"
            class="btn btn-danger flex-1 disabled:opacity-50"
          >
            <span v-if="deleting">Đang xóa...</span>
            <span v-else>Xóa</span>
          </button>
          <button
            @click="showDeleteModal = false"
            class="btn btn-secondary flex-1"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { sellerApi } from '@/services/sellerApi.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import {
  PlusIcon,
  CubeIcon,
  StarIcon,
  SparklesIcon,
  PuzzlePieceIcon,
  PencilIcon,
  TrashIcon,
  ShoppingBagIcon
} from '@heroicons/vue/24/outline';

const toast = useToast();
const loading = ref(true);
const products = ref([]);
const currentTab = ref('all');
const showDeleteModal = ref(false);
const productToDelete = ref(null);
const deleting = ref(false);

const iconMap = {
  CubeIcon,
  StarIcon,
  SparklesIcon,
  PuzzlePieceIcon
};

const getIcon = (iconName) => iconMap[iconName] || CubeIcon;

const tabs = computed(() => [
  { value: 'all', label: 'Tất cả', count: products.value.length },
  { value: 'approved', label: 'Đã duyệt', count: products.value.filter(p => p.approvalStatus === 'approved').length },
  { value: 'pending', label: 'Chờ duyệt', count: products.value.filter(p => p.approvalStatus === 'pending').length },
  { value: 'rejected', label: 'Từ chối', count: products.value.filter(p => p.approvalStatus === 'rejected').length }
]);

const filteredProducts = computed(() => {
  if (currentTab.value === 'all') return products.value;
  return products.value.filter(p => p.approvalStatus === currentTab.value);
});

const formatPrice = (price) => {
  return price?.toLocaleString('vi-VN') + 'đ' || '0đ';
};

const getStatusBadgeClass = (status) => {
  const classes = {
    approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium',
    rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium'
  };
  return classes[status] || 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium';
};

const getStatusLabel = (status) => {
  const labels = {
    approved: 'Đã duyệt',
    pending: 'Chờ duyệt',
    rejected: 'Từ chối'
  };
  return labels[status] || status;
};

const fetchProducts = async () => {
  try {
    const response = await sellerApi.getProducts();
    products.value = response.data.data.products;
  } catch (error) {
    toast.error('Không thể tải danh sách sản phẩm');
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const deleteProduct = async () => {
  if (!productToDelete.value) return;

  deleting.value = true;
  try {
    await sellerApi.deleteProduct(productToDelete.value._id);
    toast.success('Xóa sản phẩm thành công');
    products.value = products.value.filter(p => p._id !== productToDelete.value._id);
    showDeleteModal.value = false;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
  } finally {
    deleting.value = false;
    productToDelete.value = null;
  }
};

onMounted(fetchProducts);
</script>
