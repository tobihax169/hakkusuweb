<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Modern Card -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-blue-200/30 dark:shadow-blue-500/10 border border-slate-200 dark:border-slate-700">
        <!-- Modern Header -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2 font-display">
            {{ $t('auth.register') }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">ようこそ ~ Create your account</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ $t('auth.username') }}</label>
            <input
              v-model="form.username"
              type="text"
              class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 outline-none transition-all"
              placeholder="your_username"
              required
              minlength="3"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ $t('auth.email') }}</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 outline-none transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ $t('auth.password') }}</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 outline-none transition-all pr-12"
                placeholder="••••••••"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Mật khẩu cần ít nhất 6 ký tự
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{{ $t('auth.confirmPassword') }}</label>
            <div class="relative">
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-800 dark:text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 outline-none transition-all pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1"
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
              class="w-4 h-4 mt-0.5 rounded-lg border-2 border-slate-300 text-blue-500 focus:ring-blue-300"
              required
            />
            <span class="text-sm text-slate-600 dark:text-slate-400">
              Tôi đồng ý với 
              <a href="#" class="text-blue-500 hover:text-blue-600 font-medium">Điều khoản</a>
              và 
              <a href="#" class="text-blue-500 hover:text-blue-600 font-medium">Bảo mật</a>
            </span>
          </label>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-300/50 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LoadingSpinner v-if="loading" size="sm" color="white" />
            <span v-else>{{ $t('auth.register') }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t-2 border-slate-200 dark:border-slate-700 border-dashed"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full">hoặc</span>
          </div>
        </div>

        <!-- Discord Register -->
        <a
          href="/api/auth/discord"
          class="w-full py-3.5 bg-[#5865F2] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center"
        >
          Đăng ký bằng Discord
        </a>

        <!-- Login Link -->
        <p class="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          {{ $t('auth.hasAccount') }}
          <router-link to="/auth/login" class="text-blue-500 hover:text-blue-600 font-bold">
            {{ $t('auth.login') }}
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
