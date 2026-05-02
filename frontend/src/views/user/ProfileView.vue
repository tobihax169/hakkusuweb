<template>
  <div class="py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Modern Header -->
      <div class="mb-6 flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-300/50">
          <img src="/user.png" alt="User" class="w-7 h-7 object-contain filter brightness-0 invert" />
        </div>
        <div>
          <span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium mb-1">プロフィール Profile</span>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent font-display">
            {{ $t('nav.profile') }}
          </h1>
        </div>
      </div>

      <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl shadow-blue-100/20">
        <!-- Avatar & Balance -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
          <div class="flex items-center gap-4">
            <img 
              v-if="authStore.userAvatar" 
              :src="authStore.userAvatar" 
              class="w-20 h-20 rounded-full ring-4 ring-blue-200 dark:ring-blue-500/30 object-cover"
            />
            <div v-else class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 flex items-center justify-center ring-4 ring-blue-200 dark:ring-blue-500/30 shadow-lg">
              <img src="/user.png" alt="User" class="w-10 h-10 object-contain filter brightness-0 invert" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-slate-800 dark:text-white">
                {{ authStore.userDisplayName }}
              </h2>
              <p class="text-slate-500 dark:text-slate-400">{{ authStore.user?.email }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span 
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold',
                    authStore.user?.role === 'admin' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : authStore.user?.role === 'support'
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white'
                        : authStore.user?.role === 'seller'
                          ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white'
                          : 'bg-gradient-to-r from-slate-300 to-slate-400 text-white'
                  ]"
                >
                  <img v-if="authStore.user?.role === 'admin'" src="/user.png" class="w-3 h-3 mr-1 filter brightness-0 invert" />
                  <img v-else-if="authStore.user?.role === 'seller'" src="/wallet.png" class="w-3 h-3 mr-1 filter brightness-0 invert" />
                  <img v-else src="/user.png" class="w-3 h-3 mr-1 filter brightness-0 invert" />
                  {{ authStore.user?.role }}
                </span>
              </div>
            </div>
          </div>

          <!-- Modern Balance Cards -->
          <div class="flex gap-3 sm:ml-auto">
            <div class="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl text-white shadow-lg shadow-blue-300/50">
              <p class="text-xs text-blue-100">Gem</p>
              <p class="text-lg font-bold">{{ formatNumber(wallet.gem) }}</p>
            </div>
            <div class="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl text-white shadow-lg shadow-cyan-300/50">
              <p class="text-xs text-cyan-100">Coin</p>
              <p class="text-lg font-bold">{{ formatNumber(wallet.coin) }}</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label class="form-label">Username</label>
            <input
              v-model="form.username"
              type="text"
              class="form-input"
              required
            />
          </div>

          <div>
            <label class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              disabled
            />
            <p class="text-xs text-slate-500 mt-1">Email không thể thay đổi</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Ngôn ngữ</label>
              <select v-model="form.language" class="form-input">
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label class="form-label">Giao diện</label>
              <select v-model="form.theme" class="form-input">
                <option value="dark">Tối</option>
                <option value="light">Sáng</option>
                <option value="auto">Tự động</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4">
            <router-link to="/user/wallet" class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">
              <WalletIcon class="w-4 h-4" />
              Nạp tiền ngay
            </router-link>
            <button
              type="submit"
              :disabled="updating"
              class="btn-primary"
            >
              <LoadingSpinner v-if="updating" size="sm" color="white" class="mr-2" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      <!-- Change Password -->
      <div class="card p-6 mt-6">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Đổi mật khẩu
        </h3>
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="form-label">Mật khẩu hiện tại</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="form-input"
              required
            />
          </div>
          <div>
            <label class="form-label">Mật khẩu mới</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="form-input"
              required
              minlength="6"
            />
          </div>
          <div>
            <label class="form-label">Xác nhận mật khẩu mới</label>
            <input
              v-model="passwordForm.confirmNewPassword"
              type="password"
              class="form-input"
              required
            />
          </div>
          <button
            type="submit"
            :disabled="changingPassword"
            class="btn-outline"
          >
            <LoadingSpinner v-if="changingPassword" size="sm" class="mr-2" />
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.js';
import { useThemeStore } from '@/stores/theme.js';
import { userApi } from '@/services/api.js';
import { WalletIcon } from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const toast = useToast();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const wallet = reactive({
  gem: 0,
  coin: 0
});

const form = reactive({
  username: '',
  email: '',
  language: 'vi',
  theme: 'dark'
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});

const updating = ref(false);
const changingPassword = ref(false);

const formatNumber = (num) => num?.toLocaleString('vi-VN') || '0';

const fetchWallet = async () => {
  try {
    const response = await userApi.getWallet();
    if (response.success) {
      wallet.gem = response.data.balance.gem;
      wallet.coin = response.data.balance.coin;
    }
  } catch (error) {
    // Silent fail - error handled by API interceptor
  }
};

const updateProfile = async () => {
  updating.value = true;
  
  // Apply theme change immediately
  themeStore.setTheme(form.theme);
  
  const result = await authStore.updateProfile({
    username: form.username,
    language: form.language,
    theme: form.theme
  });
  
  updating.value = false;
};

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    toast.error('Mật khẩu xác nhận không khớp');
    return;
  }

  changingPassword.value = true;
  const result = await authStore.changePassword({
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword,
    confirmNewPassword: passwordForm.confirmNewPassword
  });
  
  if (result.success) {
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmNewPassword = '';
  }
  
  changingPassword.value = false;
};

onMounted(() => {
  if (authStore.user) {
    form.username = authStore.user.username;
    form.email = authStore.user.email;
    form.language = authStore.user.language || 'vi';
    form.theme = authStore.user.theme || 'dark';
  }
  fetchWallet();
});
</script>
