<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-blue-100 dark:border-blue-500/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-8">
          <router-link to="/" class="group">
            <!-- Text Logo Only -->
            <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              はっくす
            </span>
          </router-link>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-1">
            <router-link 
              to="/" 
              class="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 transition-all"
            >
              {{ $t('nav.home') }}
            </router-link>
            <router-link 
              to="/services" 
              class="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 transition-all"
            >
              {{ $t('nav.services') }}
            </router-link>
          </div>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-3">
          <ThemeToggle class="hidden sm:block" />
          <LanguageSwitch class="hidden sm:block" />

          <!-- Auth Buttons -->
          <template v-if="!authStore.isAuthenticated">
            <router-link 
              to="/auth/login"
              class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              {{ $t('nav.login') }}
            </router-link>
            <router-link 
              to="/auth/register"
              class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-blue-300/50 hover:shadow-xl hover:scale-105 transition-all"
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

                <!-- Seller Menu -->
                <div class="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                  <router-link
                    v-if="authStore.isSeller"
                    to="/seller/dashboard"
                    @click="userMenuOpen = false"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <BuildingStorefrontIcon class="w-4 h-4" />
                    Bảng điều khiển người bán
                  </router-link>
                  <router-link
                    v-else
                    to="/seller/register"
                    @click="userMenuOpen = false"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <BuildingStorefrontIcon class="w-4 h-4" />
                    Trở thành người bán
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
  Bars3Icon,
  BuildingStorefrontIcon
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
