<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-8">
        Ví của tôi
      </h1>

      <!-- Balance Card -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 mb-8 shadow-xl shadow-blue-500/20">
        <p class="text-blue-100 text-sm mb-2">Số dư khả dụng</p>
        <p class="text-4xl font-bold text-white mb-2">{{ formatGem(balance.gem) }} GEM</p>
        <p class="text-blue-100 text-sm mb-6">{{ formatCoin(balance.coin) }} COIN</p>
        <div class="flex gap-4">
          <button 
            @click="showDeposit = true"
            class="flex-1 py-3 bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/30 transition-colors"
          >
            <PlusIcon class="w-5 h-5 inline mr-2" />
            Nạp tiền
          </button>
          <button 
            @click="showWithdraw = true"
            class="flex-1 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
          >
            <ArrowUpIcon class="w-5 h-5 inline mr-2" />
            Rút tiền
          </button>
        </div>
      </div>

      <!-- Transactions -->
      <GlassCard>
        <div class="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white">Lịch sử giao dịch</h2>
          <select v-model="filter" class="px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white outline-none">
            <option value="">Tất cả</option>
            <option value="topup">Nạp tiền</option>
            <option value="withdraw">Rút tiền</option>
            <option value="payment">Thanh toán</option>
            <option value="refund">Hoàn tiền</option>
          </select>
        </div>
        
        <div v-if="loading" class="p-8 flex justify-center">
          <div class="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
        
        <div v-else-if="filteredTransactions.length === 0" class="p-8 text-center">
          <p class="text-slate-400">Chưa có giao dịch nào</p>
        </div>
        
        <div v-else class="divide-y divide-slate-700/50">
          <div 
            v-for="tx in filteredTransactions" 
            :key="tx._id" 
            class="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div :class="getTxIconClass(tx.type)" class="w-10 h-10 rounded-xl flex items-center justify-center">
                <component :is="getTxIcon(tx.type)" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-white font-medium">{{ tx.description || getTxLabel(tx.type) }}</p>
                <p class="text-slate-500 text-sm">{{ formatDate(tx.createdAt) }}</p>
              </div>
            </div>
            <span :class="getTxAmountClass(tx.type)" class="font-semibold">
              {{ getTxSign(tx.type) }}{{ formatTxAmount(tx) }}
            </span>
          </div>
        </div>
      </GlassCard>
    </div>

    <!-- Deposit Modal -->
    <div v-if="showDeposit" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showDeposit = false">
      <GlassCard class="w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Nạp tiền</h3>
        <div class="space-y-4">
          <div>
            <label class="text-sm text-slate-400">Số tiền (VNĐ)</label>
            <input 
              v-model.number="depositAmount" 
              type="number" 
              min="10000" 
              step="10000"
              class="w-full mt-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              placeholder="Tối thiểu 10,000₫"
            >
          </div>
          <div v-if="sepayPayment" class="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-center space-y-3">
            <p class="text-slate-300 text-sm">Quét QR để nạp tiền</p>
            <img :src="sepayPayment.qrCodeUrl" alt="QR nạp tiền" class="w-52 h-52 mx-auto rounded-lg bg-white p-2">
            <p class="text-xs text-slate-400">{{ sepayPayment.bankInfo?.bankName }} - {{ sepayPayment.bankInfo?.accountNumber }}</p>
            <p class="text-xs text-slate-400">Nội dung: {{ sepayPayment.bankInfo?.transferContent }}</p>
            <p class="text-emerald-400 text-sm">{{ sepayStatusText }}</p>
          </div>
          <div class="flex gap-3">
            <button 
              @click="showDeposit = false" 
              class="flex-1 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            >
              Hủy
            </button>
            <button 
              @click="processDeposit" 
              :disabled="processing"
              class="flex-1 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {{ processing ? 'Đang xử lý...' : 'Nạp tiền' }}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>

    <!-- Withdraw Modal -->
    <div v-if="showWithdraw" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showWithdraw = false">
      <GlassCard class="w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Rút tiền</h3>
        <div class="space-y-4">
          <div>
            <label class="text-sm text-slate-400">Số tiền (VNĐ)</label>
            <input 
              v-model.number="withdrawAmount" 
              type="number" 
              min="50000" 
              step="10000"
              class="w-full mt-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              placeholder="Tối thiểu 50,000₫"
            >
          </div>
          <div>
            <label class="text-sm text-slate-400">Thông tin rút tiền</label>
            <textarea 
              v-model="withdrawInfo" 
              rows="2"
              class="w-full mt-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500"
              placeholder="Số tài khoản ngân hàng..."
            />
          </div>
          <div class="flex gap-3">
            <button 
              @click="showWithdraw = false" 
              class="flex-1 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            >
              Hủy
            </button>
            <button 
              @click="processWithdraw" 
              :disabled="processing"
              class="flex-1 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {{ processing ? 'Đang xử lý...' : 'Rút tiền' }}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import { userApi, paymentApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import {
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingBagIcon,
  WalletIcon
} from '@heroicons/vue/24/solid';

const toast = useToast();

const loading = ref(true);
const balance = ref({ gem: 0, coin: 0, totalInGem: 0 });
const transactions = ref([]);
const filter = ref('');
const showDeposit = ref(false);
const showWithdraw = ref(false);
const depositAmount = ref('');
const withdrawAmount = ref('');
const withdrawInfo = ref('');
const processing = ref(false);
const sepayPayment = ref(null);
const currentTopupCode = ref('');
const sepayStatusText = ref('');
let pollTimer = null;

const filteredTransactions = computed(() => {
  if (!filter.value) return transactions.value;
  return transactions.value.filter(tx => tx.type === filter.value);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);
};
const formatGem = (value) => new Intl.NumberFormat('vi-VN').format(value || 0);
const formatCoin = (value) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value || 0);
const formatTxAmount = (tx) => {
  if (tx.currency === 'vnd') return formatPrice(tx.amount);
  return `${new Intl.NumberFormat('vi-VN').format(tx.amount || 0)} ${String(tx.currency || '').toUpperCase()}`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getTxIcon = (type) => ({
  topup: ArrowDownIcon,
  withdraw: ArrowUpIcon,
  refund: PlusIcon,
  payment: ShoppingBagIcon,
  bonus: WalletIcon
}[type] || WalletIcon);

const getTxIconClass = (type) => ({
  topup: 'bg-emerald-500/20 text-emerald-400',
  withdraw: 'bg-red-500/20 text-red-400',
  refund: 'bg-blue-500/20 text-blue-400',
  payment: 'bg-violet-500/20 text-violet-400',
  bonus: 'bg-amber-500/20 text-amber-400'
}[type] || 'bg-slate-500/20 text-slate-400');

const getTxAmountClass = (type) => ({
  topup: 'text-emerald-400',
  withdraw: 'text-red-400',
  refund: 'text-blue-400',
  payment: 'text-violet-400',
  bonus: 'text-amber-400'
}[type] || 'text-slate-400');

const getTxLabel = (type) => ({
  topup: 'Nạp tiền',
  withdraw: 'Rút tiền',
  refund: 'Hoàn tiền',
  payment: 'Thanh toán',
  bonus: 'Thưởng/hoa hồng'
}[type] || type);

const getTxSign = (type) => ({
  payment: '-',
  withdraw: '-',
  transfer: '-'
}[type] || '+');

const fetchWallet = async () => {
  try {
    const [walletRes, txRes] = await Promise.all([
      userApi.getWallet(),
      paymentApi.getTransactionHistory({ limit: 100 })
    ]);
    if (walletRes.success) balance.value = walletRes.data.balance || { gem: 0, coin: 0, totalInGem: 0 };
    if (txRes.success) transactions.value = txRes.data || [];
  } catch (error) {
    toast.error('Không thể tải thông tin ví');
  } finally {
    loading.value = false;
  }
};

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

const startPollingTopupStatus = () => {
  stopPolling();
  pollTimer = setInterval(async () => {
    if (!currentTopupCode.value) return;
    try {
      const statusRes = await paymentApi.getSePayStatus(currentTopupCode.value);
      const st = statusRes?.data?.status;
      if (st === 'success') {
        sepayStatusText.value = 'Nạp tiền thành công!';
        stopPolling();
        toast.success('Nạp tiền thành công');
        await fetchWallet();
      } else if (['failed', 'cancelled'].includes(st) || statusRes?.data?.isExpired) {
        sepayStatusText.value = 'Giao dịch thất bại hoặc hết hạn';
        stopPolling();
      } else {
        sepayStatusText.value = 'Đang chờ thanh toán...';
      }
    } catch {
      // ignore transient polling errors
    }
  }, 5000);
};

const processDeposit = async () => {
  if (!depositAmount.value || depositAmount.value < 10000) {
    toast.error('Số tiền tối thiểu là 10,000₫');
    return;
  }
  processing.value = true;
  try {
    const response = await paymentApi.createSePayTopup({ amount: depositAmount.value });
    if (!response.success) {
      throw new Error(response.message || 'Không thể tạo yêu cầu nạp tiền');
    }
    currentTopupCode.value = response.data?.transaction?.transactionCode || '';
    sepayPayment.value = response.data?.payment || null;
    sepayStatusText.value = 'Đang chờ thanh toán...';
    startPollingTopupStatus();
  } catch (error) {
    toast.error(error.message || 'Không thể tạo yêu cầu nạp tiền');
  } finally {
    processing.value = false;
  }
};

const processWithdraw = async () => {
  if (!withdrawAmount.value || withdrawAmount.value < 50000) {
    toast.error('Số tiền tối thiểu là 50,000₫');
    return;
  }
  if (!withdrawInfo.value.trim()) {
    toast.error('Vui lòng nhập thông tin rút tiền');
    return;
  }
  toast.info('Rút tiền user chưa được bật trong phiên bản này');
};

onMounted(fetchWallet);
onUnmounted(stopPolling);
</script>
