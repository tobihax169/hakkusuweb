<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 dark:from-white dark:via-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
          {{ $t('wallet.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Quản lý số dư và nạp tiền</p>
      </div>

      <!-- Balance Cards - Luxury Design -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-500/30">
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          <div class="relative flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-2xl">💎</span>
                <p class="text-blue-100 text-sm font-medium">{{ $t('wallet.gem') }}</p>
              </div>
              <p class="text-4xl font-bold">{{ formatNumber(wallet.gem) }}</p>
              <p class="text-blue-200 text-xs mt-1">1 Gem = 1,000 VND</p>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <GemIcon class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-6 text-white shadow-xl shadow-amber-500/30">
          <div class="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          <div class="relative flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-2xl">🪙</span>
                <p class="text-amber-100 text-sm font-medium">{{ $t('wallet.coin') }}</p>
              </div>
              <p class="text-4xl font-bold">{{ formatNumber(wallet.coin) }}</p>
              <p class="text-amber-200 text-xs mt-1">Nhận từ hoạt động</p>
            </div>
            <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <CoinIcon class="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Top Up Section - Glassmorphism -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <BanknotesIcon class="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('wallet.topup') }}</h2>
            <p class="text-sm text-gray-500">Nạp tiền qua SePay - Tự động cộng Gem</p>
          </div>
        </div>

        <!-- Quick Amounts -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <button
            v-for="amount in quickAmounts"
            :key="amount"
            @click="topupAmount = amount"
            :class="[
              'group relative p-4 rounded-xl border-2 text-center transition-all duration-300 overflow-hidden',
              topupAmount === amount
                ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 shadow-lg shadow-primary-500/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:shadow-md'
            ]"
          >
            <div class="relative z-10">
              <p class="font-bold text-gray-900 dark:text-white text-lg">{{ formatNumber(amount) }} ₫</p>
              <p class="text-sm font-medium" :class="topupAmount === amount ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'">
                +{{ amount / 1000 }} 💎
              </p>
            </div>
            <div v-if="topupAmount === amount" class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10"></div>
          </button>
        </div>

        <!-- Custom Amount -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Số tiền tùy chỉnh</label>
          <div class="flex items-center gap-4">
            <div class="relative flex-1">
              <input
                v-model.number="topupAmount"
                type="number"
                class="form-input w-full pl-4 pr-12 py-3 text-lg"
                placeholder="Nhập số tiền (tối thiểu 10,000)"
                min="10000"
                step="10000"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">₫</span>
            </div>
            <button
              @click="createTopup"
              :disabled="!topupAmount || topupAmount < 10000 || processing"
              class="btn-primary px-8 py-3 text-lg font-semibold shadow-lg shadow-primary-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LoadingSpinner v-if="processing" size="sm" color="white" class="mr-2" />
              <span v-else class="flex items-center gap-2">
                <QrCodeIcon class="w-5 h-5" />
                Nạp tiền
              </span>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">Tối thiểu: 10,000 ₫ | Tối đa: 100,000,000 ₫ | 1,000 ₫ = 1 💎</p>
        </div>

        <!-- Payment Info -->
        <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <div class="flex items-start gap-3">
            <InformationCircleIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Thanh toán qua SePay</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Hệ thống sẽ tạo mã QR VietQR. Sau khi chuyển khoản, tiền sẽ tự động cộng vào tài khoản trong vòng 1-5 phút.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="card">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('wallet.history') }}
          </h2>
        </div>

        <div v-if="loading" class="p-8 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>

        <div v-else-if="transactions.length === 0" class="p-8 text-center text-gray-500">
          {{ $t('wallet.noTransactions') }}
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="tx in transactions"
            :key="tx._id"
            class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div class="flex items-center gap-3">
              <div :class="getTransactionIconClass(tx.type)">
                <component :is="getTransactionIcon(tx.type)" class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ tx.description }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(tx.createdAt) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p :class="getAmountClass(tx.type)">
                {{ getAmountPrefix(tx.type) }}{{ formatNumber(tx.amount) }} {{ tx.currency }}
              </p>
              <span :class="getStatusBadgeClass(tx.status)">
                {{ tx.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { userApi, paymentApi } from '@/services/api.js';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ShoppingBagIcon,
  GiftIcon,
  ClockIcon,
  BanknotesIcon,
  QrCodeIcon,
  InformationCircleIcon,
  CurrencyDollarIcon as GemIcon,
  CircleStackIcon as CoinIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const toast = useToast();

const wallet = reactive({
  gem: 0,
  coin: 0
});

const loading = ref(true);
const processing = ref(false);
const transactions = ref([]);
const topupAmount = ref(50000);

const quickAmounts = [50000, 100000, 200000, 500000];

const formatNumber = (num) => {
  return num?.toLocaleString('vi-VN') || '0';
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('vi-VN');
};

const getTransactionIcon = (type) => {
  const icons = {
    topup: ArrowDownIcon,
    payment: ShoppingBagIcon,
    refund: GiftIcon,
    bonus: GiftIcon,
    withdraw: ArrowUpIcon
  };
  return icons[type] || ClockIcon;
};

const getTransactionIconClass = (type) => {
  const classes = {
    topup: 'w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600',
    payment: 'w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600',
    refund: 'w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600',
    bonus: 'w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600'
  };
  return classes[type] || 'w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center';
};

const getAmountClass = (type) => {
  const isNegative = ['payment', 'withdraw'].includes(type);
  return `font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`;
};

const getAmountPrefix = (type) => {
  return ['payment', 'withdraw'].includes(type) ? '-' : '+';
};

const getStatusBadgeClass = (status) => {
  const classes = {
    success: 'badge-success',
    pending: 'badge-warning',
    failed: 'badge-danger'
  };
  return `badge ${classes[status] || 'badge-info'}`;
};

const fetchWallet = async () => {
  try {
    const response = await userApi.getWallet();
    if (response.success) {
      wallet.gem = response.data.balance.gem;
      wallet.coin = response.data.balance.coin;
    }
  } catch (error) {
    toast.error('Không thể tải thông tin ví');
  }
};

const fetchTransactions = async () => {
  try {
    const response = await paymentApi.getTransactionHistory({ limit: 20 });
    if (response.success) {
      transactions.value = response.data;
    }
  } catch (error) {
    // Silent fail - error handled by API interceptor
  } finally {
    loading.value = false;
  }
};

const createTopup = async () => {
  if (!topupAmount.value || topupAmount.value < 10000) {
    toast.error('Số tiền tối thiểu là 10,000 ₫');
    return;
  }

  processing.value = true;
  try {
    const response = await paymentApi.createTopup({
      amount: topupAmount.value,
      currency: 'vnd',
      paymentMethod: 'qr_code'
    });

    if (response.success) {
      toast.success('Đã tạo yêu cầu nạp tiền!');
      // Show QR or redirect to payment page
      fetchTransactions();
    }
  } catch (error) {
    toast.error(error.message || 'Không thể tạo yêu cầu nạp tiền');
  } finally {
    processing.value = false;
  }
};

onMounted(() => {
  fetchWallet();
  fetchTransactions();
});
</script>
