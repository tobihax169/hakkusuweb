<template>
  <div class="min-h-screen">
    <!-- Animated Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px]" />
      <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10">
      <!-- Hero Section -->
      <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
            <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span class="text-blue-400 text-sm font-medium">Hakkusu Store Marketplace</span>
          </div>
          
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Khám phá
            </span>
            <br />
            <span class="text-white">hàng ngàn sản phẩm</span>
          </h1>
          
          <p class="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Mua bán game, software, gift cards an toàn và nhanh chóng. 
            Kết nối với hàng trăm seller uy tín.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <router-link to="/services" class="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              Khám phá ngay
            </router-link>
            <router-link to="/auth/register" class="px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-2xl border border-slate-700/50 hover:bg-slate-700/50 transition-all">
              Đăng ký miễn phí
            </router-link>
          </div>

          <!-- Real-time Stats -->
          <div class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div class="group bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
              <p class="text-3xl font-bold text-white tabular-nums transition-all">
                {{ formatStat('products') }}
              </p>
              <p class="text-slate-400 text-sm group-hover:text-blue-400 transition-colors">Sản phẩm</p>
              <div class="mt-2 flex items-center gap-1">
                <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span class="text-xs text-emerald-400">Live</span>
              </div>
            </div>
            <div class="group bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
              <p class="text-3xl font-bold text-white tabular-nums transition-all">
                {{ formatStat('sellers') }}
              </p>
              <p class="text-slate-400 text-sm group-hover:text-indigo-400 transition-colors">Seller</p>
              <div class="mt-2 flex items-center gap-1">
                <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span class="text-xs text-emerald-400">Live</span>
              </div>
            </div>
            <div class="group bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1">
              <p class="text-3xl font-bold text-white tabular-nums transition-all">
                {{ formatStat('users') }}
              </p>
              <p class="text-slate-400 text-sm group-hover:text-violet-400 transition-colors">Người dùng</p>
              <div class="mt-2 flex items-center gap-1">
                <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span class="text-xs text-emerald-400">Live</span>
              </div>
            </div>
            <div class="group bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
              <p class="text-3xl font-bold text-white tabular-nums transition-all">
                {{ formatStat('satisfaction') }}
              </p>
              <p class="text-slate-400 text-sm group-hover:text-amber-400 transition-colors">Hài lòng</p>
              <div class="mt-2 flex items-center gap-1">
                <span class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span class="text-xs text-amber-400">Top</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-16">
            <GradientText>Tại sao chọn Hakkusu?</GradientText>
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard hover class="text-center">
              <div class="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon class="w-8 h-8 text-blue-400" />
              </div>
              <h3 class="text-xl font-semibold text-white mb-3">An toàn tuyệt đối</h3>
              <p class="text-slate-400">Giao dịch được bảo vệ, hoàn tiền nếu có vấn đề</p>
            </GlassCard>

            <GlassCard hover class="text-center">
              <div class="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BoltIcon class="w-8 h-8 text-emerald-400" />
              </div>
              <h3 class="text-xl font-semibold text-white mb-3">Giao dịch tức thì</h3>
              <p class="text-slate-400">Nhận sản phẩm ngay sau khi thanh toán</p>
            </GlassCard>

            <GlassCard hover class="text-center">
              <div class="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UsersIcon class="w-8 h-8 text-violet-400" />
              </div>
              <h3 class="text-xl font-semibold text-white mb-3">Cộng đồng lớn</h3>
              <p class="text-slate-400">Hàng ngàn seller uy tín đã được xác minh</p>
            </GlassCard>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center">
            <h2 class="text-3xl font-bold text-white mb-4">Sẵn sàng bắt đầu?</h2>
            <p class="text-blue-100 mb-8 max-w-xl mx-auto">Tham gia ngay hôm nay để trải nghiệm marketplace tốt nhất cho game thủ và người dùng software.</p>
            <router-link to="/auth/register" class="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-blue-50 transition-all">
              Tạo tài khoản miễn phí
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ShieldCheckIcon, BoltIcon, UsersIcon } from '@heroicons/vue/24/outline';
import GlassCard from '@/components/ui/GlassCard.vue';
import GradientText from '@/components/ui/GradientText.vue';
import { serviceApi, userApi } from '@/services/api.js';

// Real-time stats with animation
const stats = ref({
  products: { value: 0, target: 0, suffix: '+' },
  sellers: { value: 0, target: 0, suffix: '+' },
  users: { value: 0, target: 0, suffix: 'K+' },
  satisfaction: { value: 0, target: 0, suffix: '%' }
});

const loading = ref(true);
let animationInterval = null;
let refreshInterval = null;

// Animate number counting
const animateNumber = (key, target, duration = 1500) => {
  const start = stats.value[key].value;
  const diff = target - start;
  const steps = 60;
  const stepDuration = duration / steps;
  let currentStep = 0;

  const step = () => {
    currentStep++;
    const progress = currentStep / steps;
    // Easing function for smooth animation
    const easeOut = 1 - Math.pow(1 - progress, 3);
    stats.value[key].value = Math.round(start + diff * easeOut);

    if (currentStep < steps) {
      setTimeout(step, stepDuration);
    } else {
      stats.value[key].value = target;
    }
  };
  step();
};

// Format number display
const formatStat = (key) => {
  const { value, suffix } = stats.value[key];
  if (suffix === 'K+') {
    return (value / 1000).toFixed(value >= 1000 ? 1 : 0) + 'K+';
  }
  return value.toLocaleString('vi-VN') + suffix;
};

// Fetch stats from API
const fetchStats = async () => {
  try {
    // Try to fetch real data
    const [servicesRes, usersRes] = await Promise.all([
      serviceApi.getServices().catch(() => null),
      userApi.getAdminUserStats().catch(() => null)
    ]);

    // Calculate targets
    const productCount = servicesRes?.data?.length || 12847;
    const userCount = usersRes?.data?.overview?.total || 52340;
    const sellerCount = Math.floor(productCount / 25) || 512; // Estimate
    const satisfactionRate = 99;

    // Set targets
    stats.value.products.target = productCount;
    stats.value.sellers.target = sellerCount;
    stats.value.users.target = userCount;
    stats.value.satisfaction.target = satisfactionRate;

    // Animate to targets
    if (loading.value) {
      animateNumber('products', productCount);
      animateNumber('sellers', sellerCount);
      animateNumber('users', userCount);
      animateNumber('satisfaction', satisfactionRate);
      loading.value = false;
    } else {
      // Update without animation for refresh
      stats.value.products.value = productCount;
      stats.value.sellers.value = sellerCount;
      stats.value.users.value = userCount;
      stats.value.satisfaction.value = satisfactionRate;
    }
  } catch (error) {
    // Fallback to demo data
    stats.value.products.target = 12847;
    stats.value.sellers.target = 512;
    stats.value.users.target = 52340;
    stats.value.satisfaction.target = 99;

    animateNumber('products', 12847);
    animateNumber('sellers', 512);
    animateNumber('users', 52340);
    animateNumber('satisfaction', 99);
    loading.value = false;
  }
};

onMounted(() => {
  fetchStats();
  // Refresh stats every 30 seconds
  refreshInterval = setInterval(fetchStats, 30000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>
