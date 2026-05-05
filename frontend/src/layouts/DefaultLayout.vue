<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <UnifiedHeader />
    
    <main class="pt-16">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import UnifiedHeader from '@/components/layout/UnifiedHeader.vue';
import Footer from '@/components/layout/Footer.vue';
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
