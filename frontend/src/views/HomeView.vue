<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-primary-500/20" />
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {{ $t('home.hero.title') }}
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400 block mt-2">
              {{ $t('home.hero.subtitle') }}
            </span>
          </h1>
          
          <p class="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            {{ $t('home.hero.description') }}
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <router-link 
              to="/services" 
              class="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
            >
              {{ $t('home.hero.ctaPrimary') }}
            </router-link>
            <a 
              href="#features" 
              class="btn-outline text-lg px-8 py-4 w-full sm:w-auto text-white border-white/30 hover:bg-white/10"
            >
              {{ $t('home.hero.ctaSecondary') }}
            </a>
          </div>
        </div>
      </div>

      <!-- Decorative elements -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
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
  ArrowRightIcon
} from '@heroicons/vue/24/outline';
import AnnouncementBanner from '@/components/home/AnnouncementBanner.vue';

const { t } = useI18n();

const features = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: t('home.features.support'),
    description: 'Hỗ trợ 24/7 từ đội ngũ seller và admin'
  },
  {
    icon: PencilSquareIcon,
    title: t('home.features.custom'),
    description: 'Đa dạng sản phẩm từ nhiều seller khác nhau'
  },
  {
    icon: ShieldCheckIcon,
    title: t('home.features.secure'),
    description: 'Giao dịch an toàn, bảo vệ người mua'
  },
  {
    icon: BoltIcon,
    title: t('home.features.fast'),
    description: 'Giao hàng nhanh, nhận sản phẩm tức thì'
  }
];
</script>
