<template>
  <div>
    <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
      Quản lý Thông báo
    </h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Tổng thông báo</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <MegaphoneIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Đang hiển thị</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">{{ stats.active }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <EyeIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Lượt xem</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">{{ formatNumber(stats.views) }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <ChartBarIcon class="w-6 h-6 text-indigo-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Scheduled</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mt-1">{{ stats.scheduled }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <select
          v-model="filterType"
          class="px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
        >
          <option value="all">Tất cả loại</option>
          <option value="maintenance">Bảo trì</option>
          <option value="update">Cập nhật</option>
          <option value="promotion">Khuyến mãi</option>
          <option value="general">Thông báo chung</option>
        </select>
        <select
          v-model="filterStatus"
          class="px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hiển thị</option>
          <option value="draft">Bản nháp</option>
          <option value="expired">Hết hạn</option>
        </select>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
      >
        <PlusIcon class="w-5 h-5" />
        Tạo thông báo
      </button>
    </div>

    <!-- Announcements List -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Thông báo</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Đối tượng</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Thời gian</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Lượt xem</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in filteredAnnouncements" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-gray-800/50">
              <td class="px-6 py-4">
                <div class="font-medium text-slate-900 dark:text-white">{{ item.title }}</div>
                <div class="text-sm text-slate-500 line-clamp-1">{{ item.content }}</div>
              </td>
              <td class="px-6 py-4">
                <span :class="getTypeClass(item.type)">{{ getTypeLabel(item.type) }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                {{ getTargetLabel(item.target) }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                <div v-if="item.startDate">{{ formatDate(item.startDate) }}</div>
                <div v-if="item.endDate" class="text-xs text-slate-500">đến {{ formatDate(item.endDate) }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                {{ formatNumber(item.views) }}
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(item.status)">{{ getStatusLabel(item.status) }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="editAnnouncement(item)"
                    class="p-2 rounded-lg bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-600"
                    title="Sửa"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="item.status === 'draft'"
                    @click="publishAnnouncement(item)"
                    class="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                    title="Đăng"
                  >
                    <CheckIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="item.status === 'active'"
                    @click="unpublishAnnouncement(item)"
                    class="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                    title="Ẩn"
                  >
                    <EyeSlashIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteAnnouncement(item)"
                    class="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                    title="Xóa"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredAnnouncements.length === 0" class="text-center py-12">
        <MegaphoneIcon class="w-16 h-16 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
        <p class="text-slate-500 dark:text-slate-400">Chưa có thông báo nào</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ editingItem ? 'Sửa thông báo' : 'Tạo thông báo mới' }}
          </h2>
          <button @click="closeModal" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700">
            <XMarkIcon class="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <form @submit.prevent="saveAnnouncement" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Tiêu đề</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
              placeholder="Nhập tiêu đề thông báo"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Nội dung</label>
            <textarea
              v-model="form.content"
              rows="5"
              required
              class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white resize-none"
              placeholder="Nhập nội dung chi tiết"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Loại thông báo</label>
              <select
                v-model="form.type"
                class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
              >
                <option value="maintenance">Bảo trì</option>
                <option value="update">Cập nhật</option>
                <option value="promotion">Khuyến mãi</option>
                <option value="general">Thông báo chung</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Đối tượng nhận</label>
              <select
                v-model="form.target"
                class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
              >
                <option value="all">Tất cả người dùng</option>
                <option value="users">Chỉ người dùng</option>
                <option value="sellers">Chỉ seller</option>
                <option value="admins">Chỉ admin</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Ngày bắt đầu</label>
              <input
                v-model="form.startDate"
                type="datetime-local"
                class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Ngày kết thúc (tùy chọn)</label>
              <input
                v-model="form.endDate"
                type="datetime-local"
                class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="form.pinned"
              type="checkbox"
              id="pinned"
              class="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            <label for="pinned" class="text-sm text-slate-700 dark:text-gray-300">Ghim lên đầu trang</label>
          </div>

          <div class="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-gray-700">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {{ saving ? 'Đang lưu...' : (editingItem ? 'Cập nhật' : 'Tạo thông báo') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import {
  MegaphoneIcon,
  EyeIcon,
  ChartBarIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  CheckIcon,
  EyeSlashIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const toast = useToast();
const filterType = ref('all');
const filterStatus = ref('all');
const showCreateModal = ref(false);
const editingItem = ref(null);
const saving = ref(false);

const stats = ref({
  total: 0,
  active: 0,
  views: 0,
  scheduled: 0
});

const form = ref({
  title: '',
  content: '',
  type: 'general',
  target: 'all',
  startDate: '',
  endDate: '',
  pinned: false
});

const announcements = ref([
  {
    id: 1,
    title: 'Bảo trì hệ thống ngày 05/05/2026',
    content: 'Hệ thống sẽ bảo trì từ 02:00 đến 06:00 sáng để nâng cấp cơ sở dữ liệu.',
    type: 'maintenance',
    target: 'all',
    startDate: new Date('2026-05-05T02:00:00'),
    endDate: new Date('2026-05-05T06:00:00'),
    views: 1250,
    status: 'active',
    pinned: true
  },
  {
    id: 2,
    title: 'Khuyến mãi 30% tất cả sản phẩm',
    content: 'Chương trình khuyến mãi lớn nhất năm! Giảm 30% cho tất cả sản phẩm từ ngày 1-7/5.',
    type: 'promotion',
    target: 'all',
    startDate: new Date('2026-05-01T00:00:00'),
    endDate: new Date('2026-05-07T23:59:59'),
    views: 3580,
    status: 'active',
    pinned: false
  },
  {
    id: 3,
    title: 'Cập nhật tính năng mới cho seller',
    content: 'Đã thêm tính năng thống kê doanh thu chi tiết theo từng sản phẩm.',
    type: 'update',
    target: 'sellers',
    startDate: new Date(),
    views: 420,
    status: 'draft',
    pinned: false
  }
]);

const filteredAnnouncements = computed(() => {
  return announcements.value.filter(item => {
    const matchType = filterType.value === 'all' || item.type === filterType.value;
    const matchStatus = filterStatus.value === 'all' || item.status === filterStatus.value;
    return matchType && matchStatus;
  });
});

const closeModal = () => {
  showCreateModal.value = false;
  editingItem.value = null;
  form.value = {
    title: '',
    content: '',
    type: 'general',
    target: 'all',
    startDate: '',
    endDate: '',
    pinned: false
  };
};

const editAnnouncement = (item) => {
  editingItem.value = item;
  form.value = { ...item };
  showCreateModal.value = true;
};

const saveAnnouncement = async () => {
  saving.value = true;
  try {
    if (editingItem.value) {
      const index = announcements.value.findIndex(a => a.id === editingItem.value.id);
      if (index !== -1) {
        announcements.value[index] = { ...editingItem.value, ...form.value };
      }
      toast.success('Đã cập nhật thông báo');
    } else {
      const newItem = {
        id: Date.now(),
        ...form.value,
        views: 0,
        status: 'draft'
      };
      announcements.value.unshift(newItem);
      toast.success('Đã tạo thông báo mới');
    }
    closeModal();
  } catch (error) {
    toast.error('Có lỗi xảy ra');
  } finally {
    saving.value = false;
  }
};

const publishAnnouncement = async (item) => {
  try {
    item.status = 'active';
    toast.success('Đã đăng thông báo');
  } catch (error) {
    toast.error('Không thể đăng thông báo');
  }
};

const unpublishAnnouncement = async (item) => {
  try {
    item.status = 'draft';
    toast.success('Đã ẩn thông báo');
  } catch (error) {
    toast.error('Không thể ẩn thông báo');
  }
};

const deleteAnnouncement = async (item) => {
  if (!confirm('Bạn có chắc muốn xóa thông báo này?')) return;
  
  try {
    announcements.value = announcements.value.filter(a => a.id !== item.id);
    toast.success('Đã xóa thông báo');
  } catch (error) {
    toast.error('Không thể xóa thông báo');
  }
};

const getTypeClass = (type) => {
  const classes = {
    maintenance: 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    update: 'px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    promotion: 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    general: 'px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-400'
  };
  return classes[type] || classes.general;
};

const getTypeLabel = (type) => {
  const labels = { maintenance: 'Bảo trì', update: 'Cập nhật', promotion: 'Khuyến mãi', general: 'Thông báo' };
  return labels[type] || type;
};

const getTargetLabel = (target) => {
  const labels = { all: 'Tất cả', users: 'Người dùng', sellers: 'Seller', admins: 'Admin' };
  return labels[target] || target;
};

const getStatusClass = (status) => {
  const classes = {
    active: 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    draft: 'px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-400',
    expired: 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
  };
  return classes[status] || classes.draft;
};

const getStatusLabel = (status) => {
  const labels = { active: 'Đang hiển thị', draft: 'Bản nháp', expired: 'Hết hạn' };
  return labels[status] || status;
};

const formatNumber = (num) => new Intl.NumberFormat('vi-VN').format(num);
const formatDate = (date) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));

onMounted(() => {
  stats.value = {
    total: announcements.value.length,
    active: announcements.value.filter(a => a.status === 'active').length,
    views: announcements.value.reduce((sum, a) => sum + a.views, 0),
    scheduled: announcements.value.filter(a => a.startDate && new Date(a.startDate) > new Date()).length
  };
});
</script>
