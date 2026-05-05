<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button type="button" @click="$router.back()" class="p-2 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors">
          <ArrowLeftIcon class="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Thêm sản phẩm
          </h1>
          <p class="text-slate-400 mt-1">Tạo sản phẩm mới để bán</p>
        </div>
      </div>

      <GlassCard class="p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tên sản phẩm</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
              placeholder="Nhập tên sản phẩm"
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Loại hàng</label>
              <select
                v-model="formData.category"
                required
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
              >
                <option value="" disabled>Chọn loại</option>
                <option value="game_account">Account game</option>
                <option value="social_account">Tài khoản mạng xã hội</option>
                <option value="game_item">Vật phẩm trong game</option>
                <option value="giftcard">Gift card</option>
                <option value="digital_file">Bán file</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Giá (VNĐ)</label>
              <input
                v-model.number="formData.price"
                type="number"
                required
                min="1000"
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
                placeholder="100000"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Mô tả</label>
            <textarea
              v-model="formData.description"
              rows="4"
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
              placeholder="Mô tả chi tiết về sản phẩm..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Hình ảnh (tối đa 5, JPG/PNG/WebP)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              class="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white"
              @change="onFiles"
            >
            <p class="text-xs text-slate-500 mt-2">{{ imageFiles.length }}/5 ảnh đã chọn</p>
            <div v-if="previews.length" class="flex flex-wrap gap-2 mt-3">
              <div v-for="(src, i) in previews" :key="i" class="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-600">
                <img :src="src" alt="" class="w-full h-full object-cover">
                <button
                  type="button"
                  class="absolute top-0 right-0 p-0.5 bg-black/60 text-white text-xs rounded-bl"
                  @click="removeImage(i)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Số lượng tồn kho</label>
            <input
              v-model.number="formData.stock"
              type="number"
              required
              min="0"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
              placeholder="100"
            >
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex items-center gap-2 text-sm text-slate-300">
              <input v-model="formData.isAccountListing" type="checkbox" class="rounded border-slate-600 bg-slate-900/50">
              Ghi chú: đây là sản phẩm dạng account (áp dụng quy tắc giá trị cao)
            </label>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Ngưỡng giá trị cao (VNĐ)</label>
              <input
                v-model.number="formData.highValueThreshold"
                type="number"
                min="0"
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
              >
            </div>
          </div>

          <div class="pt-4 border-t border-slate-700/50">
            <button
              type="submit"
              :disabled="submitting"
              class="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              {{ submitting ? 'Đang tạo...' : 'Tạo sản phẩm' }}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { productApi } from '@/services/api.js';
import { uploadProductImages } from '@/utils/uploadProductImages.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const toast = useToast();

const submitting = ref(false);
const imageFiles = ref([]);
const previews = ref([]);

const formData = reactive({
  name: '',
  category: '',
  price: 10000,
  description: '',
  stock: 100,
  isAccountListing: false,
  highValueThreshold: 5000000
});

const onFiles = (e) => {
  const picked = Array.from(e.target.files || []);
  const merged = [...imageFiles.value, ...picked].slice(0, 5);
  imageFiles.value = merged;
  previews.value.forEach((u) => URL.revokeObjectURL(u));
  previews.value = merged.map((f) => URL.createObjectURL(f));
  e.target.value = '';
};

const removeImage = (index) => {
  const next = [...imageFiles.value];
  next.splice(index, 1);
  imageFiles.value = next;
  previews.value.forEach((u) => URL.revokeObjectURL(u));
  previews.value = next.map((f) => URL.createObjectURL(f));
};

const buildPayload = (imageUrls) => ({
  name: formData.name.trim(),
  description: formData.description.trim(),
  price: Number(formData.price),
  nameEn: '',
  descriptionEn: '',
  currency: 'vnd',
  category: formData.category || 'other',
  isAccountListing: formData.isAccountListing,
  highValueThreshold: Number(formData.highValueThreshold) || 5000000,
  imageUrls,
  metadata: {
    category: formData.category || 'other',
    stock: Number(formData.stock) || 0
  }
});

const handleSubmit = async () => {
  submitting.value = true;
  try {
    let imageUrls = [];
    if (imageFiles.value.length) {
      imageUrls = await uploadProductImages(imageFiles.value, 5);
    }
    const response = await productApi.createProduct(buildPayload(imageUrls));
    if (response.success) {
      toast.success('Tạo sản phẩm thành công!');
      router.push('/seller/products');
    } else {
      toast.error(response.message || 'Tạo sản phẩm thất bại');
    }
  } catch (error) {
    toast.error(error.message || 'Tạo sản phẩm thất bại');
  } finally {
    submitting.value = false;
  }
};
</script>
