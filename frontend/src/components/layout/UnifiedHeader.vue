<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-8">
          <router-link to="/" class="group flex items-center gap-3">
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
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-1">
            <router-link 
              to="/" 
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                $route.path === '/' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/10'
              ]"
            >
              {{ $t('nav.home') }}
            </router-link>
            <router-link 
              to="/services" 
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                $route.path.startsWith('/services')
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/10'
              ]"
            >
              {{ $t('nav.services') }}
            </router-link>
          </div>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-3">
          <!-- Auth Buttons -->
          <template v-if="!authStore.isAuthenticated">
            <router-link 
              to="/auth/login"
              class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
            >
              {{ $t('nav.login') }}
            </router-link>
            <router-link 
              to="/auth/register"
              class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all"
            >
              {{ $t('nav.register') }}
            </router-link>
          </template>

          <!-- User Menu -->
          <div v-else class="flex items-center gap-4">
            <!-- Wallet Quick View -->
            <router-link 
              to="/user/wallet" 
              class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm font-medium">{{ formatGem(authStore.user?.gem) }}</span>
            </router-link>

            <!-- User Dropdown -->
            <div class="relative" ref="dropdownRef">
              <button 
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <img 
                  v-if="authStore.userAvatar" 
                  :src="authStore.userAvatar" 
                  class="w-8 h-8 rounded-full border-2 border-blue-500/30"
                />
                <div v-else class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                  {{ authStore.userDisplayName.charAt(0).toUpperCase() }}
                </div>
                <ChevronDownIcon class="w-4 h-4 text-slate-400" />
              </button>

              <!-- Dropdown Menu -->
              <div 
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-2 z-50 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-slate-700">
                  <p class="text-sm font-medium text-white">{{ authStore.userDisplayName }}</p>
                  <p class="text-xs text-slate-400">{{ authStore.user?.email }}</p>
                  <div v-if="authStore.user?.role" class="mt-2">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      :class="{
                        'bg-blue-500/20 text-blue-400': authStore.user.role === 'admin',
                        'bg-green-500/20 text-green-400': authStore.user.role === 'seller',
                        'bg-purple-500/20 text-purple-400': authStore.user.role === 'support',
                        'bg-slate-500/20 text-slate-400': authStore.user.role === 'user'
                      }"
                    >
                      {{ authStore.user.role.toUpperCase() }}
                    </span>
                  </div>
                </div>
                
                <router-link 
                  to="/user/profile" 
                  @click="userMenuOpen = false"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                  <UserIcon class="w-4 h-4" />
                  {{ $t('nav.profile') }}
                </router-link>
                
                <router-link 
                  to="/orders" 
                  @click="userMenuOpen = false"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                  <ShoppingBagIcon class="w-4 h-4" />
                  {{ $t('nav.orders') }}
                </router-link>
                
                <router-link 
                  to="/user/wallet" 
                  @click="userMenuOpen = false"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors sm:hidden"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ $t('nav.wallet') }}
                </router-link>

                <!-- Admin Menu -->
                <div v-if="authStore.isAdmin" class="border-t border-slate-700 mt-1 pt-1">
                  <router-link
                    to="/admin"
                    @click="userMenuOpen = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-400 hover:bg-slate-700/50 transition-colors"
                  >
                    <ShieldCheckIcon class="w-4 h-4" />
                    {{ $t('nav.admin') }}
                  </router-link>
                  <router-link
                    to="/staff"
                    @click="userMenuOpen = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-400 hover:bg-slate-700/50 transition-colors"
                  >
                    <ClipboardDocumentCheckIcon class="w-4 h-4" />
                    Staff Dashboard
                  </router-link>
                </div>

                <!-- Seller Menu -->
                <div v-if="authStore.isSeller || authStore.isAdmin" class="border-t border-slate-700 mt-1 pt-1">
                  <router-link
                    v-if="authStore.isSeller"
                    to="/seller/dashboard"
                    @click="userMenuOpen = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-green-400 hover:bg-slate-700/50 transition-colors"
                  >
                    <BuildingStorefrontIcon class="w-4 h-4" />
                    Seller Dashboard
                  </router-link>
                </div>

                <div class="border-t border-slate-700 mt-1 pt-1">
                  <button 
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700/50 transition-colors"
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
            class="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-slate-700/50">
        <div class="space-y-2">
          <router-link 
            to="/" 
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {{ $t('nav.home') }}
          </router-link>
          <router-link 
            to="/services" 
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {{ $t('nav.services') }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import {
  ChevronDownIcon,
  UserIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline';

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
