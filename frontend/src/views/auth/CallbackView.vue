<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 text-center">
      <div class="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-6" />
      <h2 class="text-2xl font-bold text-white mb-2">Đang xử lý đăng nhập</h2>
      <p class="text-slate-400">Vui lòng đợi trong giây lát...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.js';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const authStore = useAuthStore();

onMounted(async () => {
  const token = route.query.token;
  const error = route.query.error;

  if (error) {
    toast.error('Đăng nhập thất bại: ' + error);
    router.push('/auth/login');
    return;
  }

  if (token) {
    localStorage.setItem('token', token);
    try {
      await authStore.fetchUser();
      toast.success('Đăng nhập thành công!');
      const redirect = route.query.redirect || '/';
      router.push(redirect);
    } catch (error) {
      toast.error('Không thể lấy thông tin user');
      router.push('/auth/login');
    }
  } else {
    toast.error('Không nhận được token');
    router.push('/auth/login');
  }
});
</script>
