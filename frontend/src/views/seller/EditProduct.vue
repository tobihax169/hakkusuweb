<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button type="button" @click="$router.push('/seller/products')" class="p-2 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors">
          <ArrowLeftIcon class="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Sửa sản phẩm
          </h1>
          <p class="text-slate-400 mt-1">Cập nhật thông tin gói dịch vụ</p>
        </div>
      </div>

      <GlassCard v-if="loadError" class="p-8 text-center text-red-400">
        {{ loadError }}
      </GlassCard>

      <GlassCard v-else class="p-8">
        <div v-if="pageLoading" class="py-16 flex justify-center">
          <div class="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tên sản phẩm</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
            >
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Danh mục</label>
              <select v-model="formData.category" class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50">
                <option value="game">Game</option>
                <option value="software">Phần mềm</option>
                <option value="mobile">Di động</option>
                <option value="giftcard">Thẻ quà tặng</option>
                <option value="account">Tài khoản</option>
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
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
              >
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Mô tả</label>
            <textarea
              v-model="formData.description"
              rows="4"
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Hình ảnh (URL)</label>
            <input
              v-model="formData.image"
              type="url"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
            >
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex items-center gap-2 text-sm text-slate-300">
              <input v-model="formData.isAccountListing" type="checkbox" class="rounded border-slate-600 bg-slate-900/50">
              Đây là sản phẩm bán account
            </label>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Ngưỡng giá trị cao (VNĐ)</label>
              <input
                v-model.number="formData.highValueThreshold"
                type="number"
                min="0"
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
              >
            </div>
          </div>
          <div class="pt-4 border-t border-slate-700/50">
            <button
              type="submit"
              :disabled="submitting"
              class="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {{ submitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { productApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const pageLoading = ref(true);
const submitting = ref(false);
const loadError = ref('');
const formData = reactive({
  name: '',
  category: 'other',
  price: 0,
  description: '',
  image: '',
  stock: 0,
  isAccountListing: false,
  highValueThreshold: 5000000
});

const productId = () => route.params.id;

const buildPayload = () => ({
  name: formData.name.trim(),
  description: formData.description.trim(),
  price: Number(formData.price),
  nameEn: '',
  descriptionEn: '',
  currency: 'vnd',
  category: formData.category || 'other',
  isAccountListing: formData.isAccountListing || formData.category === 'account',
  highValueThreshold: Number(formData.highValueThreshold) || 5000000,
  iconUrl: formData.image || null,
  metadata: {
    ...(formData.category ? { category: formData.category } : {}),
    stock: Number(formData.stock) || 0
  }
});

const load = async () => {
  pageLoading.value = true;
  loadError.value = '';
  try {
    const res = await productApi.getProductById(productId());
    if (!res.success || !res.data) {
      loadError.value = 'Không tải được sản phẩm';
      return;
    }
    const p = res.data;
    formData.name = p.name || '';
    formData.description = p.description || '';
    formData.price = p.price ?? 0;
    formData.image = p.iconUrl || '';
    formData.category = p.category || p.metadata?.category || 'other';
    formData.stock = p.metadata?.stock ?? 0;
    formData.isAccountListing = Boolean(p.isAccountListing || formData.category === 'account');
    formData.highValueThreshold = Number(p.highValueThreshold || 5000000);
  } catch (e) {
    loadError.value = e.message || 'Không tải được sản phẩm';
  } finally {
    pageLoading.value = false;
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const res = await productApi.updateProduct(productId(), buildPayload());
    if (res.success) {
      toast.success('Đã cập nhật sản phẩm');
      router.push('/seller/products');
    } else {
      toast.error(res.message || 'Cập nhật thất bại');
    }
  } catch (e) {
    toast.error(e.message || 'Cập nhật thất bại');
  } finally {
    submitting.value = false;
  }
};

onMounted(load);
</script>
