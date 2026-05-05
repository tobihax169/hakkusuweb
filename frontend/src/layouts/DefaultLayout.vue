<template>
  <div class="min-h-screen bg-slate-900 text-white relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 opacity-30 bg-[linear-gradient(rgba(59,130,246,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.12)_1px,transparent_1px)] bg-[size:30px_30px]" />
    <UnifiedHeader />
    
    <main class="pt-16 relative z-10">
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
