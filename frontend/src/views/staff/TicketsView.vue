<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Quản lý Tickets
        </h1>
        <p class="text-slate-400 mt-1">Xử lý yêu cầu hỗ trợ từ khách hàng</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-3 mb-6">
        <button 
          v-for="status in statusFilters" 
          :key="status.value"
          @click="filters.status = status.value"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filters.status === status.value
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'
          ]"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- Tickets List -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-slate-800/50 rounded-2xl h-32 animate-pulse" />
      </div>
      <div v-else-if="tickets.length === 0" class="text-center py-12">
        <TicketIcon class="w-16 h-16 mx-auto text-slate-600 mb-4" />
        <p class="text-slate-400">Không có ticket nào</p>
      </div>
      <div v-else class="space-y-4">
        <GlassCard 
          v-for="ticket in tickets" 
          :key="ticket._id"
          hover
          class="p-6 cursor-pointer"
          @click="openTicket(ticket)"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-4">
              <div :class="getPriorityClass(ticket.priority)" class="w-12 h-12 rounded-xl flex items-center justify-center">
                <TicketIcon class="w-6 h-6" />
              </div>
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <h3 class="text-white font-medium">{{ ticket.title }}</h3>
                  <Badge :variant="getStatusVariant(ticket.status)">{{ getStatusLabel(ticket.status) }}</Badge>
                </div>
                <p class="text-slate-400 text-sm">{{ ticket.userId?.username }} • {{ formatDate(ticket.createdAt) }}</p>
                <p class="text-slate-500 text-sm mt-2 line-clamp-2">{{ ticket.description }}</p>
              </div>
            </div>
            <ChevronRightIcon class="w-5 h-5 text-slate-500" />
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div v-if="selectedTicket" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="selectedTicket = null">
      <GlassCard class="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div class="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-white">{{ selectedTicket.title }}</h3>
            <p class="text-slate-400 text-sm">#{{ selectedTicket.ticketNumber }} • {{ selectedTicket.userId?.username }}</p>
          </div>
          <div class="flex items-center gap-2">
            <select 
              v-model="selectedTicket.status" 
              @change="updateTicketStatus"
              class="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white outline-none"
            >
              <option value="open">Đang mở</option>
              <option value="pending">Đang xử lý</option>
              <option value="closed">Đã đóng</option>
            </select>
            <button @click="selectedTicket = null" class="p-2 hover:bg-slate-700 rounded-lg">
              <XMarkIcon class="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
        <div class="p-6 overflow-y-auto flex-1 max-h-[50vh]">
          <div class="space-y-4">
            <div 
              v-for="reply in selectedTicket.replies" 
              :key="reply._id" 
              :class="reply.isStaff ? 'bg-blue-500/10' : 'bg-slate-700/30'"
              class="p-4 rounded-xl"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="font-medium text-white">{{ reply.userId?.username }}</span>
                <Badge v-if="reply.isStaff" variant="primary">Staff</Badge>
                <span class="text-slate-500 text-xs">{{ formatDate(reply.createdAt) }}</span>
              </div>
              <p class="text-slate-300">{{ reply.content }}</p>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-slate-700/50">
          <div class="flex gap-2">
            <input 
              v-model="replyContent" 
              @keyup.enter="sendReply"
              type="text" 
              placeholder="Nhập phản hồi..."
              class="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
            >
            <button 
              @click="sendReply"
              class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Gửi
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { ticketApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import Badge from '@/components/ui/Badge.vue';
import {
  TicketIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid';

const toast = useToast();
const loading = ref(true);
const tickets = ref([]);
const filters = reactive({ status: '' });
const selectedTicket = ref(null);
const replyContent = ref('');

const statusFilters = [
  { value: '', label: 'Tất cả' },
  { value: 'open', label: 'Đang mở' },
  { value: 'pending', label: 'Đang xử lý' },
  { value: 'closed', label: 'Đã đóng' }
];

const getPriorityClass = (priority) => ({
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-green-500/20 text-green-400'
}[priority] || 'bg-slate-500/20 text-slate-400');

const getStatusVariant = (status) => ({
  open: 'warning',
  pending: 'info',
  closed: 'success'
}[status] || 'default');

const getStatusLabel = (status) => ({ open: 'Đang mở', pending: 'Đang xử lý', closed: 'Đã đóng' }[status] || status);

const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const fetchTickets = async () => {
  loading.value = true;
  try {
    const response = await ticketApi.getAllTickets(filters);
    if (response.success) tickets.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    toast.error(error.message || 'Không thể tải tickets');
    tickets.value = [];
  } finally {
    loading.value = false;
  }
};

const openTicket = async (ticket) => {
  try {
    const response = await ticketApi.getTicketById(ticket._id);
    if (response.success && response.data) {
      selectedTicket.value = response.data;
    } else {
      selectedTicket.value = ticket;
    }
  } catch (error) {
    toast.error(error.message || 'Không thể mở ticket');
  }
};

const updateTicketStatus = async () => {
  if (!selectedTicket.value) return;
  try {
    await ticketApi.updateTicket(selectedTicket.value._id, { status: selectedTicket.value.status });
    toast.success('Cập nhật trạng thái thành công');
    const res = await ticketApi.getTicketById(selectedTicket.value._id);
    if (res.success && res.data) selectedTicket.value = res.data;
  } catch (error) {
    toast.error(error.message || 'Không thể cập nhật');
  }
};

const sendReply = async () => {
  if (!replyContent.value.trim() || !selectedTicket.value) return;
  try {
    const res = await ticketApi.replyToTicket(selectedTicket.value._id, { content: replyContent.value });
    toast.success('Đã gửi phản hồi');
    replyContent.value = '';
    if (res.success && res.data) {
      selectedTicket.value = res.data;
    }
    await fetchTickets();
  } catch (error) {
    toast.error(error.message || 'Không thể gửi phản hồi');
  }
};

watch(() => filters.status, () => {
  fetchTickets();
});

onMounted(fetchTickets);
</script>
