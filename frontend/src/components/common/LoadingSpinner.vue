<template>
  <div class="flex items-center justify-center" :class="wrapperClass">
    <div 
      class="animate-spin rounded-full border-b-2"
      :class="[sizeClass, colorClass]"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary' // primary, white, gray
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
});

const sizeClass = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };
  return sizes[props.size];
});

const colorClass = computed(() => {
  const colors = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-400'
  };
  return colors[props.color];
});

const wrapperClass = computed(() => {
  return props.fullScreen ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50' : '';
});
</script>
