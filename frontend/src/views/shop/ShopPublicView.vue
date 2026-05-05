<template>
  <div class="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
    </div>

    <div v-if="loading" class="relative z-10 max-w-6xl mx-auto py-24 flex justify-center">
      <div class="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>

    <div v-else-if="errorMsg" class="relative z-10 max-w-6xl mx-auto">
      <GlassCard class="p-8 text-center text-red-400">{{ errorMsg }}</GlassCard>
    </div>

    <div v-else-if="shop" class="relative z-10 max-w-6xl mx-auto space-y-8">
      <GlassCard class="p-8">
        <div class="flex flex-col md:flex-row md:items-start gap-6">
          <div
            class="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shrink-0 overflow-hidden"
          >
            <img v-if="shop.avatarUrl" :src="shop.avatarUrl" alt="" class="w-full h-full object-cover">
            <span v-else>{{ shopInitial }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl sm:text-3xl font-bold text-white">{{ shop.businessName }}</h1>
            <p class="text-slate-500 text-sm mt-1">@{{ shop.username }}</p>
            <p class="text-slate-300 mt-3 whitespace-pre-wrap">{{ shop.description || 'Chưa có mô tả cửa hàng.' }}</p>
            <div class="flex flex-wrap items-center gap-4 mt-4">
              <div class="flex items-center gap-1 text-amber-400 text-sm">
                <StarIcon class="w-5 h-5" />
                <span>{{ Number(shop.rating || 0).toFixed(1) }}</span>
                <span class="text-slate-500">({{ shop.reviewCount || 0 }} đánh giá)</span>
              </div>
              <span class="text-slate-600">|</span>
              <span class="text-slate-400 text-sm">{{ followerCount }} người theo dõi</span>
            </div>
            <div v-if="authStore.isAuthenticated && !isOwnShop" class="mt-6">
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                :class="isFollowing ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-blue-600 text-white hover:bg-blue-500'"
                :disabled="followBusy"
                @click="toggleFollow"
              >
                {{ followBusy ? '...' : isFollowing ? 'Đang theo dõi' : 'Theo dõi' }}
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <GlassCard class="p-6">
            <h2 class="text-lg font-semibold text-white mb-4">Sản phẩm đang bán</h2>
            <div v-if="!products.length" class="text-slate-500 text-sm">Chưa có sản phẩm hiển thị.</div>
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                v-for="p in products"
                :key="p.id"
                class="rounded-xl border border-slate-700/60 overflow-hidden bg-slate-900/40 hover:border-blue-500/40 transition-colors cursor-pointer"
                @click="goBuy(p)"
              >
                <div class="aspect-square bg-slate-800/50">
                  <img v-if="coverImage(p)" :src="coverImage(p)" :alt="p.name" class="w-full h-full object-cover">
                </div>
                <div class="p-2">
                  <p class="text-xs text-white line-clamp-2 min-h-[2rem]">{{ p.name }}</p>
                  <p class="text-xs text-blue-400 font-semibold mt-1">{{ formatPrice(p.price) }}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard class="p-6">
            <h2 class="text-lg font-semibold text-white mb-4">Đánh giá</h2>
            <div v-if="!reviews.length" class="text-slate-500 text-sm">Chưa có đánh giá.</div>
            <ul v-else class="space-y-4">
              <li v-for="r in reviews" :key="r._id" class="border-b border-slate-700/50 pb-4 last:border-0">
                <div class="flex items-center gap-2 text-amber-400 text-sm">
                  <span>{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</span>
                  <span class="text-slate-500">{{ r.reviewer?.username }}</span>
                </div>
                <p v-if="r.comment" class="text-slate-300 text-sm mt-2">{{ r.comment }}</p>
                <p class="text-xs text-slate-600 mt-1">{{ formatDate(r.createdAt) }}</p>
              </li>
            </ul>

            <div v-if="authStore.isAuthenticated && !isOwnShop" class="mt-6 pt-6 border-t border-slate-700/50 space-y-3">
              <p class="text-sm text-slate-400">Đánh giá sau khi mua (cần mã đơn đã hoàn thành)</p>
              <input v-model="reviewForm.orderId" type="text" placeholder="Order ID (Mongo _id)" class="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm">
              <div class="flex gap-2 items-center">
                <label class="text-slate-400 text-sm">Sao</label>
                <select v-model.number="reviewForm.rating" class="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <textarea v-model="reviewForm.comment" rows="2" placeholder="Nhận xét (tuỳ chọn)" class="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm" />
              <button type="button" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500" :disabled="reviewBusy" @click="submitReview">
                {{ reviewBusy ? 'Đang gửi...' : 'Gửi đánh giá' }}
              </button>
            </div>
          </GlassCard>
        </div>

        <GlassCard v-if="!isOwnShop" class="p-6 h-fit lg:sticky lg:top-24">
          <h2 class="text-lg font-semibold text-white mb-3">Nhắn tin với shop</h2>
          <p v-if="!authStore.isAuthenticated" class="text-slate-400 text-sm">Đăng nhập để chat realtime với cửa hàng.</p>
          <template v-else>
            <div ref="msgBox" class="max-h-72 overflow-y-auto space-y-2 mb-3 pr-1">
              <div
                v-for="m in messages"
                :key="m._id"
                class="text-sm rounded-lg px-3 py-2"
                :class="isMine(m) ? 'bg-blue-600/30 text-white ml-4' : 'bg-slate-800 text-slate-200 mr-4'"
              >
                <span class="text-xs text-slate-500 block mb-0.5">{{ m.sender?.username || '...' }}</span>
                {{ m.body }}
              </div>
            </div>
            <form class="flex gap-2" @submit.prevent="sendChat">
              <input v-model="chatInput" type="text" class="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm" placeholder="Nhập tin nhắn...">
              <button type="submit" class="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm shrink-0" :disabled="sendBusy">Gửi</button>
            </form>
          </template>
        </GlassCard>

        <GlassCard v-else class="p-6 h-fit">
          <p class="text-slate-400 text-sm">Đây là cửa hàng của bạn. Trả lời khách từ Bảng điều khiển seller (tin nhắn đến).</p>
          <router-link to="/seller/dashboard" class="inline-block mt-3 text-blue-400 text-sm hover:underline">Mở dashboard</router-link>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.js';
import { shopApi } from '@/services/api.js';
import { createShopSocket } from '@/composables/useShopSocket.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import { StarIcon } from '@heroicons/vue/24/solid';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const loading = ref(true);
const errorMsg = ref('');
const shop = ref(null);
const products = ref([]);
const followerCount = ref(0);
const isFollowing = ref(false);
const reviews = ref([]);
const messages = ref([]);
const followBusy = ref(false);
const reviewBusy = ref(false);
const sendBusy = ref(false);
const chatInput = ref('');
const msgBox = ref(null);

const reviewForm = reactive({
  orderId: '',
  rating: 5,
  comment: ''
});

let socket = null;

const username = computed(() => route.params.username);

const shopInitial = computed(() => (shop.value?.username?.charAt(0) || 'S').toUpperCase());

const isOwnShop = computed(() => {
  if (!authStore.user || !shop.value?._id) return false;
  return String(authStore.user._id) === String(shop.value._id);
});

const coverImage = (p) => {
  const imgs = p.imageUrls;
  if (Array.isArray(imgs) && imgs.length) return imgs[0];
  return p.iconUrl || null;
};

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price || 0);

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleString('vi-VN');
};

const isMine = (m) => String(m.sender?._id || m.senderId) === String(authStore.user?._id);

const scrollChat = () => {
  nextTick(() => {
    const el = msgBox.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
};

const loadShop = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await shopApi.getShop(username.value);
    if (!res.success || !res.data) {
      errorMsg.value = res.message || 'Không tải được cửa hàng';
      return;
    }
    shop.value = res.data.seller;
    products.value = res.data.products || [];
    followerCount.value = res.data.followerCount ?? 0;
    isFollowing.value = Boolean(res.data.isFollowing);
    const rv = await shopApi.getReviews(username.value, { limit: 20 });
    if (rv.success) {
      reviews.value = rv.data?.reviews || [];
    }
  } catch (e) {
    errorMsg.value = e.message || 'Không tải được cửa hàng';
  } finally {
    loading.value = false;
  }
};

const loadMessages = async () => {
  if (!authStore.isAuthenticated || isOwnShop.value) return;
  try {
    const res = await shopApi.getMessages(username.value, { limit: 100 });
    if (res.success) {
      messages.value = res.data?.messages || [];
      scrollChat();
    }
  } catch {
    /* ignore */
  }
};

const connectSocket = () => {
  if (!authStore.isAuthenticated || isOwnShop.value || !shop.value?._id) return;
  socket = createShopSocket();
  if (!socket) return;
  socket.on('connect', () => {
    socket.emit('join_shop', { sellerId: shop.value._id }, () => {});
  });
  socket.on('shop_message', (payload) => {
    const sid = String(payload.sellerId);
    const bid = String(payload.buyerId);
    const my = String(authStore.user._id);
    if (sid !== String(shop.value._id)) return;
    if (bid !== my && String(payload.senderId) !== my) return;
    const exists = messages.value.some((m) => String(m._id) === String(payload._id));
    if (!exists) {
      messages.value.push({
        _id: payload._id,
        body: payload.body,
        createdAt: payload.createdAt,
        senderId: payload.senderId,
        sender: payload.sender
      });
      scrollChat();
    }
  });
};

const disconnectSocket = () => {
  if (socket) {
    if (shop.value?._id) {
      socket.emit('leave_shop', { sellerId: shop.value._id });
    }
    socket.disconnect();
    socket = null;
  }
};

const toggleFollow = async () => {
  followBusy.value = true;
  try {
    if (isFollowing.value) {
      const res = await shopApi.unfollow(username.value);
      if (res.success) {
        isFollowing.value = false;
        followerCount.value = res.data?.followerCount ?? followerCount.value;
      }
    } else {
      const res = await shopApi.follow(username.value);
      if (res.success) {
        isFollowing.value = true;
        followerCount.value = res.data?.followerCount ?? followerCount.value;
      }
    }
  } catch (e) {
    toast.error(e.message || 'Thao tác thất bại');
  } finally {
    followBusy.value = false;
  }
};

const submitReview = async () => {
  if (!reviewForm.orderId.trim()) {
    toast.error('Nhập Order ID');
    return;
  }
  reviewBusy.value = true;
  try {
    const res = await shopApi.createReview(username.value, {
      orderId: reviewForm.orderId.trim(),
      rating: reviewForm.rating,
      comment: reviewForm.comment
    });
    if (res.success) {
      toast.success('Cảm ơn bạn đã đánh giá');
      reviewForm.orderId = '';
      reviewForm.comment = '';
      const rv = await shopApi.getReviews(username.value, { limit: 20 });
      if (rv.success) reviews.value = rv.data?.reviews || [];
      await loadShop();
    }
  } catch (e) {
    toast.error(e.message || 'Không gửi được đánh giá');
  } finally {
    reviewBusy.value = false;
  }
};

const sendChat = async () => {
  const text = chatInput.value.trim();
  if (!text) return;
  sendBusy.value = true;
  try {
    if (socket?.connected) {
      try {
        await new Promise((resolve, reject) => {
          socket.emit(
            'shop_message',
            { sellerId: shop.value._id, body: text },
            (ack) => {
              if (ack?.ok) resolve();
              else reject(new Error(ack?.message || 'Gửi thất bại'));
            }
          );
        });
      } catch {
        const res = await shopApi.sendMessage(username.value, { body: text });
        if (!res.success) throw new Error(res.message || 'Gửi thất bại');
      }
    } else {
      const res = await shopApi.sendMessage(username.value, { body: text });
      if (!res.success) throw new Error(res.message || 'Gửi thất bại');
    }
    chatInput.value = '';
    await loadMessages();
  } catch (e) {
    toast.error(e.message || 'Không gửi được tin');
  } finally {
    sendBusy.value = false;
  }
};

const goBuy = (p) => {
  if (!authStore.isAuthenticated) {
    toast.info('Đăng nhập để mua');
    router.push('/auth/login');
    return;
  }
  router.push(`/orders/new?product=${encodeURIComponent(p.id)}`);
};

watch(username, async () => {
  disconnectSocket();
  await loadShop();
  await loadMessages();
  connectSocket();
});

onMounted(async () => {
  if (!authStore.initialized) await authStore.init();
  await loadShop();
  await loadMessages();
  connectSocket();
});

onUnmounted(() => {
  disconnectSocket();
});
</script>
