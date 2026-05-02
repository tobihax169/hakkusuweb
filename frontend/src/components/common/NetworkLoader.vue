<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-500"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="showLoader" 
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      :class="bgClass"
    >
      <!-- Animated Logo -->
      <div class="relative mb-8">
        <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl animate-pulse">
          <span class="text-4xl font-bold text-white">H</span>
        </div>
        <div class="absolute -inset-4 rounded-3xl border-2 border-primary-500/30 animate-ping"></div>
      </div>

      <!-- Progress Bar -->
      <div class="w-64 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
        <div 
          class="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full transition-all duration-300"
          :style="{ width: progress + '%' }"
        ></div>
      </div>

      <!-- Loading Text -->
      <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">
        {{ loadingText }}
      </p>

      <!-- Network Speed Indicator -->
      <div class="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm">
        <div 
          class="w-2 h-2 rounded-full animate-pulse"
          :class="speedIndicator"
        ></div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ networkStatus }}
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  minimumDisplayTime: {
    type: Number,
    default: 1500
  }
});

const showLoader = ref(true);
const progress = ref(0);
const networkSpeed = ref('unknown');
const loadingText = ref('Đang tải...');

const bgClass = computed(() => {
  return document.documentElement.classList.contains('dark')
    ? 'bg-gray-900'
    : 'bg-white';
});

const speedIndicator = computed(() => {
  switch (networkSpeed.value) {
    case 'fast':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'slow':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
});

const networkStatus = computed(() => {
  switch (networkSpeed.value) {
    case 'fast':
      return 'Kết nối tốt';
    case 'medium':
      return 'Kết nối ổn định';
    case 'slow':
      return 'Kết nối chậm';
    default:
      return 'Đang kiểm tra...';
  }
});

// Detect network speed
const detectNetworkSpeed = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    const effectiveType = connection.effectiveType;
    switch (effectiveType) {
      case '4g':
        networkSpeed.value = 'fast';
        break;
      case '3g':
        networkSpeed.value = 'medium';
        break;
      case '2g':
      case 'slow-2g':
        networkSpeed.value = 'slow';
        break;
      default:
        networkSpeed.value = 'unknown';
    }
  } else {
    // Fallback: measure actual load time
    measureActualSpeed();
  }
};

const measureActualSpeed = () => {
  const startTime = performance.now();
  
  // Simulate a small resource load
  fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' })
    .then(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration < 100) {
        networkSpeed.value = 'fast';
      } else if (duration < 500) {
        networkSpeed.value = 'medium';
      } else {
        networkSpeed.value = 'slow';
      }
    })
    .catch(() => {
      networkSpeed.value = 'unknown';
    });
};

// Simulate loading progress
const simulateProgress = () => {
  const texts = {
    fast: ['Đang tải...', 'Chờ chút...', 'Sẵn sàng!'],
    medium: ['Đang tải dữ liệu...', 'Đang khởi tạo...', 'Chờ chút nhé...'],
    slow: ['Đang tải, vui lòng đợi...', 'Kết nối chậm, đang xử lý...', 'Sắp xong rồi...'],
    unknown: ['Đang tải...', 'Đang khởi tạo...', 'Vui lòng đợi...']
  };

  const speed = networkSpeed.value || 'unknown';
  const speedTexts = texts[speed];
  
  let currentStep = 0;
  const totalSteps = speedTexts.length;
  
  const interval = setInterval(() => {
    currentStep++;
    progress.value = (currentStep / totalSteps) * 100;
    loadingText.value = speedTexts[Math.min(currentStep - 1, speedTexts.length - 1)];
    
    if (currentStep >= totalSteps) {
      clearInterval(interval);
      setTimeout(() => {
        showLoader.value = false;
      }, 300);
    }
  }, props.minimumDisplayTime / totalSteps);
};

// Listen for page load events
const handleLoad = () => {
  simulateProgress();
};

onMounted(() => {
  detectNetworkSpeed();
  
  if (document.readyState === 'complete') {
    handleLoad();
  } else {
    window.addEventListener('load', handleLoad);
  }
});

onUnmounted(() => {
  window.removeEventListener('load', handleLoad);
});
</script>
