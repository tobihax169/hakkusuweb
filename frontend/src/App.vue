<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
    <!-- Modern Blue Gradient Background Pattern -->
    <div class="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10" style="background-image: radial-gradient(circle at 20% 80%, #3b82f6 1px, transparent 1px), radial-gradient(circle at 80% 20%, #8b5cf6 1px, transparent 1px), radial-gradient(circle at 40% 40%, #06b6d4 1px, transparent 1px); background-size: 120px 120px;"></div>
    
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
/* Modern Blue Gradient Theme with Soft Accents */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap');

#app {
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
}

/* Modern Scrollbar - Blue Theme */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: linear-gradient(to bottom, #eff6ff, #eef2ff);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #1e40af);
}

/* Selection - Blue */
::selection {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

/* Focus styles - Blue */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
