<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <!-- 404 Icon -->
      <div class="mb-8">
        <div class="w-32 h-32 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span class="text-6xl">🤖</span>
        </div>
      </div>

      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        404
      </h1>
      
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Không tìm thấy trang
      </h2>
      
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <router-link to="/" class="btn-primary">
          <HomeIcon class="w-5 h-5 mr-2" />
          Về trang chủ
        </router-link>
        <button 
          @click="$router.back()" 
          class="btn-outline"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HomeIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';
</script>
