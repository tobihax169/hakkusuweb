<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Bảng điều khiển nhân sự
          </h1>
          <p class="text-slate-400 mt-1">Quản lý hỗ trợ và phê duyệt</p>
        </div>
        <div class="text-sm text-slate-400">
          {{ currentDate }}
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <TicketIcon class="w-6 h-6" />
            </div>
            <Badge v-if="stats.pendingTickets > 0" variant="danger" class="bg-white text-rose-600">
              {{ stats.pendingTickets }} mới
            </Badge>
          </div>
          <p class="text-rose-100 text-sm">Phiếu hỗ trợ đang chờ</p>
          <p class="text-3xl font-bold">{{ stats.pendingTickets }}</p>
        </div>

        <div class="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <BuildingStorefrontIcon class="w-6 h-6" />
            </div>
            <Badge v-if="stats.pendingSellers > 0" variant="primary" class="bg-white text-blue-600">
              {{ stats.pendingSellers }} mới
            </Badge>
          </div>
          <p class="text-blue-100 text-sm">Người bán chờ duyệt</p>
          <p class="text-3xl font-bold">{{ stats.pendingSellers }}</p>
        </div>

        <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <CubeIcon class="w-6 h-6" />
            </div>
            <Badge v-if="stats.pendingProducts > 0" variant="warning" class="bg-white text-amber-600">
              {{ stats.pendingProducts }} mới
            </Badge>
          </div>
          <p class="text-amber-100 text-sm">Sản phẩm chờ duyệt</p>
          <p class="text-3xl font-bold">{{ stats.pendingProducts }}</p>
        </div>

        <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <CheckCircleIcon class="w-6 h-6" />
            </div>
          </div>
          <p class="text-emerald-100 text-sm">Đã xử lý hôm nay</p>
          <p class="text-3xl font-bold">{{ stats.resolvedTickets }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <router-link to="/staff/tickets" class="group">
          <GlassCard hover class="p-6 h-full">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-rose-500/20 flex items-center justify-center group-hover:bg-rose-500/30 transition-colors">
                <TicketIcon class="w-7 h-7 text-rose-400" />
              </div>
              <div>
                <p class="text-white font-medium">Xử lý phiếu hỗ trợ</p>
                <p class="text-slate-400 text-sm">{{ stats.pendingTickets }} đang chờ</p>
              </div>
            </div>
          </GlassCard>
        </router-link>

        <router-link to="/staff/approvals" class="group">
          <GlassCard hover class="p-6 h-full">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <ClipboardDocumentCheckIcon class="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <p class="text-white font-medium">Phê duyệt</p>
                <p class="text-slate-400 text-sm">{{ stats.pendingSellers + stats.pendingProducts }} chờ duyệt</p>
              </div>
            </div>
          </GlassCard>
        </router-link>

        <router-link to="/admin/announcements" class="group">
          <GlassCard hover class="p-6 h-full">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                <MegaphoneIcon class="w-7 h-7 text-violet-400" />
              </div>
              <div>
                <p class="text-white font-medium">Thông báo</p>
                <p class="text-slate-400 text-sm">Gửi thông báo</p>
              </div>
            </div>
          </GlassCard>
        </router-link>
      </div>

      <!-- Recent Activity -->
      <GlassCard>
        <div class="p-6 border-b border-slate-700/50">
          <h2 class="text-lg font-semibold text-white">Hoạt động gần đây</h2>
        </div>
        <div class="divide-y divide-slate-700/50">
          <div v-for="activity in recentActivity" :key="activity.id" class="p-4 flex items-center gap-4 hover:bg-slate-700/30 transition-colors">
            <div :class="getActivityIconClass(activity.type)" class="w-12 h-12 rounded-xl flex items-center justify-center">
              <component :is="getActivityIcon(activity.type)" class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <p class="text-white font-medium">{{ activity.title }}</p>
              <p class="text-slate-500 text-sm">{{ activity.description }}</p>
            </div>
            <span class="text-slate-500 text-xs">{{ formatDate(activity.createdAt) }}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import GlassCard from '@/components/ui/GlassCard.vue';
import Badge from '@/components/ui/Badge.vue';
import {
  TicketIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  MegaphoneIcon,
  ChatBubbleLeftRightIcon,
  UserPlusIcon,
  DocumentCheckIcon
} from '@heroicons/vue/24/solid';

const stats = ref({
  pendingTickets: 12,
  pendingSellers: 3,
  pendingProducts: 8,
  resolvedTickets: 156
});

const recentActivity = ref([
  { id: 1, type: 'ticket', title: 'Ticket mới #1234', description: 'Người dùng báo lỗi đăng nhập', createdAt: new Date() },
  { id: 2, type: 'seller', title: 'Người bán mới đăng ký', description: 'ABC Store đang chờ duyệt', createdAt: new Date(Date.now() - 3600000) },
  { id: 3, type: 'product', title: 'Sản phẩm mới', description: 'Discord Nitro 1 tháng đang chờ duyệt', createdAt: new Date(Date.now() - 7200000) }
]);

const currentDate = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const getActivityIcon = (type) => ({
  ticket: ChatBubbleLeftRightIcon,
  seller: UserPlusIcon,
  product: DocumentCheckIcon
}[type] || ChatBubbleLeftRightIcon);

const getActivityIconClass = (type) => ({
  ticket: 'bg-rose-500/20 text-rose-400',
  seller: 'bg-blue-500/20 text-blue-400',
  product: 'bg-amber-500/20 text-amber-400'
}[type] || 'bg-slate-500/20 text-slate-400');

const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return d.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {});
</script>
