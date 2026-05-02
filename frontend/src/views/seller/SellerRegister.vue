<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-50 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
    </div>

    <div class="relative py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            <BuildingStorefrontIcon class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 dark:from-white dark:via-blue-400 dark:to-indigo-400 mb-4">
            Trở Thành Seller
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Mở shop trên Hakkusu Store và bắt đầu kiếm thu nhập từ sản phẩm của bạn
          </p>
        </div>

        <div class="grid lg:grid-cols-5 gap-8">
          <!-- Left: Form -->
          <div class="lg:col-span-3">
            <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 overflow-hidden">
              <!-- Form Header -->
              <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 class="text-white font-semibold flex items-center gap-2">
                  <DocumentTextIcon class="w-5 h-5" />
                  Thông Tin Đăng Ký
                </h2>
              </div>

              <!-- Form Body -->
              <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
                <!-- Business Name -->
                <div class="group">
                  <label class="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-2">
                    <span class="flex items-center gap-2">
                      <BuildingStorefrontIcon class="w-4 h-4 text-blue-500" />
                      Tên Shop / Doanh nghiệp *
                    </span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="form.businessName"
                      type="text"
                      required
                      placeholder="VD: ABC Store"
                      class="w-full pl-4 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50 text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-0 outline-none transition-all duration-200"
                    >
                  </div>
                </div>

                <!-- Email & Phone Row -->
                <div class="grid sm:grid-cols-2 gap-4">
                  <!-- Business Email -->
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-2">
                      <span class="flex items-center gap-2">
                        <EnvelopeIcon class="w-4 h-4 text-blue-500" />
                        Email liên hệ *
                      </span>
                    </label>
                    <input
                      v-model="form.businessEmail"
                      type="email"
                      required
                      placeholder="shop@example.com"
                      class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50 text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-0 outline-none transition-all"
                    >
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-2">
                      <span class="flex items-center gap-2">
                        <PhoneIcon class="w-4 h-4 text-blue-500" />
                        Số điện thoại
                      </span>
                    </label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      placeholder="0901234567"
                      class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50 text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-0 outline-none transition-all"
                    >
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-2">
                    <span class="flex items-center gap-2">
                      <PencilSquareIcon class="w-4 h-4 text-blue-500" />
                      Mô tả về shop
                    </span>
                  </label>
                  <textarea
                    v-model="form.description"
                    rows="4"
                    placeholder="Giới thiệu về sản phẩm/dịch vụ bạn sẽ cung cấp..."
                    class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700/50 text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-0 outline-none transition-all resize-none"
                  />
                </div>

                <!-- Terms Card -->
                <div class="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 mt-0.5">
                      <input
                        id="terms"
                        v-model="form.acceptTerms"
                        type="checkbox"
                        required
                        class="w-5 h-5 text-blue-600 rounded border-amber-300 focus:ring-blue-500 cursor-pointer"
                      >
                    </div>
                    <label for="terms" class="text-sm text-slate-700 dark:text-gray-300 cursor-pointer">
                      Tôi đồng ý với
                      <a href="#" class="font-semibold text-blue-600 hover:text-primary-700 hover:underline">điều khoản seller</a>
                      và cam kết tuân thủ quy định. Platform thu
                      <span class="font-bold text-orange-600">30%</span>
                      phí, bạn nhận
                      <span class="font-bold text-green-600">70%</span>
                      doanh thu.
                    </label>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  :disabled="loading || !form.acceptTerms"
                  class="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-4 font-bold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl hover:shadow-primary-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span class="relative z-10 flex items-center justify-center gap-2">
                    <span v-if="loading" class="flex items-center gap-2">
                      <LoadingSpinner class="w-5 h-5" />
                      Đang xử lý...
                    </span>
                    <span v-else class="flex items-center gap-2">
                      <RocketLaunchIcon class="w-5 h-5" />
                      Bắt Đầu Bán Hàng
                    </span>
                  </span>
                </button>
              </form>
            </div>
          </div>

          <!-- Right: Benefits -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Benefits Card -->
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-100 dark:border-gray-700 p-6">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <SparklesIcon class="w-5 h-5 text-yellow-500" />
                Lợi Ích Khi Là Seller
              </h3>

              <div class="space-y-4">
                <!-- Benefit 1 -->
                <div class="flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CurrencyDollarIcon class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white">Nhận 70%</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Doanh thu từ mỗi đơn hàng thuộc về bạn</p>
                  </div>
                </div>

                <!-- Benefit 2 -->
                <div class="flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <UsersIcon class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white">Tiếp Cận Khách Hàng</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Hàng ngàn khách hàng tiềm năng trên nền tảng</p>
                  </div>
                </div>

                <!-- Benefit 3 -->
                <div class="flex items-start gap-4 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-indigo-100 dark:border-purple-800">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <ShieldCheckIcon class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-white">Bảo Vệ Giao Dịch</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400">Thanh toán an toàn, rút tiền đúng hạn</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats Card -->
            <div class="bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <div class="flex items-center gap-3 mb-4">
                <ChartBarIcon class="w-6 h-6" />
                <h3 class="font-bold">Số Liệu Nổi Bật</h3>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-white/10 rounded-xl">
                  <p class="text-2xl font-bold">30%</p>
                  <p class="text-xs text-white/80">Phí Platform</p>
                </div>
                <div class="text-center p-3 bg-white/10 rounded-xl">
                  <p class="text-2xl font-bold">70%</p>
                  <p class="text-xs text-white/80">Thu Nhập Của Bạn</p>
                </div>
                <div class="text-center p-3 bg-white/10 rounded-xl">
                  <p class="text-2xl font-bold">24h</p>
                  <p class="text-xs text-white/80">Duyệt Nhanh</p>
                </div>
                <div class="text-center p-3 bg-white/10 rounded-xl">
                  <p class="text-2xl font-bold">∞</p>
                  <p class="text-xs text-white/80">Sản Phẩm</p>
                </div>
              </div>
            </div>

            <!-- Help Card -->
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-100 dark:border-gray-700 p-6">
              <div class="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <QuestionMarkCircleIcon class="w-8 h-8 text-blue-500 flex-shrink-0" />
                <p class="text-sm">
                  Cần hỗ trợ? Liên hệ
                  <a href="#" class="text-blue-600 hover:underline font-medium">đội ngũ hỗ trợ</a>
                  của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { sellerApi } from '@/services/sellerApi.js';
import {
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const form = ref({
  businessName: '',
  businessEmail: '',
  phone: '',
  description: '',
  acceptTerms: false
});

const handleSubmit = async () => {
  if (!form.value.acceptTerms) {
    toast.error('Vui lòng đồng ý với điều khoản');
    return;
  }

  loading.value = true;
  try {
    const response = await sellerApi.registerSeller({
      businessName: form.value.businessName,
      businessEmail: form.value.businessEmail,
      phone: form.value.phone,
      description: form.value.description
    });

    toast.success(response.data.message || 'Đăng ký thành công! Vui lòng chờ admin phê duyệt.');
    router.push('/seller/dashboard');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Đăng ký thất bại');
  } finally {
    loading.value = false;
  }
};
</script>
