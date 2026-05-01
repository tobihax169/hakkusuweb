<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
    <!-- Image skeleton -->
    <div v-if="showImage" class="h-48 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" style="background-size: 200% 100%"></div>
    
    <div class="p-6 space-y-4">
      <!-- Title skeleton -->
      <div class="h-6 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-3/4" style="background-size: 200% 100%"></div>
      
      <!-- Description lines -->
      <div class="space-y-2">
        <div class="h-4 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded" style="background-size: 200% 100%"></div>
        <div class="h-4 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-5/6" style="background-size: 200% 100%"></div>
      </div>
      
      <!-- Footer skeleton -->
      <div v-if="showFooter" class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div class="h-8 w-20 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded" style="background-size: 200% 100%"></div>
        <div class="h-8 w-8 rounded-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" style="background-size: 200% 100%"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showImage: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: true }
});
</script>
