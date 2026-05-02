<template>
  <div class="min-h-screen">
    <!-- Hero Section - Modern Blue Design -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden">
      <!-- Animated Blue Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-indigo-100/50 to-cyan-100/50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-cyan-900/20" />
      
      <!-- Geometric Pattern -->
      <div class="absolute inset-0 opacity-20 dark:opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233b82f6\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      
      <!-- Floating Blue Elements -->
      <div class="absolute top-20 left-10 w-32 h-32 bg-blue-400/30 rounded-full blur-2xl animate-pulse" style="animation-duration: 4s;" />
      <div class="absolute top-40 right-20 w-24 h-24 bg-indigo-400/30 rounded-full blur-2xl animate-pulse" style="animation-duration: 5s; animation-delay: 1s;" />
      <div class="absolute bottom-32 left-1/4 w-40 h-40 bg-cyan-400/30 rounded-full blur-2xl animate-pulse" style="animation-duration: 6s; animation-delay: 2s;" />
      <div class="absolute bottom-20 right-1/3 w-28 h-28 bg-violet-400/30 rounded-full blur-2xl animate-pulse" style="animation-duration: 4.5s; animation-delay: 0.5s;" />
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="text-center lg:text-left">
            <!-- Modern Badge -->
            <div class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-full text-blue-600 dark:text-blue-300 text-sm font-medium mb-6 border border-blue-200 dark:border-blue-500/30 shadow-lg shadow-blue-200/50 dark:shadow-blue-500/20">
              <span class="text-blue-500">🌊</span>
              <span class="font-jp">マーケットプレイス</span>
              <span class="hidden sm:inline">- Digital Marketplace</span>
            </div>
            
            <!-- Modern Title -->
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-6 leading-tight font-display">
              <span class="block">はっくす</span>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 block mt-2">
                Hakkusu Store
              </span>
            </h1>
            
            <p class="text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Thiên đường mua sắm sản phẩm số với trải nghiệm <span class="text-blue-600 font-semibold">hiện đại</span><br>
              Game accounts, tools, và nhiều hơn nữa!
            </p>
            
            <!-- Modern CTA Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <router-link 
                to="/services" 
                class="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-bold rounded-2xl overflow-hidden shadow-xl shadow-blue-300/50 hover:shadow-2xl hover:shadow-indigo-300/50 transition-all duration-300 w-full sm:w-auto"
              >
                <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
                  Khám phá ngay
                  <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </router-link>
              <a 
                href="#features" 
                class="px-8 py-4 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl border-2 border-blue-200 dark:border-blue-500/30 bg-white/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-300 w-full sm:w-auto text-center backdrop-blur-sm"
              >
                Tìm hiểu thêm
              </a>
            </div>

            <!-- Modern Stats -->
            <div class="flex items-center justify-center lg:justify-start gap-6 mt-12">
              <div class="text-center px-4 py-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-100 dark:border-blue-500/20">
                <p class="text-2xl font-bold text-blue-600">10K+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Người dùng</p>
              </div>
              <div class="text-center px-4 py-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                <p class="text-2xl font-bold text-indigo-600">500+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Sản phẩm</p>
              </div>
              <div class="text-center px-4 py-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-cyan-100 dark:border-cyan-500/20">
                <p class="text-2xl font-bold text-cyan-600">50+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Seller</p>
              </div>
            </div>
          </div>

          <!-- Modern Hero Visual -->
          <div class="hidden lg:block relative">
            <div class="relative w-full aspect-square max-w-md mx-auto">
              <!-- Decorative Blobs -->
              <div class="absolute -top-8 -left-8 w-32 h-32 bg-blue-300/40 rounded-full blur-xl animate-pulse" />
              <div class="absolute -bottom-8 -right-8 w-40 h-40 bg-indigo-300/40 rounded-full blur-xl animate-pulse" style="animation-delay: 1s;" />
              <div class="absolute top-1/2 -left-12 w-24 h-24 bg-cyan-300/40 rounded-full blur-xl animate-pulse" style="animation-delay: 2s;" />
              
              <!-- Main Card -->
              <div class="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-blue-200 dark:border-blue-500/30 shadow-2xl shadow-blue-200/50 dark:shadow-blue-500/20 p-6 transform hover:scale-105 transition-transform duration-500">
                <!-- Modern Header -->
                <div class="flex items-center justify-between mb-5">
                  <div class="flex items-center gap-2">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-300/50">
                      <ShoppingBagIcon class="w-5 h-5 text-white" />
                    </div>
                    <span class="font-bold text-slate-800 dark:text-slate-200">はっくす</span>
                  </div>
                  <span class="text-xs font-medium text-blue-500 bg-blue-100 dark:bg-blue-500/20 px-2 py-1 rounded-full">Pro</span>
                </div>
                
                <!-- Modern Content -->
                <div class="space-y-3">
                  <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-300/30">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                    </div>
                    <div class="flex-1">
                      <p class="font-semibold text-slate-800 dark:text-slate-200 text-sm">Game Account</p>
                      <p class="text-xs text-slate-500">Premium Tier</p>
                    </div>
                    <span class="text-blue-600 font-bold text-sm">₫99K</span>
                  </div>
                  
                  <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-300/30">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <div class="flex-1">
                      <p class="font-semibold text-slate-800 dark:text-slate-200 text-sm">Discord Bot</p>
                      <p class="text-xs text-slate-500">Auto Delivery</p>
                    </div>
                    <span class="text-indigo-600 font-bold text-sm">₫149K</span>
                  </div>
                  
                  <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-300/30">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <div class="flex-1">
                      <p class="font-semibold text-slate-800 dark:text-slate-200 text-sm">Server Boost</p>
                      <p class="text-xs text-slate-500">Instant Access</p>
                    </div>
                    <span class="text-cyan-600 font-bold text-sm">₫49K</span>
                  </div>
                </div>
                
                <!-- Modern Footer -->
                <div class="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span class="text-xs text-slate-500">Giao dịch an toàn</span>
                  <div class="flex items-center gap-0.5">
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span class="text-xs text-slate-500 ml-1">5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Announcements Banner -->
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnnouncementBanner />
      </div>
    </section>

    <!-- Modern Features Section -->
    <section id="features" class="py-24 relative">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px), radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px); background-size: 60px 60px;"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium mb-4">特徴 Tokuchou</span>
          <h2 class="text-4xl font-bold text-slate-800 dark:text-white mb-4 font-display">
            Tại sao chọn <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Hakkusu?</span>
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Marketplace hiện đại với đầy đủ tính năng và bảo mật
          </p>
        </div>

        <!-- Modern Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 shadow-lg hover:shadow-xl hover:shadow-blue-200/50 dark:hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2"
          >
            <div class="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" :class="feature.bgClass">
              <component :is="feature.icon" class="w-8 h-8" :class="feature.iconClass" />
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2 text-center">
              {{ feature.title }}
            </h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm text-center">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Modern CTA Section -->
    <section class="py-24 relative overflow-hidden">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600" />
      
      <!-- Decorative SVG Elements -->
      <!-- Top Left Circle -->
      <div class="absolute top-10 left-10 w-20 h-20 opacity-20 animate-pulse" style="animation-duration: 4s;">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="white" stroke-width="2" fill="none"/>
          <circle cx="50" cy="50" r="30" stroke="white" stroke-width="1" fill="none" opacity="0.5"/>
        </svg>
      </div>
      
      <!-- Bottom Right Star -->
      <div class="absolute bottom-10 right-10 w-16 h-16 opacity-20 animate-pulse" style="animation-duration: 5s;">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5 L61 35 L95 35 L68 57 L79 87 L50 65 L21 87 L32 57 L5 35 L39 35 Z" fill="white" opacity="0.3"/>
        </svg>
      </div>
      
      <!-- Left Side Diamond -->
      <div class="absolute top-1/2 left-16 w-12 h-12 opacity-15 animate-pulse">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" stroke="white" stroke-width="2" fill="none"/>
        </svg>
      </div>
      
      <!-- Right Side Small Star -->
      <div class="absolute top-20 right-1/4 w-10 h-10 opacity-20 animate-pulse" style="animation-delay: 1s;">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 L58 38 L90 38 L64 56 L72 84 L50 66 L28 84 L36 56 L10 38 L42 38 Z" fill="white" opacity="0.4"/>
        </svg>
      </div>
      
      <!-- Additional Decorative Circles -->
      <div class="absolute bottom-20 left-1/4 w-8 h-8 opacity-10 animate-pulse" style="animation-delay: 2s;">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="white" opacity="0.2"/>
        </svg>
      </div>
      
      <div class="absolute top-1/3 right-20 w-6 h-6 opacity-15 animate-pulse" style="animation-delay: 0.5s;">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="white" stroke-width="3" fill="none"/>
        </svg>
      </div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6 border border-white/30">
          始めましょう ~ Let's Start
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6 font-display drop-shadow-lg">
          Sẵn sàng khám phá?
        </h2>
        <p class="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
          Tham gia cộng đồng của chúng tôi ngay hôm nay! Tìm kiếm sản phẩm chất lượng từ các seller đáng tin cậy
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link
            to="/services"
            class="group inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Khám phá ngay
            <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </router-link>
          <router-link
            to="/auth/register"
            class="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300"
          >
            Đăng ký miễn phí
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import {
  ShieldCheckIcon,
  BoltIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  GiftIcon
} from '@heroicons/vue/24/solid';
import AnnouncementBanner from '@/components/home/AnnouncementBanner.vue';

const { t } = useI18n();

const features = [
  {
    icon: ShoppingBagIcon,
    title: 'Mua bán dễ dàng',
    description: 'Tìm kiếm và mua sản phẩm từ nhiều seller khác nhau chỉ với vài click',
    bgClass: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-500/20 dark:to-blue-600/20',
    iconClass: 'text-blue-500'
  },
  {
    icon: ShieldCheckIcon,
    title: 'An toàn tuyệt đối',
    description: 'Bảo vệ người mua, đảm bảo nhận đúng sản phẩm trước khi thanh toán',
    bgClass: 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-500/20 dark:to-indigo-600/20',
    iconClass: 'text-indigo-500'
  },
  {
    icon: BoltIcon,
    title: 'Giao hàng tức thì',
    description: 'Nhận sản phẩm ngay lập tức sau khi thanh toán thành công',
    bgClass: 'bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-500/20 dark:to-cyan-600/20',
    iconClass: 'text-cyan-500'
  },
  {
    icon: GiftIcon,
    title: 'Trở thành Seller',
    description: 'Đăng ký làm seller để bán sản phẩm và kiếm thu nhập',
    bgClass: 'bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-500/20 dark:to-violet-600/20',
    iconClass: 'text-violet-500'
  }
];
</script>
