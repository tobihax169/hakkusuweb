<template>
  <div class="card p-8">
    <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
      {{ $t('auth.login') }}
    </h2>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- Email/Username -->
      <div>
        <label class="form-label">{{ $t('auth.email') }} / Username</label>
        <input
          v-model="form.identifier"
          type="text"
          class="form-input"
          placeholder="example@email.com"
          required
        />
      </div>

      <!-- Password -->
      <div>
        <label class="form-label">{{ $t('auth.password') }}</label>
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input pr-10"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
            <EyeSlashIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Remember & Forgot -->
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2">
          <input 
            v-model="form.rememberMe" 
            type="checkbox" 
            class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span class="text-sm text-gray-600 dark:text-gray-400">Ghi nhớ đăng nhập</span>
        </label>
        <router-link 
          to="/auth/forgot-password" 
          class="text-sm text-primary-600 hover:text-primary-500"
        >
          {{ $t('auth.forgotPassword') }}
        </router-link>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full btn-primary py-3"
      >
        <LoadingSpinner v-if="loading" size="sm" color="white" class="mr-2" />
        {{ loading ? 'Đang đăng nhập...' : $t('auth.login') }}
      </button>
    </form>

    <!-- Divider -->
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Hoặc</span>
      </div>
    </div>

    <!-- Discord Login -->
    <a
      href="/api/auth/discord"
      class="w-full btn bg-[#5865F2] text-white hover:bg-[#4752C4] flex items-center justify-center gap-2"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
      </svg>
      {{ $t('auth.loginDiscord') }}
    </a>

    <!-- Register Link -->
    <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
      {{ $t('auth.noAccount') }}
      <router-link to="/auth/register" class="text-primary-600 hover:text-primary-500 font-medium">
        {{ $t('auth.register') }}
      </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import {
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  identifier: '',
  password: '',
  rememberMe: false
});

const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  const result = await authStore.login({
    identifier: form.identifier,
    password: form.password
  });

  loading.value = false;

  if (result.success) {
    const redirect = route.query.redirect || '/';
    router.push(redirect);
  } else {
    errorMessage.value = result.error || 'Đăng nhập thất bại';
  }
};
</script>
