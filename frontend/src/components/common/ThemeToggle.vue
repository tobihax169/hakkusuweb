<template>
  <button
    @click="themeStore.toggleTheme"
    class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <!-- Sun icon for dark mode -->
    <SunIcon v-if="isDark" class="w-5 h-5" />
    <!-- Moon icon for light mode -->
    <MoonIcon v-else class="w-5 h-5" />
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';
import { useThemeStore } from '@/stores/theme.js';

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.isDark);
</script>
