<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Phê duyệt
        </h1>
        <p class="text-slate-400 mt-1">Duyệt seller và sản phẩm mới</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button 
          @click="activeTab = 'sellers'" 
          :class="activeTab === 'sellers' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-800/50 text-slate-400 border-slate-700/50'"
          class="px-6 py-2.5 rounded-xl border font-medium transition-all"
        >
          Seller ({{ pendingSellers.length }})
        </button>
        <button 
          @click="activeTab = 'products'" 
          :class="activeTab === 'products' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-800/50 text-slate-400 border-slate-700/50'"
          class="px-6 py-2.5 rounded-xl border font-medium transition-all"
        >
          Sản phẩm ({{ pendingProducts.length }})
        </button>
      </div>

      <!-- Pending Sellers -->
      <div v-if="activeTab === 'sellers'">
        <div v-if="pendingSellers.length === 0" class="text-center py-12">
          <BuildingStorefrontIcon class="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <p class="text-slate-400">Không có seller nào chờ duyệt</p>
        </div>
        <div v-else class="space-y-4">
          <GlassCard 
            v-for="seller in pendingSellers" 
            :key="seller._id"
            class="p-6"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <BuildingStorefrontIcon class="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 class="text-white font-medium">{{ seller.sellerInfo?.businessName || seller.username }}</h3>
                  <p class="text-slate-400 text-sm">{{ seller.username }} • {{ seller.sellerInfo?.businessEmail || seller.email }}</p>
                  <p class="text-slate-500 text-xs mt-1">Đăng ký: {{ formatDate(seller.createdAt) }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="verifySellerIdentity(seller._id)"
                  class="px-3 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors text-xs"
                >
                  Xác minh CCCD
                </button>
                <button 
                  @click="approveSeller(seller._id)"
                  class="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <CheckIcon class="w-5 h-5" />
                </button>
                <button 
                  @click="rejectSeller(seller._id)"
                  class="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <!-- Pending Products -->
      <div v-if="activeTab === 'products'">
        <div v-if="pendingProducts.length === 0" class="text-center py-12">
          <CubeIcon class="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <p class="text-slate-400">Không có sản phẩm nào chờ duyệt</p>
        </div>
        <div v-else class="space-y-4">
          <GlassCard 
            v-for="product in pendingProducts" 
            :key="product._id"
            class="p-6"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <CubeIcon class="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 class="text-white font-medium">{{ product.name }}</h3>
                  <p class="text-slate-400 text-sm">{{ (product.currency || 'vnd').toUpperCase() }} • {{ formatPrice(product.price) }}</p>
                  <p class="text-slate-500 text-xs mt-1">Seller: {{ sellerDisplayName(product) }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="approveProduct(product._id)"
                  class="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <CheckIcon class="w-5 h-5" />
                </button>
                <button 
                  @click="rejectProduct(product._id)"
                  class="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { sellerApi, productApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import {
  BuildingStorefrontIcon,
  CubeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid';

const toast = useToast();
const activeTab = ref('sellers');
const pendingSellers = ref([]);
const pendingProducts = ref([]);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);
const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const sellerDisplayName = (product) => {
  const s = product.sellerId;
  if (!s) return '—';
  return s.sellerInfo?.businessName || s.username || '—';
};

const fetchPendingItems = async () => {
  try {
    const [sellersRes, productsRes] = await Promise.all([
      sellerApi.getPendingSellers(),
      productApi.getPendingProducts()
    ]);
    if (sellersRes.success) pendingSellers.value = sellersRes.data?.sellers || [];
    if (productsRes.success) pendingProducts.value = productsRes.data?.products || [];
  } catch (error) {
    pendingSellers.value = [];
    pendingProducts.value = [];
    toast.error(error.message || 'Không thể tải danh sách chờ duyệt');
  }
};

const approveSeller = async (id) => {
  try {
    await sellerApi.approveSeller(id);
    toast.success('Đã phê duyệt seller');
    pendingSellers.value = pendingSellers.value.filter(s => s._id !== id);
  } catch (error) {
    toast.error(error.message || 'Không thể phê duyệt');
  }
};

const rejectSeller = async (id) => {
  try {
    await sellerApi.rejectSeller(id, {});
    toast.success('Đã từ chối seller');
    pendingSellers.value = pendingSellers.value.filter(s => s._id !== id);
  } catch (error) {
    toast.error(error.message || 'Không thể từ chối');
  }
};

const verifySellerIdentity = async (id) => {
  try {
    await sellerApi.updateSellerCompliance(id, { identityVerified: true, identityDocumentType: 'cccd' });
    toast.success('Đã xác minh CCCD cho seller');
  } catch (error) {
    toast.error(error.message || 'Không thể xác minh CCCD');
  }
};

const approveProduct = async (id) => {
  try {
    await productApi.approveProduct(id);
    toast.success('Đã phê duyệt sản phẩm');
    pendingProducts.value = pendingProducts.value.filter(p => p._id !== id);
  } catch (error) {
    toast.error(error.message || 'Không thể phê duyệt');
  }
};

const rejectProduct = async (id) => {
  try {
    await productApi.rejectProduct(id, {});
    toast.success('Đã từ chối sản phẩm');
    pendingProducts.value = pendingProducts.value.filter(p => p._id !== id);
  } catch (error) {
    toast.error(error.message || 'Không thể từ chối');
  }
};

onMounted(fetchPendingItems);
</script>
