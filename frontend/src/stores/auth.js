import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { authApi } from '@/services/api.js';
import router from '@/router';

const toast = useToast();

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const initialized = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isSupport = computed(() => ['admin', 'support'].includes(user.value?.role));
  const isSeller = computed(() => user.value?.role === 'seller');
  const userDisplayName = computed(() => {
    return user.value?.discordUsername || user.value?.username || 'User';
  });
  const userAvatar = computed(() => {
    return user.value?.discordAvatar || null;
  });

  // Actions
  const setAuth = (authData) => {
    user.value = authData.user;
    token.value = authData.token;
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    if (authData.refreshToken) {
      localStorage.setItem('refreshToken', authData.refreshToken);
    }
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  };

  const login = async (credentials) => {
    loading.value = true;
    try {
      const response = await authApi.login(credentials);
      
      if (response.success) {
        setAuth(response);
        toast.success('Đăng nhập thành công!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Đăng nhập thất bại');
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const register = async (data) => {
    loading.value = true;
    try {
      const response = await authApi.register(data);
      
      if (response.success) {
        setAuth(response);
        toast.success('Đăng ký thành công!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Đăng ký thất bại');
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Silently ignore logout API errors
      // Token will be cleared anyway
    } finally {
      clearAuth();
      toast.success('Đã đăng xuất');
      router.push('/');
    }
  };

  const fetchUser = async () => {
    if (!token.value) {
      initialized.value = true;
      return;
    }

    try {
      // Thử lấy từ localStorage trước
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        user.value = JSON.parse(savedUser);
      }

      // Fetch từ server để cập nhật
      const response = await authApi.getMe();
      if (response.success) {
        user.value = response.user;
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    } catch (error) {
      // Silently handle fetch errors
      // If 401, clear auth
      if (error.status === 401) {
        clearAuth();
      }
    } finally {
      initialized.value = true;
    }
  };

  const updateProfile = async (data) => {
    loading.value = true;
    try {
      const response = await authApi.updateProfile(data);
      if (response.success) {
        user.value = { ...user.value, ...response.user };
        localStorage.setItem('user', JSON.stringify(user.value));
        toast.success('Cập nhật thành công!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Cập nhật thất bại');
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const changePassword = async (data) => {
    loading.value = true;
    try {
      const response = await authApi.changePassword(data);
      if (response.success) {
        toast.success('Đổi mật khẩu thành công!');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Đổi mật khẩu thất bại');
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const init = async () => {
    await fetchUser();
  };

  return {
    user,
    token,
    loading,
    initialized,
    isAuthenticated,
    isAdmin,
    isSupport,
    isSeller,
    userDisplayName,
    userAvatar,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    changePassword,
    init
  };
});
