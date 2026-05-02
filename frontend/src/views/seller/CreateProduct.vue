<template>
  <div class="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <router-link
            to="/seller/dashboard"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
          >
            <ArrowLeftIcon class="w-4 h-4" />
            Dashboard
          </router-link>
          <span class="text-gray-300">/</span>
          <span class="text-gray-900 dark:text-white">Đăng Sản Phẩm</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Đăng Sản Phẩm Mới
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Tạo sản phẩm để bán trên marketplace. Sản phẩm sẽ được hiển thị sau khi admin duyệt.
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="card space-y-6">
        <!-- Product Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tên sản phẩm *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="VD: Bot Discord Premium"
            class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          >
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mô tả sản phẩm *
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            required
            placeholder="Mô tả chi tiết về sản phẩm, tính năng, cách sử dụng..."
            class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
          />
        </div>

        <!-- Price -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giá bán (VND) *
            </label>
            <input
              v-model.number="form.price"
              type="number"
              required
              min="1000"
              placeholder="100000"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>
            <select
              v-model="form.icon"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="CubeIcon">Cube (Mặc định)</option>
              <option value="StarIcon">Star</option>
              <option value="SparklesIcon">Sparkles</option>
              <option value="PuzzlePieceIcon">Puzzle</option>
            </select>
          </div>
        </div>

        <!-- Features -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tính năng sản phẩm
          </label>
          <div class="space-y-2">
            <div
              v-for="(feature, index) in form.features"
              :key="index"
              class="flex gap-2"
            >
              <input
                v-model="feature.text"
                type="text"
                :placeholder="`Tính năng ${index + 1}`"
                class="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              >
              <button
                type="button"
                @click="removeFeature(index)"
                class="p-2 text-red-500 hover:text-red-700"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
            <button
              type="button"
              @click="addFeature"
              class="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <PlusIcon class="w-5 h-5" />
              Thêm tính năng
            </button>
          </div>
        </div>

        <!-- Fee Info -->
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Thông tin phí</h4>
          <p class="text-sm text-blue-700 dark:text-blue-300">
            Platform sẽ thu <strong>30%</strong> phí trên mỗi đơn hàng. Bạn sẽ nhận được <strong>70%</strong> doanh thu.
          </p>
          <div v-if="form.price > 0" class="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
            <p class="text-sm">
              Với giá <strong>{{ formatPrice(form.price) }}</strong>:
            </p>
            <ul class="text-sm mt-1 space-y-1">
              <li>Bạn nhận: <span class="text-green-600 font-medium">{{ formatPrice(form.price * 0.7) }}</span></li>
              <li>Platform thu: <span class="text-gray-500">{{ formatPrice(form.price * 0.3) }}</span></li>
            </ul>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4 pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary flex-1 py-3 disabled:opacity-50"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <LoadingSpinner class="w-5 h-5" />
              Đang đăng...
            </span>
            <span v-else>Đăng Sản Phẩm</span>
          </button>
          <router-link
            to="/seller/dashboard"
            class="btn btn-secondary px-6 py-3"
          >
            Hủy
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { sellerApi } from '@/services/sellerApi.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const form = ref({
  name: '',
  description: '',
  price: 0,
  icon: 'CubeIcon',
  features: [{ text: '' }]
});

const formatPrice = (price) => {
  return Math.round(price).toLocaleString('vi-VN') + 'đ';
};

const addFeature = () => {
  form.value.features.push({ text: '' });
};

const removeFeature = (index) => {
  form.value.features.splice(index, 1);
};

const handleSubmit = async () => {
  if (form.value.price < 1000) {
    toast.error('Giá sản phẩm tối thiểu 1,000đ');
    return;
  }

  // Filter empty features
  const validFeatures = form.value.features.filter(f => f.text.trim());

  loading.value = true;
  try {
    const response = await sellerApi.createProduct({
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      icon: form.value.icon,
      features: validFeatures
    });

    toast.success(response.data.message || 'Đăng sản phẩm thành công!');
    router.push('/seller/products');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Đăng sản phẩm thất bại');
  } finally {
    loading.value = false;
  }
};
</script>
