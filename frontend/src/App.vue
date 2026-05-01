<template>
  <div id="app">
    <PageTransition name="fade">
      <router-view />
    </PageTransition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import { useThemeStore } from '@/stores/theme.js';
import PageTransition from '@/components/common/PageTransition.vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();

onMounted(() => {
  // Khởi tạo auth và theme
  authStore.init();
  themeStore.init();
});
</script>
