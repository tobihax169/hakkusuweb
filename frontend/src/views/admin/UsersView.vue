<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Quản lý người dùng
        </h1>
        <p class="text-slate-400 mt-1">Quản lý tài khoản, vai trò và số dư</p>
      </div>

      <!-- Filters -->
      <GlassCard class="p-4 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="relative flex-1 min-w-[300px]">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              v-model="filters.search" 
              type="text" 
              placeholder="Tìm kiếm username, email..."
              class="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 outline-none focus:border-blue-500/50"
              @keyup.enter="fetchUsers"
            >
          </div>
          <select v-model="filters.role" @change="fetchUsers" class="px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none">
            <option value="">Tất cả vai trò</option>
            <option value="user">Người dùng</option>
            <option value="support">Hỗ trợ</option>
            <option value="seller">Người bán</option>
            <option value="admin">Quản trị viên</option>
          </select>
          <button @click="fetchUsers" class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all">
            <MagnifyingGlassIcon class="w-5 h-5" />
          </button>
        </div>
      </GlassCard>

      <!-- Users Table -->
      <GlassCard>
        <div v-if="loading" class="p-12 flex justify-center">
          <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
        <div v-else-if="users.length === 0" class="p-12 text-center">
          <UsersIcon class="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <p class="text-slate-400">Không tìm thấy người dùng nào</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-700/30">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Người dùng</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Email</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Vai trò</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Số dư</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Trạng thái</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr v-for="user in users" :key="user._id" class="hover:bg-slate-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                    <span class="font-medium text-white">{{ user.username }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-300">{{ user.email }}</td>
                <td class="px-6 py-4">
                  <select 
                    v-model="user.role" 
                    @change="updateUserRole(user)"
                    class="px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white outline-none"
                  >
                    <option value="user">Người dùng</option>
                    <option value="support">Hỗ trợ</option>
                    <option value="seller">Người bán</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </td>
                <td class="px-6 py-4 text-blue-400">{{ formatNumber(user.balance) }} ₫</td>
                <td class="px-6 py-4">
                  <Badge :variant="getStatusVariant(user)">
                    {{ user.isBanned ? 'Đã cấm' : user.isActive ? 'Hoạt động' : 'Không hoạt động' }}
                  </Badge>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button 
                      @click="openBalanceModal(user)" 
                      class="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                      title="Cập nhật số dư"
                    >
                      <CurrencyDollarIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="toggleBan(user)" 
                      :class="user.isBanned ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'"
                      class="p-2 rounded-lg hover:bg-opacity-20 transition-colors"
                      :title="user.isBanned ? 'Bỏ cấm' : 'Cấm người dùng'"
                    >
                      <ShieldCheckIcon v-if="user.isBanned" class="w-4 h-4" />
                      <ShieldExclamationIcon v-else class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="flex items-center justify-between p-4 border-t border-slate-700/50">
          <span class="text-sm text-slate-400">Trang {{ pagination.page }} / {{ pagination.pages }}</span>
          <div class="flex gap-2">
            <button 
              :disabled="pagination.page === 1" 
              @click="changePage(pagination.page - 1)"
              class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Trước
            </button>
            <button 
              :disabled="pagination.page === pagination.pages" 
              @click="changePage(pagination.page + 1)"
              class="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </GlassCard>
    </div>

    <!-- Balance Modal -->
    <div v-if="showBalanceModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showBalanceModal = false">
      <GlassCard class="w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Cập nhật số dư - {{ selectedUser?.username }}</h3>
        <div class="space-y-4">
          <div>
            <label class="text-sm text-slate-400">Số tiền (₫)</label>
            <input v-model.number="balanceData.amount" type="number" class="w-full mt-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" placeholder="Nhập số tiền">
          </div>
          <div>
            <label class="text-sm text-slate-400">Loại</label>
            <select v-model="balanceData.type" class="w-full mt-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none">
              <option value="add">Cộng tiền</option>
              <option value="subtract">Trừ tiền</option>
              <option value="set">Đặt số dư</option>
            </select>
          </div>
          <div>
            <label class="text-sm text-slate-400">Lý do</label>
            <input v-model="balanceData.reason" type="text" class="w-full mt-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" placeholder="Lý do cập nhật">
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="showBalanceModal = false" class="flex-1 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors">Hủy</button>
          <button @click="handleBalanceUpdate" class="flex-1 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">Xác nhận</button>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { userApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import Badge from '@/components/ui/Badge.vue';
import {
  MagnifyingGlassIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/vue/24/solid';

const toast = useToast();
const loading = ref(true);
const users = ref([]);
const filters = reactive({ search: '', role: '', page: 1, limit: 10 });
const pagination = ref({ page: 1, pages: 1, total: 0 });
const showBalanceModal = ref(false);
const selectedUser = ref(null);
const balanceData = reactive({ amount: 0, type: 'add', reason: '' });

const formatNumber = (num) => num?.toLocaleString('vi-VN') || '0';

const getStatusVariant = (user) => {
  if (user.isBanned) return 'danger';
  if (user.isActive) return 'success';
  return 'warning';
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await userApi.getAllUsers(filters);
    if (response.success) {
      users.value = response.data;
      pagination.value = response.pagination;
    }
  } catch (error) {
    toast.error('Không thể tải người dùng');
    // Fallback data
    users.value = [
      { _id: '1', username: 'admin', email: 'admin@example.com', role: 'admin', balance: 1000000, isBanned: false, isActive: true },
      { _id: '2', username: 'user1', email: 'user1@example.com', role: 'user', balance: 500000, isBanned: false, isActive: true },
      { _id: '3', username: 'seller1', email: 'seller1@example.com', role: 'seller', balance: 2000000, isBanned: false, isActive: true }
    ];
  } finally {
    loading.value = false;
  }
};

const updateUserRole = async (user) => {
  try {
    await userApi.updateUser(user._id, { role: user.role });
    toast.success('Cập nhật vai trò thành công');
  } catch (error) {
    toast.error('Không thể cập nhật vai trò');
  }
};

const toggleBan = async (user) => {
  try {
    await userApi.toggleBanUser(user._id, { ban: !user.isBanned });
    user.isBanned = !user.isBanned;
    toast.success(user.isBanned ? 'Đã cấm người dùng' : 'Đã bỏ cấm người dùng');
  } catch (error) {
    toast.error('Không thể thực hiện');
  }
};

const openBalanceModal = (user) => {
  selectedUser.value = user;
  balanceData.amount = 0;
  balanceData.type = 'add';
  balanceData.reason = '';
  showBalanceModal.value = true;
};

const handleBalanceUpdate = async () => {
  try {
    await userApi.updateUserBalance(selectedUser.value._id, balanceData);
    toast.success('Cập nhật số dư thành công');
    showBalanceModal.value = false;
    fetchUsers();
  } catch (error) {
    toast.error('Không thể cập nhật số dư');
  }
};

const changePage = (page) => {
  filters.page = page;
  fetchUsers();
};

onMounted(fetchUsers);
</script>
