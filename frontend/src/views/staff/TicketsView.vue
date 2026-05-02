<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
        Quản lý Tickets Hỗ trợ
      </h1>
      <div class="flex items-center gap-4">
        <select
          v-model="filterStatus"
          class="px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="open">Đang mở</option>
          <option value="pending">Đang chờ</option>
          <option value="resolved">Đã giải quyết</option>
          <option value="closed">Đã đóng</option>
        </select>
        <select
          v-model="filterPriority"
          class="px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
        >
          <option value="all">Tất cả mức độ</option>
          <option value="urgent">Khẩn cấp</option>
          <option value="high">Cao</option>
          <option value="medium">Trung bình</option>
          <option value="low">Thấp</option>
        </select>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tiêu đề</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Người gửi</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mức độ</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Người xử lý</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thời gian</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="ticket in filteredTickets" :key="ticket.id" class="hover:bg-slate-50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">#{{ ticket.id }}</td>
              <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">
                <div class="font-medium">{{ ticket.title }}</div>
                <div class="text-slate-500 text-xs">{{ ticket.category }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                {{ ticket.user.name }}
                <div class="text-xs">{{ ticket.user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPriorityClass(ticket.priority)">
                  {{ getPriorityLabel(ticket.priority) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(ticket.status)">
                  {{ getStatusLabel(ticket.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                {{ ticket.assignedTo || 'Chưa phân công' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                {{ formatDate(ticket.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-2">
                  <button
                    @click="openTicket(ticket)"
                    class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                    title="Xem chi tiết"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="!ticket.assignedTo"
                    @click="assignTicket(ticket)"
                    class="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                    title="Nhận xử lý"
                  >
                    <HandRaisedIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTickets.length === 0" class="text-center py-12">
        <TicketIcon class="w-16 h-16 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
        <p class="text-slate-500 dark:text-slate-400">Không có ticket nào</p>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div v-if="selectedTicket" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">#{{ selectedTicket.id }} - {{ selectedTicket.title }}</h2>
            <p class="text-sm text-slate-500 mt-1">{{ selectedTicket.category }}</p>
          </div>
          <button @click="selectedTicket = null" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700">
            <XMarkIcon class="w-6 h-6 text-slate-500" />
          </button>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <!-- Ticket Info -->
          <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 dark:bg-gray-700 rounded-xl">
            <div>
              <p class="text-sm text-slate-500">Người gửi</p>
              <p class="font-medium text-slate-900 dark:text-white">{{ selectedTicket.user.name }}</p>
              <p class="text-sm text-slate-500">{{ selectedTicket.user.email }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Người xử lý</p>
              <p class="font-medium text-slate-900 dark:text-white">{{ selectedTicket.assignedTo || 'Chưa phân công' }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Mức độ</p>
              <span :class="getPriorityClass(selectedTicket.priority)">{{ getPriorityLabel(selectedTicket.priority) }}</span>
            </div>
            <div>
              <p class="text-sm text-slate-500">Trạng thái</p>
              <select v-model="selectedTicket.status" @change="updateStatus(selectedTicket)" class="mt-1 px-3 py-1 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="open">Đang mở</option>
                <option value="pending">Đang chờ</option>
                <option value="resolved">Đã giải quyết</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
          </div>

          <!-- Messages -->
          <div class="space-y-4">
            <div v-for="message in selectedTicket.messages" :key="message.id" :class="['flex gap-4', message.isStaff ? 'flex-row-reverse' : '']">
              <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold" :class="message.isStaff ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-gray-600 text-slate-700 dark:text-gray-300'">
                {{ message.author.charAt(0) }}
              </div>
              <div :class="['flex-1 p-4 rounded-2xl', message.isStaff ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' : 'bg-slate-100 dark:bg-gray-700 text-slate-900 dark:text-white']">
                <p class="font-medium text-sm">{{ message.author }}</p>
                <p class="mt-1">{{ message.content }}</p>
                <p class="text-xs text-slate-500 mt-2">{{ formatDate(message.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reply Box -->
        <div class="p-6 border-t border-slate-200 dark:border-gray-700">
          <div class="flex gap-4">
            <textarea
              v-model="replyMessage"
              rows="3"
              placeholder="Nhập phản hồi..."
              class="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white resize-none"
            />
            <button
              @click="sendReply"
              :disabled="!replyMessage.trim() || sending"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="sending">Đang gửi...</span>
              <span v-else>Gửi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import {
  TicketIcon,
  EyeIcon,
  HandRaisedIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const toast = useToast();
const loading = ref(false);
const tickets = ref([]);
const filterStatus = ref('all');
const filterPriority = ref('all');
const selectedTicket = ref(null);
const replyMessage = ref('');
const sending = ref(false);

const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    const matchStatus = filterStatus.value === 'all' || ticket.status === filterStatus.value;
    const matchPriority = filterPriority.value === 'all' || ticket.priority === filterPriority.value;
    return matchStatus && matchPriority;
  });
});

const fetchTickets = async () => {
  loading.value = true;
  try {
    // TODO: Gọi API
    tickets.value = [
      {
        id: 1234,
        title: 'Lỗi không đăng nhập được',
        category: 'Tài khoản',
        user: { name: 'Nguyễn Văn A', email: 'a@example.com' },
        priority: 'high',
        status: 'open',
        assignedTo: null,
        createdAt: new Date(),
        messages: [
          { id: 1, author: 'Nguyễn Văn A', content: 'Tôi không đăng nhập được, báo lỗi sai mật khẩu', isStaff: false, createdAt: new Date() }
        ]
      },
      {
        id: 1235,
        title: 'Yêu cầu hoàn tiền đơn hàng #5678',
        category: 'Đơn hàng',
        user: { name: 'Trần Thị B', email: 'b@example.com' },
        priority: 'urgent',
        status: 'pending',
        assignedTo: 'Support A',
        createdAt: new Date(Date.now() - 3600000),
        messages: [
          { id: 1, author: 'Trần Thị B', content: 'Tôi muốn hoàn tiền cho đơn hàng này', isStaff: false, createdAt: new Date(Date.now() - 3600000) },
          { id: 2, author: 'Support A', content: 'Chị vui lòng cung cấp lý do hoàn tiền', isStaff: true, createdAt: new Date(Date.now() - 1800000) }
        ]
      }
    ];
  } finally {
    loading.value = false;
  }
};

const openTicket = (ticket) => {
  selectedTicket.value = { ...ticket };
};

const assignTicket = async (ticket) => {
  try {
    // TODO: API call
    ticket.assignedTo = 'Tôi';
    toast.success('Đã nhận ticket #' + ticket.id);
  } catch (error) {
    toast.error('Không thể nhận ticket');
  }
};

const updateStatus = async (ticket) => {
  try {
    // TODO: API call
    toast.success('Đã cập nhật trạng thái');
  } catch (error) {
    toast.error('Không thể cập nhật');
  }
};

const sendReply = async () => {
  if (!replyMessage.value.trim()) return;
  
  sending.value = true;
  try {
    // TODO: API call
    selectedTicket.value.messages.push({
      id: Date.now(),
      author: 'Support Staff',
      content: replyMessage.value,
      isStaff: true,
      createdAt: new Date()
    });
    replyMessage.value = '';
    toast.success('Đã gửi phản hồi');
  } catch (error) {
    toast.error('Không thể gửi');
  } finally {
    sending.value = false;
  }
};

const getPriorityClass = (priority) => {
  const classes = {
    urgent: 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    high: 'px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    medium: 'px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    low: 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  };
  return classes[priority] || classes.medium;
};

const getPriorityLabel = (priority) => {
  const labels = { urgent: 'Khẩn cấp', high: 'Cao', medium: 'Trung bình', low: 'Thấp' };
  return labels[priority] || priority;
};

const getStatusClass = (status) => {
  const classes = {
    open: 'px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    pending: 'px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    resolved: 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    closed: 'px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-400'
  };
  return classes[status] || classes.open;
};

const getStatusLabel = (status) => {
  const labels = { open: 'Đang mở', pending: 'Đang chờ', resolved: 'Đã giải quyết', closed: 'Đã đóng' };
  return labels[status] || status;
};

const formatDate = (date) => new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));

onMounted(fetchTickets);
</script>
