<template>
  <div class="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Đăng Ký Trở Thành Seller
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Bắt đầu bán sản phẩm và kiếm thu nhập trên Hakkusu Shop
        </p>
      </div>

      <!-- Form -->
      <div class="card">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Business Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên Shop / Doanh nghiệp *
            </label>
            <input
              v-model="form.businessName"
              type="text"
              required
              placeholder="VD: ABC Store"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
          </div>

          <!-- Business Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email liên hệ *
            </label>
            <input
              v-model="form.businessEmail"
              type="email"
              required
              placeholder="shop@example.com"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số điện thoại
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="0901234567"
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả về shop
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Giới thiệu về sản phẩm/dịch vụ bạn sẽ cung cấp..."
              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-3">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="mt-1 w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            >
            <label for="terms" class="text-sm text-gray-600 dark:text-gray-400">
              Tôi đồng ý với
              <a href="#" class="text-primary-600 hover:underline">điều khoản seller</a>
              và cam kết tuân thủ quy định của Hakkusu Shop. Tôi hiểu rằng platform sẽ thu 30% phí trên mỗi đơn hàng.
            </label>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || !form.acceptTerms"
            class="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <LoadingSpinner class="w-5 h-5" />
              Đang xử lý...
            </span>
            <span v-else>Đăng Ký Ngay</span>
          </button>
        </form>
      </div>

      <!-- Benefits -->
      <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <CurrencyDollarIcon class="w-6 h-6 text-primary-600" />
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Nhận 70%</h3>
          <p class="text-sm text-gray-500">Doanh thu từ mỗi đơn hàng</p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <UsersIcon class="w-6 h-6 text-primary-600" />
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Tiếp cận</h3>
          <p class="text-sm text-gray-500">Hàng ngàn khách hàng tiềm năng</p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <ShieldCheckIcon class="w-6 h-6 text-primary-600" />
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Bảo vệ</h3>
          <p class="text-sm text-gray-500">Giao dịch an toàn, thanh toán đúng hạn</p>
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
import { CurrencyDollarIcon, UsersIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline';
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
