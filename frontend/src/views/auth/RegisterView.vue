<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
          Đăng ký
        </h1>
        <p class="text-slate-400">Tạo tài khoản mới để bắt đầu</p>
      </div>

      <GlassCard class="p-8">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input 
              v-model="formData.username" 
              type="text" 
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Nhập username"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input 
              v-model="formData.email" 
              type="email" 
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50 transition-colors"
              placeholder="email@example.com"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Mật khẩu</label>
            <input 
              v-model="formData.password" 
              type="password" 
              required
              minlength="6"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Ít nhất 6 ký tự"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Xác nhận mật khẩu</label>
            <input 
              v-model="formData.confirmPassword" 
              type="password" 
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Nhập lại mật khẩu"
            >
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Đang đăng ký...' : 'Tạo tài khoản' }}
          </button>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-slate-800 text-slate-400">Hoặc đăng ký với</span>
            </div>
          </div>

          <button 
            @click="registerWithDiscord" 
            :disabled="loading"
            class="mt-4 w-full py-3 bg-[#5865F2] text-white font-semibold rounded-xl hover:bg-[#4752C4] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord
          </button>
        </div>

        <p class="mt-6 text-center text-slate-400 text-sm">
          Đã có tài khoản? 
          <router-link to="/auth/login" class="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Đăng nhập ngay
          </router-link>
        </p>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.js';
import GlassCard from '@/components/ui/GlassCard.vue';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const loading = ref(false);
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const handleRegister = async () => {
  if (formData.password !== formData.confirmPassword) {
    toast.error('Mật khẩu không khớp');
    return;
  }
  if (formData.password.length < 6) {
    toast.error('Mật khẩu phải có ít nhất 6 ký tự');
    return;
  }

  loading.value = true;
  try {
    const result = await authStore.register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    if (result.success) {
      toast.success('Đăng ký thành công!');
      router.push('/');
    } else {
      toast.error(result.message || 'Đăng ký thất bại');
    }
  } catch (error) {
    toast.error(error.message || 'Đăng ký thất bại');
  } finally {
    loading.value = false;
  }
};

const registerWithDiscord = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
};
</script>
