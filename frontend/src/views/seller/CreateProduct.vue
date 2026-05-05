<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button @click="$router.back()" class="p-2 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors">
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
              <label class="block text-sm font-medium text-slate-300 mb-2">Danh mục</label>
              <select 
                v-model="formData.category" 
                required
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
              >
                <option value="">Chọn danh mục</option>
                <option value="game">Game</option>
                <option value="software">Phần mềm</option>
                <option value="mobile">Di động</option>
                <option value="giftcard">Thẻ quà tặng</option>
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
            <label class="block text-sm font-medium text-slate-300 mb-2">Hình ảnh (URL)</label>
            <input 
              v-model="formData.image" 
              type="url"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
              placeholder="https://example.com/image.jpg"
            >
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
import GlassCard from '@/components/ui/GlassCard.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const toast = useToast();

const submitting = ref(false);
const formData = reactive({
  name: '',
  category: '',
  price: 10000,
  description: '',
  image: '',
  stock: 100
});

const buildPayload = () => ({
  name: formData.name.trim(),
  description: formData.description.trim(),
  price: Number(formData.price),
  nameEn: '',
  descriptionEn: '',
  currency: 'vnd',
  iconUrl: formData.image?.trim() || null,
  metadata: {
    category: formData.category || 'other',
    stock: Number(formData.stock) || 0
  }
});

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const response = await productApi.createProduct(buildPayload());
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
