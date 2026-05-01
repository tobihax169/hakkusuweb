<template>
  <div class="card p-8 text-center">
    <LoadingSpinner size="lg" class="mx-auto mb-4" />
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      Đang xử lý đăng nhập...
    </h2>
    <p class="text-gray-500 dark:text-gray-400">
      Vui lòng đợi trong giây lát
    </p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.js';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

onMounted(() => {
  // Lấy token từ query params (được trả về sau Discord OAuth)
  const { token, refreshToken } = route.query;

  if (token) {
    // Lưu token
    authStore.setAuth({
      token,
      refreshToken,
      user: null // Sẽ được fetch sau
    });

    // Fetch user info
    authStore.fetchUser().then(() => {
      toast.success('Đăng nhập thành công!');
      router.push('/');
    });
  } else {
    toast.error('Đăng nhập thất bại');
    router.push('/auth/login');
  }
});
</script>
