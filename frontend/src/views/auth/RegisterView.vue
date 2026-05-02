<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Kawaii Card -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl shadow-purple-200/50 dark:shadow-purple-500/20 border-2 border-purple-100 dark:border-purple-500/30">
        <!-- Cute Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center shadow-lg">
            <span class="text-3xl">🎀</span>
          </div>
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2 font-display">
            {{ $t('auth.register') }} ✨
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">ようこそ ~ Join our kawaii community!</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <span>😅</span> {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">👤 {{ $t('auth.username') }}</label>
            <input
              v-model="form.username"
              type="text"
              class="w-full px-4 py-3 rounded-xl border-2 border-purple-100 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/30 outline-none transition-all"
              placeholder="your_username ✨"
              required
              minlength="3"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">📧 {{ $t('auth.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-4 py-3 rounded-xl border-2 border-purple-100 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/30 outline-none transition-all"
              placeholder="you@example.com 💌"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">🔑 {{ $t('auth.password') }}</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 rounded-xl border-2 border-purple-100 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/30 outline-none transition-all pr-12"
                placeholder="••••••••"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-500 transition-colors p-1"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Mật khẩu cần ít nhất 6 ký tự 🔒
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">🔐 {{ $t('auth.confirmPassword') }}</label>
            <div class="relative">
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 rounded-xl border-2 border-purple-100 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/30 outline-none transition-all pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-500 transition-colors p-1"
              >
                <EyeIcon v-if="!showConfirmPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Terms -->
          <label class="flex items-start gap-3 cursor-pointer">
            <input 
              v-model="form.acceptTerms" 
              type="checkbox" 
              class="w-4 h-4 mt-0.5 rounded-lg border-2 border-purple-200 text-purple-500 focus:ring-purple-300"
              required
            />
            <span class="text-sm text-slate-600 dark:text-slate-400">
              Tôi đồng ý với 
              <a href="#" class="text-purple-500 hover:text-purple-600 font-medium">Điều khoản</a>
              và 
              <a href="#" class="text-purple-500 hover:text-purple-600 font-medium">Bảo mật</a> 💕
            </span>
          </label>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-purple-300/50 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LoadingSpinner v-if="loading" size="sm" color="white" />
            <span v-else>✨ {{ $t('auth.register') }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t-2 border-purple-100 dark:border-purple-500/20 border-dashed"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full">hoặc 🌸</span>
          </div>
        </div>

        <!-- Discord Register -->
        <a
          href="/api/auth/discord"
          class="w-full py-3.5 bg-[#5865F2] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Đăng ký bằng Discord 💬
        </a>

        <!-- Login Link -->
        <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          {{ $t('auth.hasAccount') }}
          <router-link to="/auth/login" class="text-purple-500 hover:text-purple-600 font-bold">
            {{ $t('auth.login') }} 🔐
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import {
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref('');

const handleRegister = async () => {
  // Validation
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp';
    return;
  }

  if (form.password.length < 6) {
    errorMessage.value = 'Mật khẩu phải có ít nhất 6 ký tự';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  const result = await authStore.register({
    username: form.username,
    email: form.email,
    password: form.password,
    confirmPassword: form.confirmPassword
  });

  loading.value = false;

  if (result.success) {
    router.push('/');
  } else {
    errorMessage.value = result.error || 'Đăng ký thất bại';
  }
};
</script>
