<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 w-full max-w-lg">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
          Đăng ký Seller
        </h1>
        <p class="text-slate-400">Bắt đầu bán hàng trên Hakkusu Store</p>
      </div>

      <GlassCard class="p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tên cửa hàng</label>
            <input 
              v-model="formData.storeName" 
              type="text" 
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
              placeholder="Nhập tên cửa hàng"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Email liên hệ</label>
            <input 
              v-model="formData.email" 
              type="email" 
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
              placeholder="email@example.com"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Số điện thoại</label>
            <input 
              v-model="formData.phone" 
              type="tel" 
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
              placeholder="0912345678"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Mô tả cửa hàng</label>
            <textarea 
              v-model="formData.description" 
              rows="3"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
              placeholder="Mô tả về cửa hàng và sản phẩm của bạn..."
            />
          </div>
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            {{ loading ? 'Đang gửi...' : 'Đăng ký Seller' }}
          </button>
        </form>

        <p class="mt-6 text-center text-slate-400 text-sm">
          Bằng cách đăng ký, bạn đồng ý với 
          <router-link to="/terms" class="text-blue-400 hover:text-blue-300">điều khoản dịch vụ</router-link>
        </p>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { sellerApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const formData = reactive({
  storeName: '',
  email: '',
  phone: '',
  description: ''
});

const handleRegister = async () => {
  loading.value = true;
  try {
    const response = await sellerApi.registerSeller(formData);
    if (response.success) {
      toast.success('Đăng ký thành công! Vui lòng chờ phê duyệt.');
      router.push('/');
    } else {
      toast.error(response.message || 'Đăng ký thất bại');
    }
  } catch (error) {
    toast.error(error.message || 'Đăng ký thất bại');
  } finally {
    loading.value = false;
  }
};
</script>
