<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Top Navigation - Unified Dark Theme -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Left: Logo & Toggle -->
          <div class="flex items-center gap-4">
            <button 
              @click="sidebarOpen = !sidebarOpen"
              class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <Bars3Icon class="w-6 h-6" />
            </button>
            <router-link to="/" class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
              <div class="hidden sm:block">
                <span class="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  はっくす
                </span>
                <span class="ml-2 text-xs text-slate-400 font-medium">Store</span>
              </div>
            </router-link>
          </div>
          
          <!-- Right: User Menu -->
          <div class="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitch />
            
            <div class="flex items-center gap-3 pl-4 border-l border-slate-700/50">
              <img 
                v-if="authStore.userAvatar" 
                :src="authStore.userAvatar" 
                class="w-9 h-9 rounded-full border-2 border-blue-500/30"
              />
              <div v-else class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
              </div>
              <div class="hidden sm:block">
                <p class="text-sm font-medium text-white">{{ authStore.userDisplayName }}</p>
                <p class="text-xs text-slate-400">{{ authStore.user?.role?.toUpperCase() || 'USER' }}</p>
              </div>
              <button 
                @click="authStore.logout"
                class="p-2 text-slate-400 hover:text-red-400 transition-colors"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar & Content -->
    <div class="pt-16 flex">
      <!-- Sidebar -->
      <aside 
        :class="[
          'fixed inset-y-0 left-0 z-40 w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 pt-16 transform transition-transform duration-200 lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <nav class="px-3 py-6 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              $route.path === item.path || $route.path.startsWith(item.path + '/')
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </router-link>
        </nav>
        
        <!-- Sidebar Footer -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
          <div class="flex items-center gap-3 text-xs text-slate-500">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Hệ thống hoạt động</span>
          </div>
        </div>
      </aside>

      <!-- Mobile Overlay -->
      <div 
        v-if="sidebarOpen" 
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      />

      <!-- Main Content -->
      <main class="flex-1 overflow-auto bg-slate-900">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.js';
import { useRoute } from 'vue-router';
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  TicketIcon,
  ClipboardDocumentCheckIcon,
  MegaphoneIcon,
  CheckIcon
} from '@heroicons/vue/24/outline';
import ThemeToggle from '@/components/common/ThemeToggle.vue';
import LanguageSwitch from '@/components/common/LanguageSwitch.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const route = useRoute();
const sidebarOpen = ref(false);

const isStaffRoute = computed(() => route.path.startsWith('/staff'));

// Admin menu (with staff access)
const adminMenuItems = [
  { name: 'dashboard', label: t('admin.dashboard'), path: '/admin', icon: HomeIcon },
  { name: 'users', label: t('admin.users'), path: '/admin/users', icon: UsersIcon },
  { name: 'orders', label: t('admin.orders'), path: '/admin/orders', icon: ShoppingBagIcon },
  { name: 'announcements', label: 'Thông báo', path: '/admin/announcements', icon: MegaphoneIcon },
  { name: 'staff', label: 'Staff Dashboard', path: '/staff', icon: ClipboardDocumentCheckIcon },
  { name: 'tickets', label: 'Tickets', path: '/staff/tickets', icon: TicketIcon },
  { name: 'approvals', label: 'Duyệt đơn', path: '/staff/approvals', icon: CheckIcon }
];

// Staff/Support menu
const staffMenuItems = [
  { name: 'dashboard', label: 'Tổng quan', path: '/staff', icon: HomeIcon },
  { name: 'tickets', label: 'Tickets', path: '/staff/tickets', icon: TicketIcon },
  { name: 'approvals', label: 'Duyệt đơn', path: '/staff/approvals', icon: ClipboardDocumentCheckIcon },
  { name: 'announcements', label: 'Thông báo', path: '/staff/announcements', icon: MegaphoneIcon }
];

const menuItems = computed(() => {
  if (isStaffRoute.value) return staffMenuItems;
  return adminMenuItems;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
