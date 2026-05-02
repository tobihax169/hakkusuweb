<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Duyệt Seller & Sản phẩm
    </h1>

    <!-- Tabs -->
    <div class="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['px-4 py-3 font-medium text-sm border-b-2 transition-colors', activeTab === tab.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300']"
      >
        <span class="flex items-center gap-2">
          <component :is="tab.icon" class="w-5 h-5" />
          {{ tab.label }}
          <span v-if="tab.count > 0" class="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">{{ tab.count }}</span>
        </span>
      </button>
    </div>

    <!-- Sellers Tab -->
    <div v-if="activeTab === 'sellers'" class="card">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Seller đang chờ duyệt</h2>
        <span class="text-sm text-gray-500">{{ pendingSellers.length }} seller</span>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="seller in pendingSellers" :key="seller.id" class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {{ seller.businessName.charAt(0) }}
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ seller.businessName }}</h3>
                  <p class="text-sm text-gray-500">{{ seller.businessEmail }}</p>
                  <p class="text-sm text-gray-500 mt-1">{{ seller.phone || 'Chưa có SĐT' }}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                  Đang chờ duyệt
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">{{ seller.description }}</p>
              <div class="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <UserIcon class="w-4 h-4" />
                <span>Đăng ký bởi: {{ seller.user.name }} ({{ seller.user.email }})</span>
              </div>
              <div class="flex items-center gap-2 mt-4">
                <button
                  @click="approveSeller(seller)"
                  :disabled="processing[seller.id]"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  <span class="flex items-center gap-2">
                    <CheckIcon class="w-4 h-4" />
                    {{ processing[seller.id] === 'approve' ? 'Đang duyệt...' : 'Duyệt' }}
                  </span>
                </button>
                <button
                  @click="rejectSeller(seller)"
                  :disabled="processing[seller.id]"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  <span class="flex items-center gap-2">
                    <XMarkIcon class="w-4 h-4" />
                    {{ processing[seller.id] === 'reject' ? 'Đang từ chối...' : 'Từ chối' }}
                  </span>
                </button>
                <button
                  @click="viewSellerDetail(seller)"
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pendingSellers.length === 0" class="text-center py-12">
        <BuildingStorefrontIcon class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p class="text-gray-500 dark:text-gray-400">Không có seller nào đang chờ duyệt</p>
      </div>
    </div>

    <!-- Products Tab -->
    <div v-if="activeTab === 'products'" class="card">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Sản phẩm đang chờ duyệt</h2>
        <span class="text-sm text-gray-500">{{ pendingProducts.length }} sản phẩm</span>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="product in pendingProducts" :key="product.id" class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50">
          <div class="flex items-start gap-4">
            <div class="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover rounded-xl" />
              <CubeIcon v-else class="w-8 h-8 text-gray-400" />
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500">{{ product.category }}</p>
                  <p class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{{ formatPrice(product.price) }}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                  Đang chờ duyệt
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{{ product.description }}</p>
              <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <BuildingStorefrontIcon class="w-4 h-4" />
                  {{ product.seller.businessName }}
                </span>
                <span class="flex items-center gap-1">
                  <BoxIcon class="w-4 h-4" />
                  Kho: {{ product.stock }}
                </span>
              </div>
              <div class="flex items-center gap-2 mt-4">
                <button
                  @click="approveProduct(product)"
                  :disabled="processing[product.id]"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  <span class="flex items-center gap-2">
                    <CheckIcon class="w-4 h-4" />
                    {{ processing[product.id] === 'approve' ? 'Đang duyệt...' : 'Duyệt' }}
                  </span>
                </button>
                <button
                  @click="rejectProduct(product)"
                  :disabled="processing[product.id]"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  <span class="flex items-center gap-2">
                    <XMarkIcon class="w-4 h-4" />
                    {{ processing[product.id] === 'reject' ? 'Đang từ chối...' : 'Từ chối' }}
                  </span>
                </button>
                <button
                  @click="viewProductDetail(product)"
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pendingProducts.length === 0" class="text-center py-12">
        <CubeIcon class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p class="text-gray-500 dark:text-gray-400">Không có sản phẩm nào đang chờ duyệt</p>
      </div>
    </div>

    <!-- History Tab -->
    <div v-if="activeTab === 'history'" class="card">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Lịch sử duyệt</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Người yêu cầu</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Người duyệt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in history" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(item.date) }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', item.type === 'seller' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600']">
                  {{ item.type === 'seller' ? 'Seller' : 'Sản phẩm' }}
                </span>
              </td>
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ item.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ item.requester }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', item.action === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600']">
                  {{ item.action === 'approved' ? 'Đã duyệt' : 'Đã từ chối' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ item.approver }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import {
  BuildingStorefrontIcon,
  CubeIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  BoxIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';

const toast = useToast();
const activeTab = ref('sellers');
const processing = ref({});

const tabs = [
  { id: 'sellers', label: 'Seller', icon: BuildingStorefrontIcon, count: 0 },
  { id: 'products', label: 'Sản phẩm', icon: CubeIcon, count: 0 },
  { id: 'history', label: 'Lịch sử', icon: ClockIcon, count: 0 }
];

const pendingSellers = ref([
  {
    id: 1,
    businessName: 'ABC Store',
    businessEmail: 'abc@store.com',
    phone: '0901234567',
    description: 'Chuyên cung cấp các sản phẩm Discord Nitro, Spotify Premium với giá tốt nhất thị trường.',
    user: { name: 'Nguyễn Văn A', email: 'a@example.com' },
    status: 'pending'
  },
  {
    id: 2,
    businessName: 'Game Key Shop',
    businessEmail: 'contact@gamekey.com',
    phone: '0912345678',
    description: 'Bán key game Steam, Epic Games chính hãng giá rẻ.',
    user: { name: 'Trần Thị B', email: 'b@example.com' },
    status: 'pending'
  }
]);

const pendingProducts = ref([
  {
    id: 1,
    name: 'Discord Nitro 1 tháng',
    category: 'Discord',
    price: 99000,
    stock: 50,
    description: 'Discord Nitro 1 tháng full perk, gửi qua gift link.',
    seller: { businessName: 'ABC Store' },
    image: null
  },
  {
    id: 2,
    name: 'Spotify Premium 3 tháng',
    category: 'Spotify',
    price: 149000,
    stock: 30,
    description: 'Spotify Premium 3 tháng cho tài khoản cá nhân.',
    seller: { businessName: 'Music Store' },
    image: null
  }
]);

const history = ref([
  { id: 1, type: 'seller', name: 'XYZ Shop', requester: 'user@example.com', action: 'approved', approver: 'admin', date: new Date(Date.now() - 86400000) },
  { id: 2, type: 'product', name: 'Netflix 4K 1 tháng', requester: 'ABC Store', action: 'rejected', approver: 'admin', date: new Date(Date.now() - 172800000) }
]);

const approveSeller = async (seller) => {
  processing.value[seller.id] = 'approve';
  try {
    // TODO: API call
    await new Promise(r => setTimeout(r, 1000));
    pendingSellers.value = pendingSellers.value.filter(s => s.id !== seller.id);
    toast.success(`Đã duyệt seller "${seller.businessName}"`);
  } catch (error) {
    toast.error('Không thể duyệt seller');
  } finally {
    delete processing.value[seller.id];
  }
};

const rejectSeller = async (seller) => {
  processing.value[seller.id] = 'reject';
  try {
    // TODO: API call
    await new Promise(r => setTimeout(r, 1000));
    pendingSellers.value = pendingSellers.value.filter(s => s.id !== seller.id);
    toast.success(`Đã từ chối seller "${seller.businessName}"`);
  } catch (error) {
    toast.error('Không thể từ chối seller');
  } finally {
    delete processing.value[seller.id];
  }
};

const approveProduct = async (product) => {
  processing.value[product.id] = 'approve';
  try {
    // TODO: API call
    await new Promise(r => setTimeout(r, 1000));
    pendingProducts.value = pendingProducts.value.filter(p => p.id !== product.id);
    toast.success(`Đã duyệt sản phẩm "${product.name}"`);
  } catch (error) {
    toast.error('Không thể duyệt sản phẩm');
  } finally {
    delete processing.value[product.id];
  }
};

const rejectProduct = async (product) => {
  processing.value[product.id] = 'reject';
  try {
    // TODO: API call
    await new Promise(r => setTimeout(r, 1000));
    pendingProducts.value = pendingProducts.value.filter(p => p.id !== product.id);
    toast.success(`Đã từ chối sản phẩm "${product.name}"`);
  } catch (error) {
    toast.error('Không thể từ chối sản phẩm');
  } finally {
    delete processing.value[product.id];
  }
};

const viewSellerDetail = (seller) => {
  // TODO: Open detail modal
  console.log('View seller:', seller);
};

const viewProductDetail = (product) => {
  // TODO: Open detail modal
  console.log('View product:', product);
};

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
const formatDate = (date) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));

onMounted(() => {
  tabs[0].count = pendingSellers.value.length;
  tabs[1].count = pendingProducts.value.length;
});
</script>
