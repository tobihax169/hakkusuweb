<template>
  <div
    class="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
    :style="{ 
      width: width, 
      height: height,
      backgroundSize: '200% 100%',
      borderRadius: rounded ? '0.5rem' : '0'
    }"
  >
    <div v-if="showAvatar" class="flex items-center space-x-4">
      <div class="rounded-full bg-gray-300 dark:bg-gray-600" :style="{ width: avatarSize, height: avatarSize }"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' },
  rounded: { type: Boolean, default: true },
  showAvatar: { type: Boolean, default: false },
  avatarSize: { type: String, default: '3rem' }
});
</script>
