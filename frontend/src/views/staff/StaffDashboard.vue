<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ $t('staff.dashboard') }}
    </h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tickets đang chờ</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ formatNumber(stats.pendingTickets) }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <TicketIcon class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Seller chờ duyệt</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ formatNumber(stats.pendingSellers) }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <BuildingStorefrontIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Sản phẩm chờ duyệt</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ formatNumber(stats.pendingProducts) }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <CubeIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tickets đã xử lý</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ formatNumber(stats.resolvedTickets) }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card mb-8">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Hành động nhanh</h2>
      </div>
      <div class="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <router-link to="/staff/tickets" class="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <TicketIcon class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">Xử lý Tickets</p>
            <p class="text-sm text-gray-500">{{ stats.pendingTickets }} đang chờ</p>
          </div>
        </router-link>

        <router-link to="/staff/approvals" class="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <ClipboardDocumentCheckIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">Duyệt Seller & SP</p>
            <p class="text-sm text-gray-500">{{ stats.pendingSellers + stats.pendingProducts }} đang chờ</p>
          </div>
        </router-link>

        <router-link to="/admin/announcements" class="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <MegaphoneIcon class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">Thông báo</p>
            <p class="text-sm text-gray-500">Gửi thông báo cho người dùng</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Hoạt động gần đây</h2>
      </div>
      <div class="p-6">
        <div v-if="loading" class="flex justify-center py-8">
          <LoadingSpinner class="w-8 h-8" />
        </div>
        <div v-else-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
          Chưa có hoạt động nào
        </div>
        <div v-else class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getActivityIconClass(activity.type)">
              <component :is="getActivityIcon(activity.type)" class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.description }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(activity.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  TicketIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  MegaphoneIcon,
  UserPlusIcon,
  DocumentCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const loading = ref(true);
const stats = ref({
  pendingTickets: 0,
  pendingSellers: 0,
  pendingProducts: 0,
  resolvedTickets: 0
});
const recentActivity = ref([]);

const fetchStats = async () => {
  try {
    // TODO: Gọi API lấy stats
    // const response = await staffApi.getDashboardStats();
    // stats.value = response.data;
    
    // Mock data
    stats.value = {
      pendingTickets: 12,
      pendingSellers: 3,
      pendingProducts: 8,
      resolvedTickets: 156
    };
  } catch (error) {
    console.error('Lỗi tải stats:', error);
  }
};

const fetchRecentActivity = async () => {
  try {
    // TODO: Gọi API
    recentActivity.value = [
      { id: 1, type: 'ticket', title: 'Ticket mới #1234', description: 'Người dùng báo lỗi đăng nhập', createdAt: new Date() },
      { id: 2, type: 'seller', title: 'Seller mới đăng ký', description: 'ABC Store đang chờ duyệt', createdAt: new Date(Date.now() - 3600000) },
      { id: 3, type: 'product', title: 'Sản phẩm mới', description: 'Discord Nitro 1 tháng đang chờ duyệt', createdAt: new Date(Date.now() - 7200000) }
    ];
  } catch (error) {
    console.error('Lỗi tải activity:', error);
  } finally {
    loading.value = false;
  }
};

const getActivityIcon = (type) => {
  const icons = {
    ticket: ChatBubbleLeftRightIcon,
    seller: UserPlusIcon,
    product: DocumentCheckIcon
  };
  return icons[type] || ChatBubbleLeftRightIcon;
};

const getActivityIconClass = (type) => {
  const classes = {
    ticket: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    seller: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    product: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
  };
  return classes[type] || 'bg-gray-100 dark:bg-gray-800';
};

const formatNumber = (num) => new Intl.NumberFormat('vi-VN').format(num);
const formatDate = (date) => new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(new Date(date));

onMounted(() => {
  fetchStats();
  fetchRecentActivity();
});
</script>
