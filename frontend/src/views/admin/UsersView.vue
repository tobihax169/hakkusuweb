<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ $t('admin.users') }}
    </h1>

    <!-- Filters -->
    <div class="card p-4 mb-6 flex flex-wrap items-center gap-4">
      <div class="flex items-center gap-2">
        <input
          v-model="filters.search"
          type="text"
          class="form-input py-1.5 w-64"
          placeholder="Tìm kiếm..."
          @keyup.enter="fetchUsers"
        />
        <button @click="fetchUsers" class="btn-primary py-1.5">
          <MagnifyingGlassIcon class="w-4 h-4" />
        </button>
      </div>
      
      <select v-model="filters.role" @change="fetchUsers" class="form-input py-1.5 w-40">
        <option value="">Tất cả vai trò</option>
        <option value="user">User</option>
        <option value="support">Support</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <!-- Users Table -->
    <div class="card overflow-hidden">
      <div v-if="loading" class="p-8 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Balance</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in users" :key="user._id">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                    {{ user.username.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-medium text-gray-900 dark:text-white">{{ user.username }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{{ user.email }}</td>
              <td class="px-6 py-4">
                <select 
                  v-model="user.role" 
                  @change="updateUserRole(user)"
                  class="form-input py-1 text-sm"
                >
                  <option value="user">User</option>
                  <option value="support">Support</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                {{ user.gem?.toLocaleString() }} 💎
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusBadgeClass(user)">
                  {{ user.isBanned ? 'Banned' : user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button @click="openBalanceModal(user)" class="p-1 text-primary-600 hover:bg-primary-50 rounded">
                    <CurrencyDollarIcon class="w-5 h-5" />
                  </button>
                  <button 
                    @click="toggleBan(user)" 
                    :class="user.isBanned ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'"
                    class="p-1 rounded"
                  >
                    <ShieldCheckIcon v-if="user.isBanned" class="w-5 h-5" />
                    <ShieldExclamationIcon v-else class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
        <span class="text-sm text-gray-500">Total: {{ pagination.total }}</span>
        <div class="flex gap-2">
          <button 
            :disabled="pagination.page === 1" 
            @click="changePage(pagination.page - 1)"
            class="btn-outline py-1 px-3"
          >
            Trước
          </button>
          <button 
            :disabled="pagination.page === pagination.pages" 
            @click="changePage(pagination.page + 1)"
            class="btn-outline py-1 px-3"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { userApi } from '@/services/api.js';
import {
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const toast = useToast();

const loading = ref(true);
const users = ref([]);
const filters = reactive({
  search: '',
  role: '',
  page: 1,
  limit: 10
});
const pagination = ref({ page: 1, pages: 1, total: 0 });

const getStatusBadgeClass = (user) => {
  if (user.isBanned) return 'badge badge-danger';
  if (user.isActive) return 'badge badge-success';
  return 'badge badge-warning';
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await userApi.getAllUsers({
      search: filters.search,
      role: filters.role,
      page: filters.page,
      limit: filters.limit
    });
    if (response.success) {
      users.value = response.data;
      pagination.value = response.pagination;
    }
  } catch (error) {
    toast.error('Failed to fetch users');
  } finally {
    loading.value = false;
  }
};

const updateUserRole = async (user) => {
  try {
    await userApi.updateUser(user._id, { role: user.role });
    toast.success('Role updated');
  } catch (error) {
    toast.error('Failed to update role');
  }
};

const toggleBan = async (user) => {
  try {
    await userApi.toggleBanUser(user._id, { ban: !user.isBanned });
    user.isBanned = !user.isBanned;
    toast.success(user.isBanned ? 'User banned' : 'User unbanned');
  } catch (error) {
    toast.error('Failed to update ban status');
  }
};

const openBalanceModal = (user) => {
  const amount = prompt('Enter amount to add (negative to subtract):');
  if (!amount) return;
  
  const numAmount = parseInt(amount);
  if (isNaN(numAmount)) {
    toast.error('Invalid amount');
    return;
  }

  updateBalance(user, numAmount);
};

const updateBalance = async (user, amount) => {
  try {
    await userApi.updateUserBalance(user._id, {
      amount: Math.abs(amount),
      currency: 'gem',
      type: amount > 0 ? 'add' : 'subtract',
      reason: 'Admin adjustment'
    });
    toast.success('Balance updated');
    fetchUsers();
  } catch (error) {
    toast.error('Failed to update balance');
  }
};

const changePage = (page) => {
  filters.page = page;
  fetchUsers();
};

onMounted(fetchUsers);
</script>
