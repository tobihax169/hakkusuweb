<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section - Modern Design -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-purple-900" />
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%236366f1%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
      
      <!-- Floating Orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;" />
      <div class="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;" />
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary-300 text-sm mb-6 border border-white/10">
              <SparklesIcon class="w-4 h-4" />
              <span>Marketplace mua bán sản phẩm số</span>
            </div>
            
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {{ $t('home.hero.title') }}
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 block mt-2">
                {{ $t('home.hero.subtitle') }}
              </span>
            </h1>
            
            <p class="text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              {{ $t('home.hero.description') }}
            </p>
            
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <router-link 
                to="/services" 
                class="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 w-full sm:w-auto"
              >
                <span class="relative z-10 flex items-center justify-center gap-2">
                  {{ $t('home.hero.ctaPrimary') }}
                  <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </router-link>
              <a 
                href="#features" 
                class="px-8 py-4 text-white font-medium rounded-xl border-2 border-white/20 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto text-center"
              >
                {{ $t('home.hero.ctaSecondary') }}
              </a>
            </div>

            <!-- Stats -->
            <div class="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-white/10">
              <div class="text-center">
                <p class="text-3xl font-bold text-white">10K+</p>
                <p class="text-sm text-gray-400">Người dùng</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-white">500+</p>
                <p class="text-sm text-gray-400">Sản phẩm</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-white">50+</p>
                <p class="text-sm text-gray-400">Seller</p>
              </div>
            </div>
          </div>

          <!-- Hero Image/Visual -->
          <div class="hidden lg:block relative">
            <div class="relative w-full aspect-square max-w-lg mx-auto">
              <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-3xl transform rotate-3"></div>
              <div class="absolute inset-0 bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
                <div class="p-6">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div class="space-y-3">
                    <div class="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div class="h-20 bg-primary-500/20 rounded-lg mt-4 flex items-center justify-center">
                      <span class="text-primary-400 font-semibold">Bot Discord Premium</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3 mt-4">
                      <div class="h-16 bg-gray-700 rounded-lg"></div>
                      <div class="h-16 bg-gray-700 rounded-lg"></div>
                    </div>
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

    <!-- Features Section -->
    <section id="features" class="py-20 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          {{ $t('home.features.title') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="card card-hover p-6 text-center"
          >
            <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <component :is="feature.icon" class="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-600 dark:bg-primary-800">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          Sẵn sàng khám phá sản phẩm?
        </h2>
        <p class="text-primary-100 text-lg mb-8">
          Tìm kiếm và mua các sản phẩm, dịch vụ từ cộng đồng seller của chúng tôi.
        </p>
        <router-link
          to="/services"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Khám phá ngay
          <ArrowRightIcon class="w-5 h-5" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import {
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  BoltIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShoppingBagIcon,
  UsersIcon,
  GemIcon
} from '@heroicons/vue/24/outline';
import AnnouncementBanner from '@/components/home/AnnouncementBanner.vue';

const { t } = useI18n();

const features = [
  {
    icon: ShoppingBagIcon,
    title: 'Mua bán dễ dàng',
    description: 'Tìm kiếm và mua sản phẩm từ nhiều seller khác nhau chỉ với vài click'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Giao dịch an toàn',
    description: 'Hệ thống bảo vệ người mua, đảm bảo nhận đúng sản phẩm trước khi thanh toán'
  },
  {
    icon: BoltIcon,
    title: 'Giao hàng tự động',
    description: 'Nhận sản phẩm ngay lập tức sau khi thanh toán thành công'
  },
  {
    icon: UsersIcon,
    title: 'Trở thành Seller',
    description: 'Đăng ký làm seller để bán sản phẩm và kiếm thu nhập từ platform'
  }
];
</script>
