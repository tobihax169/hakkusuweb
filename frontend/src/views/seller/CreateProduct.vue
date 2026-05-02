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
        <!-- Product Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Loại sản phẩm *
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="type in productTypes"
              :key="type.value"
              type="button"
              @click="form.type = type.value"
              :class="[
                'p-4 rounded-xl border-2 text-center transition-all',
                form.type === type.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
              ]"
            >
              <component :is="type.icon" class="w-6 h-6 mx-auto mb-2" :class="form.type === type.value ? 'text-primary-600' : 'text-gray-400'" />
              <p class="text-sm font-medium" :class="form.type === type.value ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'">{{ type.label }}</p>
            </button>
          </div>
        </div>

        <!-- Product Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tên sản phẩm *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            :placeholder="getNamePlaceholder()"
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

        <!-- Product Images -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hình ảnh sản phẩm
          </label>
          <div class="space-y-4">
            <!-- Image Preview Grid -->
            <div v-if="previewImages.length > 0" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              <div 
                v-for="(image, index) in previewImages" 
                :key="index"
                class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group"
              >
                <img :src="image" class="w-full h-full object-cover" />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <!-- Upload Button -->
            <div class="flex items-center gap-4">
              <label class="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleImageUpload"
                  class="hidden"
                >
                <div class="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                  <PhotoIcon class="w-6 h-6 text-gray-400" />
                  <span class="text-sm text-gray-500">Thêm hình ảnh (tối đa 5)</span>
                </div>
              </label>
            </div>
            <p class="text-xs text-gray-500">Hỗ trợ: JPG, PNG, WebP. Tối đa 5MB mỗi ảnh.</p>
          </div>
        </div>

        <!-- Product Files -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            File đính kèm
          </label>
          <div class="space-y-2">
            <div 
              v-for="(file, index) in attachedFiles" 
              :key="index"
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <DocumentIcon class="w-5 h-5 text-primary-500" />
              <span class="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{{ file.name }}</span>
              <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
              <button
                type="button"
                @click="removeFile(index)"
                class="p-1 text-red-500 hover:text-red-700"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>
            <label class="cursor-pointer">
              <input
                type="file"
                multiple
                @change="handleFileUpload"
                class="hidden"
              >
              <div class="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
                <PlusIcon class="w-5 h-5" />
                Thêm file
              </div>
            </label>
          </div>
        </div>

        <!-- Account Fields (for game accounts) -->
        <div v-if="form.type === 'game_account'" class="space-y-4">
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div class="flex items-start gap-2">
              <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">Lưu ý quan trọng</p>
                <p class="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Thông tin tài khoản sẽ được mã hóa và chỉ hiển thị cho người mua sau khi thanh toán thành công.
                </p>
              </div>
            </div>
          </div>

          <!-- Game Account Details -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên game *
              </label>
              <input
                v-model="form.accountDetails.gameName"
                type="text"
                required
                placeholder="VD: Liên Quân Mobile, Free Fire, PUBG..."
                class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              >
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level/Rank
                </label>
                <input
                  v-model="form.accountDetails.level"
                  type="text"
                  placeholder="VD: Level 50, Cao Thủ..."
                  class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Server
                </label>
                <input
                  v-model="form.accountDetails.server"
                  type="text"
                  placeholder="VD: VN, SEA, Global..."
                  class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                >
              </div>
            </div>
          </div>

          <!-- Account Credentials -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên đăng nhập/Email *
            </label>
            <input
              v-model="form.accountDetails.username"
              type="text"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu *
            </label>
            <input
              v-model="form.accountDetails.password"
              type="password"
              required
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thông tin bổ sung (2FA, backup code...)
            </label>
            <textarea
              v-model="form.accountDetails.additionalInfo"
              rows="2"
              placeholder="Mã 2FA, email khôi phục, câu hỏi bảo mật..."
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
            />
          </div>
        </div>

        <!-- Price -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Giá bán (VND) *
            </label>
            <div class="relative">
              <input
                v-model.number="form.price"
                type="number"
                required
                min="1000"
                placeholder="100000"
                class="w-full px-4 py-2 pl-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              >
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
            </div>
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
              <option v-if="form.type === 'game_account'" value="DeviceTabletIcon">Game</option>
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
  TrashIcon,
  CubeIcon,
  DeviceTabletIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  DocumentIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const productTypes = [
  { value: 'digital', label: 'Sản phẩm số', icon: CubeIcon },
  { value: 'game_account', label: 'Account Game', icon: DeviceTabletIcon }
];

const form = ref({
  type: 'digital',
  name: '',
  description: '',
  price: 0,
  icon: 'CubeIcon',
  features: [{ text: '' }],
  images: [],
  files: [],
  accountDetails: {
    gameName: '',
    level: '',
    server: '',
    username: '',
    password: '',
    additionalInfo: ''
  }
});

const previewImages = ref([]);
const attachedFiles = ref([]);

const getNamePlaceholder = () => {
  const placeholders = {
    digital: 'VD: Bot Discord Premium, Tool Auto...',
    game_account: 'VD: Acc Liên Quân Cao Thủ 5k2, Acc Free Fire MAX...'
  };
  return placeholders[form.value.type] || 'Tên sản phẩm';
};

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  const remainingSlots = 5 - previewImages.value.length;
  
  if (files.length > remainingSlots) {
    toast.warning(`Chỉ có thể thêm tối đa ${remainingSlots} ảnh nữa`);
  }
  
  const validFiles = files.slice(0, remainingSlots).filter(file => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${file.name} vượt quá 5MB`);
      return false;
    }
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} không phải là file ảnh`);
      return false;
    }
    return true;
  });

  validFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImages.value.push(e.target.result);
      form.value.images.push(file);
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  previewImages.value.splice(index, 1);
  form.value.images.splice(index, 1);
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error(`${file.name} vượt quá 50MB`);
      return;
    }
    attachedFiles.value.push(file);
    form.value.files.push(file);
  });
};

const removeFile = (index) => {
  attachedFiles.value.splice(index, 1);
  form.value.files.splice(index, 1);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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
