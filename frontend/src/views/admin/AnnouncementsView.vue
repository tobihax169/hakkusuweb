<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Thông báo
          </h1>
          <p class="text-slate-400 mt-1">Quản lý thông báo hệ thống</p>
        </div>
        <button
          v-if="authStore.isAdmin"
          @click="showCreateModal = true"
          class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          Tạo thông báo
        </button>
      </div>

      <!-- Announcements List -->
      <div class="space-y-4">
        <div v-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-slate-800/50 rounded-2xl h-32 animate-pulse" />
        </div>
        <div v-else-if="announcements.length === 0" class="text-center py-12">
          <MegaphoneIcon class="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <p class="text-slate-400">Chưa có thông báo nào</p>
        </div>
        <GlassCard 
          v-for="announcement in announcements" 
          :key="announcement._id"
          class="p-6"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <Badge :variant="getTypeVariant(announcement.type)">
                  {{ getTypeLabel(announcement.type) }}
                </Badge>
                <span class="text-slate-500 text-sm">{{ formatDate(announcement.createdAt) }}</span>
                <Badge v-if="announcement.pinned" variant="primary">Đã ghim</Badge>
              </div>
              <h3 class="text-lg font-semibold text-white mb-2">{{ announcement.title }}</h3>
              <p class="text-slate-400">{{ announcement.content }}</p>
            </div>
            <div v-if="authStore.isAdmin" class="flex gap-2 ml-4">
              <button 
                @click="editAnnouncement(announcement)"
                class="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button 
                @click="deleteAnnouncement(announcement._id)"
                class="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showCreateModal = false">
      <GlassCard class="w-full max-w-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-6">{{ editingId ? 'Sửa thông báo' : 'Tạo thông báo' }}</h3>
        <form @submit.prevent="saveAnnouncement" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tiêu đề</label>
            <input 
              v-model="formData.title" 
              type="text"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
              placeholder="Nhập tiêu đề"
              required
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Nội dung</label>
            <textarea 
              v-model="formData.content" 
              rows="4"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500/50"
              placeholder="Nhập nội dung thông báo..."
              required
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Loại</label>
              <select v-model="formData.type" class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white outline-none">
                <option value="info">Thông tin</option>
                <option value="warning">Cảnh báo</option>
                <option value="success">Thành công</option>
                <option value="error">Lỗi</option>
              </select>
            </div>
            <div class="flex items-center gap-2 pt-8">
              <input v-model="formData.pinned" type="checkbox" id="pinned" class="w-4 h-4 rounded border-slate-700 bg-slate-900">
              <label for="pinned" class="text-slate-400">Ghim thông báo</label>
            </div>
          </div>
          <div class="flex gap-3 pt-4">
            <button 
              type="button"
              @click="showCreateModal = false"
              class="flex-1 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit"
              :disabled="saving"
              class="flex-1 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {{ saving ? 'Đang lưu...' : 'Lưu' }}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth.js';
import { announcementApi } from '@/services/api.js';
import GlassCard from '@/components/ui/GlassCard.vue';
import Badge from '@/components/ui/Badge.vue';
import {
  PlusIcon,
  MegaphoneIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/solid';

const toast = useToast();
const authStore = useAuthStore();
const loading = ref(true);
const announcements = ref([]);
const showCreateModal = ref(false);
const saving = ref(false);
const editingId = ref(null);
const formData = reactive({ title: '', content: '', type: 'info', pinned: false });

const getTypeVariant = (type) => ({
  info: 'info',
  warning: 'warning',
  success: 'success',
  error: 'danger'
}[type] || 'default');

const getTypeLabel = (type) => ({
  info: 'Thông tin',
  warning: 'Cảnh báo',
  success: 'Thành công',
  error: 'Lỗi'
}[type] || type);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const fetchAnnouncements = async () => {
  try {
    const response = await announcementApi.getAll();
    if (response.success) announcements.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    announcements.value = [];
    toast.error(error.message || 'Không thể tải thông báo');
  } finally {
    loading.value = false;
  }
};

const editAnnouncement = (announcement) => {
  editingId.value = announcement._id;
  formData.title = announcement.title;
  formData.content = announcement.content;
  formData.type = announcement.type;
  formData.pinned = announcement.pinned;
  showCreateModal.value = true;
};

const saveAnnouncement = async () => {
  if (!formData.title || !formData.content) {
    toast.error('Vui lòng nhập đầy đủ thông tin');
    return;
  }
  saving.value = true;
  try {
    if (editingId.value) {
      await announcementApi.update(editingId.value, formData);
      toast.success('Cập nhật thành công');
    } else {
      await announcementApi.create(formData);
      toast.success('Tạo thông báo thành công');
    }
    showCreateModal.value = false;
    editingId.value = null;
    resetForm();
    fetchAnnouncements();
  } catch (error) {
    toast.error(error.message || 'Không thể lưu thông báo');
  } finally {
    saving.value = false;
  }
};

const deleteAnnouncement = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa thông báo này?')) return;
  try {
    await announcementApi.delete(id);
    toast.success('Đã xóa thông báo');
    announcements.value = announcements.value.filter(a => a._id !== id);
  } catch (error) {
    toast.error(error.message || 'Không thể xóa thông báo');
  }
};

const resetForm = () => {
  formData.title = '';
  formData.content = '';
  formData.type = 'info';
  formData.pinned = false;
};

onMounted(fetchAnnouncements);
</script>
