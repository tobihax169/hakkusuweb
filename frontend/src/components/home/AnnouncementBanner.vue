<template>
  <div v-if="announcements.length > 0" class="relative">
    <!-- Main Announcement -->
    <div
      v-for="(announcement, index) in visibleAnnouncements"
      :key="announcement.id"
      :class="[
        'relative overflow-hidden rounded-2xl mb-6 transition-all duration-500',
        getTypeClass(announcement.type),
        { 'hidden': currentIndex !== index }
      ]"
    >
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" :style="getPatternStyle(announcement.type)"></div>
      </div>
      
      <!-- Content -->
      <div class="relative px-6 py-5 flex items-start gap-4">
        <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" :class="getIconBgClass(announcement.type)">
          <component :is="getIcon(announcement.type)" class="w-6 h-6" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider" :class="getBadgeClass(announcement.type)">
              {{ getTypeLabel(announcement.type) }}
            </span>
            <span v-if="announcement.pinned" class="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
              <BookmarkIcon class="w-3 h-3" />
              Ghim
            </span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ announcement.title }}</h3>
          <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{{ announcement.content }}</p>
          <div class="flex items-center gap-4 mt-3">
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(announcement.createdAt) }}</span>
            <button 
              v-if="announcement.link"
              @click="navigateTo(announcement.link)"
              class="text-sm font-semibold flex items-center gap-1 hover:underline"
              :class="getLinkClass(announcement.type)"
            >
              Xem chi tiết
              <ArrowRightIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        <button 
          @click="dismiss(announcement.id)"
          class="flex-shrink-0 p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <XMarkIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Navigation Dots -->
    <div v-if="visibleAnnouncements.length > 1" class="flex items-center justify-center gap-2 mt-2">
      <button
        v-for="(_, index) in visibleAnnouncements"
        :key="index"
        @click="currentIndex = index"
        :class="[
          'w-2 h-2 rounded-full transition-all duration-300',
          currentIndex === index ? 'w-6 bg-primary-500' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  MegaphoneIcon,
  WrenchIcon,
  GiftIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  XMarkIcon,
  BookmarkIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const currentIndex = ref(0);
const dismissedIds = ref(new Set());
let autoRotateInterval = null;

// Mock data - replace with API call
const announcements = ref([
  {
    id: 1,
    title: 'Chương trình khuyến mãi 30% tất cả sản phẩm!',
    content: 'Giảm giá 30% cho tất cả sản phẩm từ ngày 1-7/5. Đừng bỏ lỡ cơ hội mua sắm với giá tốt nhất!',
    type: 'promotion',
    pinned: true,
    link: '/services',
    createdAt: new Date('2026-05-01')
  },
  {
    id: 2,
    title: 'Bảo trì hệ thống ngày 05/05/2026',
    content: 'Hệ thống sẽ bảo trì từ 02:00 đến 06:00 sáng để nâng cấp cơ sở dữ liệu. Mong quý khách thông cảm.',
    type: 'maintenance',
    pinned: false,
    createdAt: new Date('2026-05-02')
  },
  {
    id: 3,
    title: 'Tính năng mới: Trở thành người bán',
    content: 'Giờ đây bạn có thể đăng ký trở thành người bán và bán sản phẩm trên Hakkusu Shop!',
    type: 'update',
    link: '/seller/register',
    createdAt: new Date('2026-05-01')
  }
]);

const visibleAnnouncements = computed(() => {
  return announcements.value.filter(a => !dismissedIds.value.has(a.id));
});

const getIcon = (type) => {
  const icons = {
    promotion: GiftIcon,
    maintenance: WrenchIcon,
    update: InformationCircleIcon,
    general: MegaphoneIcon
  };
  return icons[type] || MegaphoneIcon;
};

const getTypeClass = (type) => {
  const classes = {
    promotion: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800',
    maintenance: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800',
    update: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800',
    general: 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800'
  };
  return classes[type] || classes.general;
};

const getIconBgClass = (type) => {
  const classes = {
    promotion: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    maintenance: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    update: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    general: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  };
  return classes[type] || classes.general;
};

const getBadgeClass = (type) => {
  const classes = {
    promotion: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    maintenance: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    update: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    general: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
  };
  return classes[type] || classes.general;
};

const getLinkClass = (type) => {
  const classes = {
    promotion: 'text-amber-600 dark:text-amber-400',
    maintenance: 'text-red-600 dark:text-red-400',
    update: 'text-blue-600 dark:text-blue-400',
    general: 'text-purple-600 dark:text-purple-400'
  };
  return classes[type] || classes.general;
};

const getTypeLabel = (type) => {
  const labels = {
    promotion: 'Khuyến mãi',
    maintenance: 'Bảo trì',
    update: 'Cập nhật',
    general: 'Thông báo'
  };
  return labels[type] || 'Thông báo';
};

const getPatternStyle = (type) => {
  const patterns = {
    promotion: 'background-image: radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.15) 1px, transparent 0); background-size: 20px 20px;',
    maintenance: 'background-image: radial-gradient(circle at 2px 2px, rgba(239, 68, 68, 0.15) 1px, transparent 0); background-size: 20px 20px;',
    update: 'background-image: radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.15) 1px, transparent 0); background-size: 20px 20px;',
    general: 'background-image: radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 0); background-size: 20px 20px;'
  };
  return patterns[type] || patterns.general;
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(date));
};

const navigateTo = (link) => {
  router.push(link);
};

const dismiss = (id) => {
  dismissedIds.value.add(id);
  // Save to localStorage
  localStorage.setItem('dismissedAnnouncements', JSON.stringify([...dismissedIds.value]));
};

// Auto rotate
onMounted(() => {
  // Load dismissed from localStorage
  const saved = localStorage.getItem('dismissedAnnouncements');
  if (saved) {
    dismissedIds.value = new Set(JSON.parse(saved));
  }
  
  autoRotateInterval = setInterval(() => {
    if (visibleAnnouncements.value.length > 1) {
      currentIndex.value = (currentIndex.value + 1) % visibleAnnouncements.value.length;
    }
  }, 5000);
});

onUnmounted(() => {
  if (autoRotateInterval) clearInterval(autoRotateInterval);
});
</script>
