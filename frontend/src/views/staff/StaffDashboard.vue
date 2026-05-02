<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
          {{ $t('staff.dashboard') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Quản lý hỗ trợ và phê duyệt</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ currentDate }}</span>
        <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
      </div>
    </div>

    <!-- Stats Cards - Gradient -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Pending Tickets -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 transition-all duration-300 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <TicketIcon class="w-6 h-6 text-white" />
            </div>
            <span v-if="stats.pendingTickets > 0" class="px-2 py-1 text-xs font-bold bg-white text-rose-600 rounded-full animate-pulse">
              {{ stats.pendingTickets }} mới
            </span>
          </div>
          <p class="text-rose-100 text-sm font-medium">Tickets đang chờ</p>
          <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.pendingTickets) }}</p>
        </div>
      </div>

      <!-- Pending Sellers -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <BuildingStorefrontIcon class="w-6 h-6 text-white" />
            </div>
            <span v-if="stats.pendingSellers > 0" class="px-2 py-1 text-xs font-bold bg-white text-blue-600 rounded-full">
              {{ stats.pendingSellers }} mới
            </span>
          </div>
          <p class="text-blue-100 text-sm font-medium">Seller chờ duyệt</p>
          <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.pendingSellers) }}</p>
        </div>
      </div>

      <!-- Pending Products -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <CubeIcon class="w-6 h-6 text-white" />
            </div>
            <span v-if="stats.pendingProducts > 0" class="px-2 py-1 text-xs font-bold bg-white text-amber-600 rounded-full">
              {{ stats.pendingProducts }} mới
            </span>
          </div>
          <p class="text-amber-100 text-sm font-medium">Sản phẩm chờ duyệt</p>
          <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.pendingProducts) }}</p>
        </div>
      </div>

      <!-- Resolved Tickets -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1">
        <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <CheckCircleIcon class="w-6 h-6 text-white" />
            </div>
            <span class="flex items-center gap-1 text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              <ArrowUpIcon class="w-4 h-4" /> 5%
            </span>
          </div>
          <p class="text-emerald-100 text-sm font-medium">Đã xử lý hôm nay</p>
          <p class="text-3xl font-bold mt-1">{{ formatNumber(stats.resolvedTickets) }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions - Glass Cards -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BoltIcon class="w-5 h-5 text-amber-500" />
          Hành động nhanh
        </h2>
      </div>
      <div class="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <router-link to="/staff/tickets" class="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border border-rose-100 dark:border-rose-800 hover:shadow-lg hover:shadow-rose-500/20 transition-all duration-300">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
            <TicketIcon class="w-7 h-7 text-white" />
          </div>
          <div>
            <p class="font-bold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Xử lý Tickets</p>
            <p class="text-sm text-gray-500">{{ stats.pendingTickets }} đang chờ xử lý</p>
          </div>
          <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all ml-auto" />
        </router-link>

        <router-link to="/staff/approvals" class="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
            <ClipboardDocumentCheckIcon class="w-7 h-7 text-white" />
          </div>
          <div>
            <p class="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Duyệt đơn</p>
            <p class="text-sm text-gray-500">{{ stats.pendingSellers + stats.pendingProducts }} chờ duyệt</p>
          </div>
          <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all ml-auto" />
        </router-link>

        <router-link to="/admin/announcements" class="group flex items-center gap-4 p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
            <MegaphoneIcon class="w-7 h-7 text-white" />
          </div>
          <div>
            <p class="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Thông báo</p>
            <p class="text-sm text-gray-500">Gửi thông báo hệ thống</p>
          </div>
          <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all ml-auto" />
        </router-link>
      </div>
    </div>

    <!-- Recent Activity - Timeline -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ClockIcon class="w-5 h-5 text-primary-500" />
          Hoạt động gần đây
        </h2>
        <button class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">Xem tất cả</button>
      </div>
      <div class="p-6">
        <div v-if="loading" class="flex justify-center py-12">
          <LoadingSpinner class="w-8 h-8" />
        </div>
        <div v-else-if="recentActivity.length === 0" class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <ClockIcon class="w-10 h-10 text-gray-400" />
          </div>
          <p class="text-gray-500 dark:text-gray-400">Chưa có hoạt động nào</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="(activity, index) in recentActivity" :key="activity.id" class="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-700/50 dark:to-transparent hover:from-gray-100 dark:hover:from-gray-700 transition-colors border-l-4" :class="getActivityBorderClass(activity.type)">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" :class="getActivityIconClass(activity.type)">
              <component :is="getActivityIcon(activity.type)" class="w-6 h-6" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-gray-900 dark:text-white">{{ activity.title }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ activity.description }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="getActivityBadgeClass(activity.type)">{{ getActivityLabel(activity.type) }}</span>
                <span class="text-xs text-gray-400">{{ formatDate(activity.createdAt) }}</span>
              </div>
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
  ChatBubbleLeftRightIcon,
  BoltIcon,
  ArrowRightIcon,
  ClockIcon,
  ArrowUpIcon
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
    // Silent fail for mock data
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
    // Silent fail for mock data
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
    ticket: 'bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-rose-500/30',
    seller: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-blue-500/30',
    product: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/30'
  };
  return classes[type] || 'bg-gray-100 dark:bg-gray-800';
};

const getActivityBorderClass = (type) => {
  const classes = {
    ticket: 'border-rose-400',
    seller: 'border-blue-400',
    product: 'border-amber-400'
  };
  return classes[type] || 'border-gray-300';
};

const getActivityBadgeClass = (type) => {
  const classes = {
    ticket: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    seller: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    product: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
  };
  return classes[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-700';
};

const getActivityLabel = (type) => {
  const labels = { ticket: 'Hỗ trợ', seller: 'Seller', product: 'Sản phẩm' };
  return labels[type] || type;
};

const currentDate = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const formatNumber = (num) => new Intl.NumberFormat('vi-VN').format(num);
const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(d);
};

onMounted(() => {
  fetchStats();
  fetchRecentActivity();
});
</script>
