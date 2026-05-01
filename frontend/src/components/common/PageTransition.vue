<template>
  <Transition
    :name="transitionName"
    mode="out-in"
    @before-enter="onBeforeEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
  >
    <slot />
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  name: { type: String, default: 'fade' }, // fade, slide, scale
  duration: { type: Number, default: 300 }
});

const route = useRoute();
const transitionName = ref(props.name);

// Theo dõi route changes để áp dụng transition phù hợp
watch(() => route.path, (to, from) => {
  if (!from) {
    transitionName.value = props.name;
    return;
  }
  
  // Logic để chọn transition dựa trên route depth
  const toDepth = to.split('/').length;
  const fromDepth = from.split('/').length;
  
  if (toDepth > fromDepth) {
    transitionName.value = 'slide-left';
  } else if (toDepth < fromDepth) {
    transitionName.value = 'slide-right';
  } else {
    transitionName.value = props.name;
  }
});

const onBeforeEnter = () => {
  document.body.classList.add('transitioning');
};

const onAfterEnter = () => {
  document.body.classList.remove('transitioning');
};

const onBeforeLeave = () => {
  // Optional: scroll to top trước khi transition
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Scale transition */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease-out;
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
