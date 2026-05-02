<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Cập nhật số dư - {{ user?.username }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Số dư hiện tại: {{ user?.gem?.toLocaleString() }} 💎
          </p>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4">
          <!-- Currency Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loại tiền
            </label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.currency" type="radio" value="gem" class="text-primary-600">
                <span class="text-sm text-gray-700 dark:text-gray-300">Gem (💎)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="form.currency" type="radio" value="coin" class="text-primary-600">
                <span class="text-sm text-gray-700 dark:text-gray-300">Coin (🪙)</span>
              </label>
            </div>
          </div>

          <!-- Operation Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thao tác
            </label>
            <select 
              v-model="form.type" 
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="add">➕ Cộng thêm</option>
              <option value="subtract">➖ Trừ đi</option>
              <option value="set">📝 Đặt giá trị</option>
            </select>
          </div>

          <!-- Amount Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số lượng *
            </label>
            <input
              v-model.number="form.amount"
              type="number"
              min="0"
              placeholder="Nhập số lượng..."
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              @keyup.enter="handleSubmit"
            >
            <p v-if="error" class="text-sm text-red-600 mt-1">{{ error }}</p>
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lý do
            </label>
            <input
              v-model="form.reason"
              type="text"
              placeholder="VD: Thưởng hoạt động, hoàn tiền..."
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            >
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end gap-3">
          <button
            @click="handleClose"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            @click="handleSubmit"
            :disabled="!isValid || loading"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <span v-if="loading">Đang xử lý...</span>
            <span v-else">Xác nhận</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  user: Object
});

const emit = defineEmits(['close', 'submit']);

const form = ref({
  currency: 'gem',
  type: 'add',
  amount: null,
  reason: 'Admin adjustment'
});

const loading = ref(false);
const error = ref('');

const isValid = computed(() => {
  return form.value.amount > 0 && !error.value;
});

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    form.value = {
      currency: 'gem',
      type: 'add',
      amount: null,
      reason: 'Admin adjustment'
    };
    error.value = '';
    loading.value = false;
  }
});

const validate = () => {
  error.value = '';
  
  if (!form.value.amount || form.value.amount <= 0) {
    error.value = 'Vui lòng nhập số lượng hợp lệ';
    return false;
  }
  
  if (form.value.amount > 1000000) {
    error.value = 'Số lượng tối đa là 1,000,000';
    return false;
  }
  
  return true;
};

const handleSubmit = () => {
  if (!validate()) return;
  
  loading.value = true;
  
  emit('submit', {
    userId: props.user?._id,
    ...form.value
  });
};

const handleClose = () => {
  emit('close');
};
</script>
