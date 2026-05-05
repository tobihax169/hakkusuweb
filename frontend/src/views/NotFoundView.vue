<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 text-center">
      <div class="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
        <span class="text-6xl font-bold text-white">404</span>
      </div>
      <h1 class="text-3xl font-bold text-white mb-4">Trang không tìm thấy</h1>
      <p class="text-slate-400 mb-8 max-w-md mx-auto">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <router-link to="/" class="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
          Về trang chủ
        </router-link>
        <button @click="$router.back()" class="px-8 py-3 bg-slate-800/50 text-white font-semibold rounded-xl border border-slate-700/50 hover:bg-slate-700/50 transition-all">
          Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
