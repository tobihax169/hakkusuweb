<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Top Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Left: Logo & Toggle -->
          <div class="flex items-center gap-4">
            <button 
              @click="sidebarOpen = !sidebarOpen"
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
            >
              <Bars3Icon class="w-6 h-6" />
            </button>
            <router-link to="/" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">Admin</span>
            </router-link>
          </div>
          
          <!-- Right: User Menu -->
          <div class="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitch />
            
            <div class="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <img 
                v-if="authStore.userAvatar" 
                :src="authStore.userAvatar" 
                class="w-8 h-8 rounded-full"
              />
              <div v-else class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                {{ authStore.userDisplayName }}
              </span>
              <button 
                @click="authStore.logout"
                class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
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
          'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-16 transform transition-transform duration-200 lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <nav class="px-4 py-6 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              $route.path === item.path
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </router-link>
        </nav>
      </aside>

      <!-- Mobile Overlay -->
      <div 
        v-if="sidebarOpen" 
        @click="sidebarOpen = false"
        class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      />

      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.js';
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  CubeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline';
import ThemeToggle from '@/components/common/ThemeToggle.vue';
import LanguageSwitch from '@/components/common/LanguageSwitch.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const sidebarOpen = ref(false);

const menuItems = [
  { name: 'dashboard', label: t('admin.dashboard'), path: '/admin', icon: HomeIcon },
  { name: 'users', label: t('admin.users'), path: '/admin/users', icon: UsersIcon },
  { name: 'orders', label: t('admin.orders'), path: '/admin/orders', icon: ShoppingBagIcon },
  { name: 'services', label: t('admin.services'), path: '/admin/services', icon: CubeIcon }
];
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
