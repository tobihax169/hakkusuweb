<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useThemeStore } from '@/stores/theme.js';

const authStore = useAuthStore();
const themeStore = useThemeStore();

onMounted(() => {
  // Khởi tạo auth và theme
  authStore.init();
  themeStore.init();
});
</script>
