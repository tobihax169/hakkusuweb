<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
    <!-- Hero Section - Anime/Kawaii Design -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden">
      <!-- Animated Pastel Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-purple-100/50 to-blue-100/50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20" />
      
      <!-- Sakura Petals Pattern -->
      <div class="absolute inset-0 opacity-30 dark:opacity-10" style="background-image: url('data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M40 10c-5 0-10 5-10 10 0 5 5 10 10 10 5 0 10-5 10-10 0-5-5-10-10-10zM20 40c-3 0-6 3-6 6s3 6 6 6 6-3 6-6-3-6-6-6zM60 50c-4 0-8 4-8 8s4 8 8 8 8-4 8-8-4-8-8-8z\' fill=\'%23ff99aa\' fill-opacity=\'0.3\'/%3E%3C/svg%3E');"></div>
      
      <!-- Floating Kawaii Elements -->
      <div class="absolute top-20 left-10 w-32 h-32 bg-pink-300/40 rounded-full blur-2xl animate-bounce" style="animation-duration: 3s;" />
      <div class="absolute top-40 right-20 w-24 h-24 bg-purple-300/40 rounded-full blur-2xl animate-bounce" style="animation-duration: 4s; animation-delay: 1s;" />
      <div class="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-300/40 rounded-full blur-2xl animate-bounce" style="animation-duration: 5s; animation-delay: 2s;" />
      <div class="absolute bottom-20 right-1/3 w-28 h-28 bg-mint-300/40 rounded-full blur-2xl animate-bounce" style="animation-duration: 3.5s; animation-delay: 0.5s;" />
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="text-center lg:text-left">
            <!-- Kawaii Badge -->
            <div class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-full text-pink-500 dark:text-pink-300 text-sm font-medium mb-6 border-2 border-pink-200 dark:border-pink-500/30 shadow-lg shadow-pink-200/50 dark:shadow-pink-500/20">
              <HeartIcon class="w-4 h-4 text-pink-500 animate-pulse" />
              <span class="font-jp">マーケットプレイス ♡</span>
              <span class="hidden sm:inline">- Marketplace kawaii desu~</span>
            </div>
            
            <!-- Anime Style Title -->
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-6 leading-tight font-display">
              <span class="block">はっくす</span>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 block mt-2">
                Hakkusu Store
              </span>
            </h1>
            
            <p class="text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Thiên đường mua sắm sản phẩm số với phong cách <span class="text-pink-500 font-semibold">kawaii</span> ✨<br>
              Game accounts, tools, và nhiều hơn nữa!
            </p>
            
            <!-- Kawaii CTA Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <router-link 
                to="/services" 
                class="group relative px-8 py-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-bold rounded-2xl overflow-hidden shadow-xl shadow-pink-300/50 hover:shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 w-full sm:w-auto border-2 border-white/50"
              >
                <span class="relative z-10 flex items-center justify-center gap-2 text-lg">
                  Khám phá ngay~
                  <SparklesIcon class="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </router-link>
              <a 
                href="#features" 
                class="px-8 py-4 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl border-2 border-pink-200 dark:border-pink-500/30 bg-white/50 dark:bg-white/5 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-all duration-300 w-full sm:w-auto text-center backdrop-blur-sm"
              >
                Tìm hiểu thêm ⭐
              </a>
            </div>

            <!-- Kawaii Stats -->
            <div class="flex items-center justify-center lg:justify-start gap-6 mt-12">
              <div class="text-center px-4 py-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-pink-100 dark:border-pink-500/20">
                <p class="text-2xl font-bold text-pink-500">10K+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Người dùng 💕</p>
              </div>
              <div class="text-center px-4 py-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-purple-100 dark:border-purple-500/20">
                <p class="text-2xl font-bold text-purple-500">500+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Sản phẩm ✨</p>
              </div>
              <div class="text-center px-4 py-3 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-100 dark:border-blue-500/20">
                <p class="text-2xl font-bold text-blue-500">50+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">Seller 🌸</p>
              </div>
            </div>
          </div>

          <!-- Kawaii Hero Visual -->
          <div class="hidden lg:block relative">
            <div class="relative w-full aspect-square max-w-md mx-auto">
              <!-- Decorative Blobs -->
              <div class="absolute -top-8 -left-8 w-32 h-32 bg-pink-300/60 rounded-full blur-xl animate-pulse" />
              <div class="absolute -bottom-8 -right-8 w-40 h-40 bg-purple-300/60 rounded-full blur-xl animate-pulse" style="animation-delay: 1s;" />
              <div class="absolute top-1/2 -left-12 w-24 h-24 bg-blue-300/60 rounded-full blur-xl animate-pulse" style="animation-delay: 2s;" />
              
              <!-- Main Card -->
              <div class="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] border-2 border-pink-200 dark:border-pink-500/30 shadow-2xl shadow-pink-200/50 dark:shadow-pink-500/20 p-8 transform hover:scale-105 transition-transform duration-500">
                <!-- Kawaii Header -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-2">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
                      <HeartIcon class="w-5 h-5 text-white" />
                    </div>
                    <span class="font-bold text-slate-700 dark:text-slate-200">はっくす</span>
                  </div>
                  <span class="text-2xl">🌸</span>
                </div>
                
                <!-- Cute Content -->
                <div class="space-y-4">
                  <div class="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-500/10 rounded-xl">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xl">🎮</div>
                    <div>
                      <p class="font-semibold text-slate-700 dark:text-slate-200">Game Account</p>
                      <p class="text-xs text-slate-500">Premium ✨</p>
                    </div>
                    <span class="ml-auto text-pink-500 font-bold">₫99K</span>
                  </div>
                  
                  <div class="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white text-xl">🤖</div>
                    <div>
                      <p class="font-semibold text-slate-700 dark:text-slate-200">Discord Bot</p>
                      <p class="text-xs text-slate-500">Auto delivery 🚀</p>
                    </div>
                    <span class="ml-auto text-purple-500 font-bold">₫149K</span>
                  </div>
                  
                  <div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-mint-400 to-blue-400 flex items-center justify-center text-white text-xl">⚡</div>
                    <div>
                      <p class="font-semibold text-slate-700 dark:text-slate-200">Server Boost</p>
                      <p class="text-xs text-slate-500">Instant ⚡</p>
                    </div>
                    <span class="ml-auto text-blue-500 font-bold">₫49K</span>
                  </div>
                </div>
                
                <!-- Cute Footer -->
                <div class="mt-6 pt-4 border-t border-pink-100 dark:border-pink-500/20 flex items-center justify-between">
                  <span class="text-sm text-slate-500">Giao dịch an toàn 💕</span>
                  <div class="flex gap-1">
                    <span class="text-yellow-400">⭐</span>
                    <span class="text-yellow-400">⭐</span>
                    <span class="text-yellow-400">⭐</span>
                    <span class="text-yellow-400">⭐</span>
                    <span class="text-yellow-400">⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Announcements Banner -->
    <section class="py-8 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnnouncementBanner />
      </div>
    </section>

    <!-- Kawaii Features Section -->
    <section id="features" class="py-24 relative">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle at 25% 25%, #ffc1cc 2px, transparent 2px), radial-gradient(circle at 75% 75%, #c4b5fd 2px, transparent 2px); background-size: 60px 60px;"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 rounded-full text-sm font-medium mb-4">✨ 特徴 Tokuchou</span>
          <h2 class="text-4xl font-bold text-slate-800 dark:text-white mb-4 font-display">
            Tại sao chọn <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Hakkusu?</span> 💕
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Marketplace kawaii với đầy đủ tính năng dễ thương và an toàn ~
          </p>
        </div>

        <!-- Kawaii Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-6 border-2 border-transparent hover:border-pink-200 dark:hover:border-pink-500/30 shadow-lg hover:shadow-xl hover:shadow-pink-200/50 dark:hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-2"
          >
            <div class="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" :class="feature.bgClass">
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

    <!-- Kawaii CTA Section -->
    <section class="py-24 relative overflow-hidden">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-r from-pink-400/90 via-purple-400/90 to-blue-400/90" />
      
      <!-- Decorative Elements -->
      <div class="absolute top-10 left-10 text-6xl opacity-30 animate-bounce" style="animation-duration: 3s;">🌸</div>
      <div class="absolute bottom-10 right-10 text-6xl opacity-30 animate-bounce" style="animation-duration: 4s;">✨</div>
      <div class="absolute top-1/2 left-20 text-4xl opacity-20 animate-pulse">💕</div>
      <div class="absolute top-20 right-1/4 text-4xl opacity-20 animate-pulse" style="animation-delay: 1s;">⭐</div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
          始めましょう ~ Hajimemashou
        </span>
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
          Sẵn sàng khám phá? 🌸
        </h2>
        <p class="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
          Tham gia cộng đồng kawaii của chúng tôi ngay hôm nay! Tìm kiếm sản phẩm dễ thương từ các seller đáng tin cậy ~
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link
            to="/services"
            class="group inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-500 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Khám phá ngay~
            <SparklesIcon class="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </router-link>
          <router-link
            to="/auth/register"
            class="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300"
          >
            Đăng ký miễn phí ✨
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import {
  HeartIcon,
  ShieldCheckIcon,
  BoltIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShoppingBagIcon,
  UsersIcon,
  StarIcon,
  GiftIcon
} from '@heroicons/vue/24/solid';
import AnnouncementBanner from '@/components/home/AnnouncementBanner.vue';

const { t } = useI18n();

const features = [
  {
    icon: ShoppingBagIcon,
    title: 'Mua bán dễ dàng 🛍️',
    description: 'Tìm kiếm và mua sản phẩm từ nhiều seller khác nhau chỉ với vài click ~',
    bgClass: 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-500/20 dark:to-pink-600/20',
    iconClass: 'text-pink-500'
  },
  {
    icon: ShieldCheckIcon,
    title: 'An toàn tuyệt đối 🛡️',
    description: 'Bảo vệ người mua, đảm bảo nhận đúng sản phẩm trước khi thanh toán ✨',
    bgClass: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-500/20 dark:to-purple-600/20',
    iconClass: 'text-purple-500'
  },
  {
    icon: BoltIcon,
    title: 'Giao hàng tức thì ⚡',
    description: 'Nhận sản phẩm ngay lập tức sau khi thanh toán thành công ~',
    bgClass: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-500/20 dark:to-blue-600/20',
    iconClass: 'text-blue-500'
  },
  {
    icon: GiftIcon,
    title: 'Trở thành Seller 🎁',
    description: 'Đăng ký làm seller để bán sản phẩm và kiếm thu nhập kawaii 💕',
    bgClass: 'bg-gradient-to-br from-mint-100 to-mint-200 dark:from-emerald-500/20 dark:to-emerald-600/20',
    iconClass: 'text-emerald-500'
  }
];
</script>
