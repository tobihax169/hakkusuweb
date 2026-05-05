<template>
  <div 
    :class="[
      'bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50',
      'transition-all duration-300',
      hover && 'hover:border-blue-500/30 hover:-translate-y-1',
      padding && 'p-6',
      className
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  hover: { type: Boolean, default: false },
  padding: { type: Boolean, default: true },
  className: { type: String, default: '' }
});
</script>
