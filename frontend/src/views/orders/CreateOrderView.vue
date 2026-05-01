<template>
  <div class="py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <button 
          @click="$router.back()"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Đặt hàng mới
        </h1>
      </div>

      <!-- Step 1: Select Package -->
      <div v-if="step === 1" class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Chọn gói dịch vụ
        </h2>

        <div v-if="loading" class="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="pkg in services"
            :key="pkg.id"
            @click="selectPackage(pkg)"
            :class="[
              'p-4 rounded-xl border-2 cursor-pointer transition-all',
              selectedPackage?.id === pkg.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            ]"
          >
            <div class="flex items-center gap-3 mb-2">
              <component :is="getIcon(pkg.icon)" class="w-6 h-6 text-primary-600" />
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ pkg.name }}</h3>
            </div>
            <p class="text-lg font-bold text-primary-600">
              {{ pkg.price > 0 ? formatPrice(pkg.price) + ' ₫' : 'Liên hệ' }}
            </p>
            <p class="text-sm text-gray-500 mt-1">{{ pkg.features.length }} tính năng</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            :disabled="!selectedPackage"
            @click="step = 2"
            class="btn-primary"
          >
            Tiếp theo
            <ArrowRightIcon class="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      <!-- Step 2: Details -->
      <div v-else-if="step === 2" class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Chi tiết yêu cầu
        </h2>

        <form @submit.prevent="submitOrder" class="space-y-4">
          <!-- Discord Server -->
          <div>
            <label class="form-label">Discord Server ID (nếu có)</label>
            <input
              v-model="form.discordServerId"
              type="text"
              class="form-input"
              placeholder="1234567890"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="form-label">Mô tả yêu cầu</label>
            <textarea
              v-model="form.description"
              class="form-input"
              rows="4"
              placeholder="Mô tả chi tiết những tính năng bạn cần..."
            />
          </div>

          <!-- Payment Method -->
          <div>
            <label class="form-label">Phương thức thanh toán</label>
            <div class="grid grid-cols-2 gap-4">
              <button
                type="button"
                @click="form.paymentMethod = 'wallet'"
                :class="[
                  'p-4 rounded-xl border-2 text-left transition-all',
                  form.paymentMethod === 'wallet'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                ]"
              >
                <CurrencyDollarIcon class="w-6 h-6 text-primary-600 mb-2" />
                <p class="font-medium text-gray-900 dark:text-white">Ví (Gem)</p>
                <p class="text-sm text-gray-500">Số dư: {{ gemBalance }}</p>
              </button>

              <button
                type="button"
                @click="form.paymentMethod = 'qr_code'"
                :class="[
                  'p-4 rounded-xl border-2 text-left transition-all',
                  form.paymentMethod === 'qr_code'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                ]"
              >
                <QrCodeIcon class="w-6 h-6 text-primary-600 mb-2" />
                <p class="font-medium text-gray-900 dark:text-white">QR Code</p>
                <p class="text-sm text-gray-500">Chuyển khoản ngân hàng</p>
              </button>
            </div>
          </div>

          <!-- Summary -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">Gói dịch vụ:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ selectedPackage?.name }}</span>
            </div>
            <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span class="text-gray-900 dark:text-white font-semibold">Tổng thanh toán:</span>
              <span class="text-xl font-bold text-primary-600">
                {{ formatPrice(selectedPackage?.price) }} ₫
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <button
              type="button"
              @click="step = 1"
              class="btn-outline"
            >
              Quay lại
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="btn-primary"
            >
              <LoadingSpinner v-if="submitting" size="sm" color="white" class="mr-2" />
              {{ submitting ? 'Đang xử lý...' : 'Đặt hàng' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.js';
import { serviceApi, orderApi, userApi } from '@/services/api.js';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  CubeIcon,
  StarIcon,
  CrownIcon,
  PuzzlePieceIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const step = ref(1);
const loading = ref(true);
const submitting = ref(false);
const services = ref([]);
const selectedPackage = ref(null);
const gemBalance = ref(0);

const form = reactive({
  discordServerId: '',
  discordServerName: '',
  description: '',
  paymentMethod: 'wallet'
});

const iconMap = {
  CubeIcon,
  StarIcon,
  CrownIcon,
  PuzzlePieceIcon
};

const getIcon = (iconName) => iconMap[iconName] || CubeIcon;

const formatPrice = (price) => {
  return price?.toLocaleString('vi-VN') || '0';
};

const fetchServices = async () => {
  try {
    const response = await serviceApi.getServices();
    services.value = response.data;

    // Check if package is pre-selected from URL
    const preSelected = route.query.package;
    if (preSelected) {
      selectedPackage.value = services.value.find(s => s.id === preSelected);
      if (selectedPackage.value) {
        step.value = 2;
      }
    }
  } catch (error) {
    toast.error('Không thể tải dịch vụ');
  } finally {
    loading.value = false;
  }
};

const fetchWallet = async () => {
  try {
    const response = await userApi.getWallet();
    gemBalance.value = response.data?.balance?.gem || 0;
  } catch (error) {
    console.error('Failed to fetch wallet:', error);
  }
};

const selectPackage = (pkg) => {
  selectedPackage.value = pkg;
};

const submitOrder = async () => {
  if (!selectedPackage.value) return;

  submitting.value = true;
  try {
    const response = await orderApi.createOrder({
      packageId: selectedPackage.value.id,
      description: form.description,
      discordServerId: form.discordServerId,
      paymentMethod: form.paymentMethod
    });

    if (response.success) {
      toast.success('Đơn hàng đã được tạo!');
      
      if (form.paymentMethod === 'wallet') {
        // Auto-pay with wallet
        await autoPay(response.data._id);
      } else {
        router.push(`/orders/${response.data._id}`);
      }
    }
  } catch (error) {
    toast.error(error.message || 'Không thể tạo đơn hàng');
    submitting.value = false;
  }
};

const autoPay = async (orderId) => {
  try {
    const payResponse = await orderApi.payWithWallet(orderId, { currency: 'gem' });
    if (payResponse.success) {
      toast.success('Thanh toán thành công!');
      router.push('/orders');
    }
  } catch (error) {
    toast.error(error.message || 'Thanh toán thất bại');
    router.push(`/orders/${orderId}`);
  }
};

onMounted(() => {
  fetchServices();
  fetchWallet();
});
</script>
