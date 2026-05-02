<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
    <!-- Kawaii Background Pattern -->
    <div class="fixed inset-0 pointer-events-none opacity-30 dark:opacity-10" style="background-image: radial-gradient(circle at 20% 80%, #ffc1cc 1px, transparent 1px), radial-gradient(circle at 80% 20%, #c4b5fd 1px, transparent 1px), radial-gradient(circle at 40% 40%, #86efac 1px, transparent 1px); background-size: 100px 100px;"></div>
    
    <NetworkLoader :minimum-display-time="2000" />
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
import NetworkLoader from '@/components/common/NetworkLoader.vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();

onMounted(() => {
  // Khởi tạo auth và theme
  authStore.init();
  themeStore.init();
});
</script>

<style>
/* Global Kawaii Styles */
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Nunito:wght@300;400;500;600;700;800&family=Quicksand:wght@300;400;500;600;700&display=swap');

#app {
  font-family: 'Nunito', 'Noto Sans JP', sans-serif;
}

/* Cute Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: linear-gradient(to bottom, #fff0f3, #f5f3ff);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #ff99aa, #c4b5fd);
  border-radius: 5px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #ff6b85, #a78bfa);
}

/* Selection */
::selection {
  background: linear-gradient(135deg, #ff99aa, #c4b5fd);
  color: white;
}

/* Focus styles */
*:focus-visible {
  outline: 2px solid #ff99aa;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
