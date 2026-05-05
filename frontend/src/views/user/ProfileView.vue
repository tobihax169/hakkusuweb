<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-8">
        Hồ sơ của tôi
      </h1>

      <GlassCard v-if="user?.role === 'seller'" class="p-8 mb-6">
        <h2 class="text-xl font-semibold text-white mb-2">Cửa hàng của bạn</h2>
        <p class="text-slate-400 text-sm mb-4">
          Trang công khai: sản phẩm, theo dõi, đánh giá và tin nhắn với khách.
        </p>
        <router-link
          v-if="user?.username"
          :to="`/shop/${user.username}`"
          class="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
        >
          Xem trang cửa hàng
        </router-link>
      </GlassCard>

      <!-- Profile Card -->
      <GlassCard class="p-8 mb-6">
        <div class="flex items-center gap-6 mb-8">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-blue-500/30">
            {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-white">{{ user?.username }}</h2>
            <p class="text-slate-400">{{ user?.email }}</p>
            <Badge :variant="getRoleBadge(user?.role)" class="mt-2">
              {{ getRoleLabel(user?.role) }}
            </Badge>
          </div>
        </div>

        <form @submit.prevent="updateProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Tên hiển thị</label>
              <input 
                v-model="formData.username" 
                type="text"
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input 
                v-model="formData.email" 
                type="email" 
                disabled
                class="w-full px-4 py-3 bg-slate-900/30 border border-slate-700 rounded-xl text-slate-500 cursor-not-allowed"
              >
            </div>
          </div>

          <div class="pt-4 border-t border-slate-700/50">
            <button 
              type="submit" 
              :disabled="updating"
              class="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {{ updating ? 'Đang cập nhật...' : 'Cập nhật hồ sơ' }}
            </button>
          </div>
        </form>
      </GlassCard>

      <!-- Security Card -->
      <GlassCard class="p-8">
        <h3 class="text-xl font-semibold text-white mb-6">Bảo mật</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <KeyIcon class="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p class="text-white font-medium">Mật khẩu</p>
                <p class="text-slate-400 text-sm">Thay đổi mật khẩu định kỳ để bảo mật</p>
              </div>
            </div>
            <button 
              @click="showPasswordModal = true"
              class="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Đổi mật khẩu
            </button>
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon class="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p class="text-white font-medium">Xác thực 2 yếu tố</p>
                <p class="text-slate-400 text-sm">Tăng cường bảo mật tài khoản</p>
              </div>
            </div>
            <Badge variant="warning">Sắp ra mắt</Badge>
          </div>
        </div>
      </GlassCard>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showPasswordModal = false">
      <GlassCard class="w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-white mb-6">Đổi mật khẩu</h3>
        <form @submit.prevent="changePassword" class="space-y-4">
          <input 
            v-model="passwordData.current" 
            type="password" 
            placeholder="Mật khẩu hiện tại"
            class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
            required
          >
          <input 
            v-model="passwordData.new" 
            type="password" 
            placeholder="Mật khẩu mới"
            class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
            required
          >
          <input 
            v-model="passwordData.confirm" 
            type="password" 
            placeholder="Xác nhận mật khẩu mới"
            class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
            required
          >
          <div class="flex gap-3 pt-2">
            <button 
              type="button" 
              @click="showPasswordModal = false"
              class="flex-1 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              :disabled="changingPassword"
              class="flex-1 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {{ changingPassword ? 'Đang đổi...' : 'Xác nhận' }}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.js';
import { authApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import Badge from '@/components/ui/Badge.vue';
import { KeyIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline';

const toast = useToast();
const authStore = useAuthStore();

const user = ref(null);
const formData = reactive({ username: '', email: '' });
const updating = ref(false);
const showPasswordModal = ref(false);
const changingPassword = ref(false);
const passwordData = reactive({ current: '', new: '', confirm: '' });

const getRoleBadge = (role) => ({
  admin: 'danger',
  support: 'info',
  seller: 'warning',
  user: 'default'
}[role] || 'default');

const getRoleLabel = (role) => ({
  admin: 'Admin',
  support: 'Support',
  seller: 'Seller',
  user: 'User'
}[role] || role);

const fetchUser = async () => {
  await authStore.fetchUser();
  user.value = authStore.user;
  formData.username = user.value?.username || '';
  formData.email = user.value?.email || '';
};

const updateProfile = async () => {
  updating.value = true;
  try {
    await authApi.updateProfile({ username: formData.username });
    toast.success('Cập nhật thành công');
    await authStore.fetchUser();
  } catch (error) {
    toast.error('Không thể cập nhật');
  } finally {
    updating.value = false;
  }
};

const changePassword = async () => {
  if (passwordData.new !== passwordData.confirm) {
    toast.error('Mật khẩu mới không khớp');
    return;
  }
  changingPassword.value = true;
  try {
    await userApi.changePassword({
      currentPassword: passwordData.current,
      newPassword: passwordData.new
    });
    toast.success('Đổi mật khẩu thành công');
    showPasswordModal.value = false;
    passwordData.current = '';
    passwordData.new = '';
    passwordData.confirm = '';
  } catch (error) {
    toast.error(error.message || 'Không thể đổi mật khẩu');
  } finally {
    changingPassword.value = false;
  }
};

onMounted(fetchUser);
</script>
