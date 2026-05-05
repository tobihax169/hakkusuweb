<template>
  <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-10">
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Top left circle -->
      <div class="absolute -top-20 -left-20 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      <!-- Bottom right circle -->
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
      <!-- Small floating shapes -->
      <div class="absolute top-1/4 left-10 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse"></div>
      <div class="absolute top-1/3 right-20 w-2 h-2 bg-indigo-400/40 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute bottom-1/4 left-20 w-2 h-2 bg-cyan-400/40 rounded-full animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <!-- Header Section -->
      <div class="text-center mb-6">
        <!-- Logo with Badge inline -->
        <div class="flex items-center justify-center gap-3 mb-2">
          <router-link to="/" class="inline-block group">
            <span class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              はっくす
            </span>
          </router-link>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/70 backdrop-blur-sm rounded-full border border-blue-500/30 shadow-sm">
            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-medium text-slate-300">Cửa hàng</span>
          </div>
        </div>
        
        <!-- Tagline -->
        <p class="text-sm text-slate-400">
          Mua bán sản phẩm & dịch vụ trực tuyến
        </p>
      </div>
      
      <!-- Content Card Container -->
      <div class="relative">
        <!-- Subtle frame glow (avoid oversized blur halo) -->
        <div class="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-blue-500/35 via-indigo-500/25 to-violet-500/35 blur-md opacity-60 pointer-events-none"></div>
        
        <div class="relative pixel-panel rounded-3xl">
          <router-view v-slot="{ Component }">
            <transition name="slide-up" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
      
      <!-- Footer Links -->
      <div class="mt-8 text-center space-y-3">
        <router-link to="/" class="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-blue-300 transition-colors px-4 py-2 rounded-full hover:bg-slate-800/60">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          {{ $t('common.back') }}
        </router-link>
        
        <!-- Trust badges -->
        <div class="flex items-center justify-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <span class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            Bảo mật
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Hỗ trợ 24/7
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
