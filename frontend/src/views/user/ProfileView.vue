<template>
  <div class="py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {{ $t('nav.profile') }}
      </h1>

      <div class="card p-6">
        <!-- Avatar -->
        <div class="flex items-center gap-4 mb-6">
          <img 
            v-if="authStore.userAvatar" 
            :src="authStore.userAvatar" 
            class="w-20 h-20 rounded-full"
          />
          <div v-else class="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
            {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ authStore.userDisplayName }}
            </h2>
            <p class="text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
            <span 
              :class="[
                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2',
                authStore.user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  : authStore.user?.role === 'support'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              ]"
            >
              {{ authStore.user?.role }}
            </span>
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
            <p class="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
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
            <router-link to="/user/wallet" class="text-primary-600 hover:text-primary-500">
              Quản lý ví →
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
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const toast = useToast();
const authStore = useAuthStore();
const themeStore = useThemeStore();

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
  // Load current user data
  form.username = authStore.user?.username || '';
  form.email = authStore.user?.email || '';
  form.language = authStore.user?.language || 'vi';
  form.theme = authStore.user?.theme || 'dark';
});
</script>
