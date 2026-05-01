<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {{ $t('wallet.title') }}
      </h1>

      <!-- Balance Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div class="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm mb-1">{{ $t('wallet.gem') }}</p>
              <p class="text-3xl font-bold">{{ formatNumber(wallet.gem) }}</p>
            </div>
            <div class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <span class="text-3xl">💎</span>
            </div>
          </div>
        </div>

        <div class="card p-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-amber-100 text-sm mb-1">{{ $t('wallet.coin') }}</p>
              <p class="text-3xl font-bold">{{ formatNumber(wallet.coin) }}</p>
            </div>
            <div class="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <span class="text-3xl">🪙</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Up Section -->
      <div class="card p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ $t('wallet.topup') }}
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <button
            v-for="amount in quickAmounts"
            :key="amount"
            @click="topupAmount = amount"
            :class="[
              'p-4 rounded-xl border-2 text-center transition-all',
              topupAmount === amount
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            ]"
          >
            <p class="font-bold text-gray-900 dark:text-white">{{ formatNumber(amount) }} ₫</p>
            <p class="text-sm text-gray-500">+{{ amount / 1000 }} 💎</p>
          </button>
        </div>

        <div class="flex items-center gap-4">
          <input
            v-model.number="topupAmount"
            type="number"
            class="form-input flex-1"
            placeholder="Nhập số tiền"
            min="10000"
            step="10000"
          />
          <button
            @click="createTopup"
            :disabled="!topupAmount || topupAmount < 10000 || processing"
            class="btn-primary"
          >
            <LoadingSpinner v-if="processing" size="sm" color="white" class="mr-2" />
            {{ processing ? 'Đang xử lý...' : 'Nạp tiền' }}
          </button>
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
  ClockIcon
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
    console.error('Failed to fetch transactions:', error);
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
