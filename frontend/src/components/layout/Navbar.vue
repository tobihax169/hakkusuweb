<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-8">
          <router-link to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">Hakkusu Shop</span>
          </router-link>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <router-link 
              to="/" 
              class="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {{ $t('nav.home') }}
            </router-link>
            <router-link 
              to="/services" 
              class="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {{ $t('nav.services') }}
            </router-link>
          </div>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-4">
          <ThemeToggle class="hidden sm:block" />
          <LanguageSwitch class="hidden sm:block" />

          <!-- Auth Buttons -->
          <template v-if="!authStore.isAuthenticated">
            <router-link 
              to="/auth/login"
              class="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {{ $t('nav.login') }}
            </router-link>
            <router-link 
              to="/auth/register"
              class="btn-primary text-sm"
            >
              {{ $t('nav.register') }}
            </router-link>
          </template>

          <!-- User Menu -->
          <div v-else class="flex items-center gap-4">
            <!-- Wallet Quick View -->
            <router-link 
              to="/user/wallet" 
              class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            >
              <CurrencyDollarIcon class="w-4 h-4" />
              <span class="text-sm font-medium">{{ formatGem(authStore.user?.gem) }}</span>
            </router-link>

            <!-- User Dropdown -->
            <div class="relative" ref="dropdownRef">
              <button 
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
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
                <ChevronDownIcon class="w-4 h-4 text-gray-500" />
              </button>

              <!-- Dropdown Menu -->
              <div 
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
              >
                <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ authStore.userDisplayName }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
                </div>
                
                <router-link 
                  to="/user/profile" 
                  @click="userMenuOpen = false"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <UserIcon class="w-4 h-4" />
                  {{ $t('nav.profile') }}
                </router-link>
                
                <router-link 
                  to="/orders" 
                  @click="userMenuOpen = false"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ShoppingBagIcon class="w-4 h-4" />
                  {{ $t('nav.orders') }}
                </router-link>
                
                <router-link 
                  to="/user/wallet" 
                  @click="userMenuOpen = false"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:hidden"
                >
                  <CurrencyDollarIcon class="w-4 h-4" />
                  {{ $t('nav.wallet') }}
                </router-link>

                <div v-if="authStore.isAdmin" class="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                  <router-link 
                    to="/admin" 
                    @click="userMenuOpen = false"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <ShieldCheckIcon class="w-4 h-4" />
                    {{ $t('nav.admin') }}
                  </router-link>
                </div>

                <div class="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                  <button 
                    @click="handleLogout"
                    class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <ArrowRightOnRectangleIcon class="w-4 h-4" />
                    {{ $t('nav.logout') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
        <div class="space-y-2">
          <router-link 
            to="/" 
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {{ $t('nav.home') }}
          </router-link>
          <router-link 
            to="/services" 
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {{ $t('nav.services') }}
          </router-link>
          <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
            <div class="flex items-center gap-4 px-3">
              <ThemeToggle />
              <LanguageSwitch />
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import {
  ChevronDownIcon,
  UserIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline';
import ThemeToggle from '@/components/common/ThemeToggle.vue';
import LanguageSwitch from '@/components/common/LanguageSwitch.vue';

const router = useRouter();
const authStore = useAuthStore();

const userMenuOpen = ref(false);
const mobileMenuOpen = ref(false);
const dropdownRef = ref(null);

const formatGem = (gem) => {
  if (!gem) return '0';
  return gem.toLocaleString('vi-VN');
};

const handleLogout = async () => {
  userMenuOpen.value = false;
  await authStore.logout();
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    userMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
