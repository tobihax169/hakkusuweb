<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
        {{ $t('admin.services') }}
      </h1>
      <div class="flex gap-2">
        <button @click="seedServices" class="btn-outline">
          <ArrowPathIcon class="w-4 h-4 mr-2" />
          Seed Default
        </button>
        <button @click="openModal()" class="btn-primary">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add Service
        </button>
      </div>
    </div>

    <!-- Services Grid -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="service in services"
        :key="service.packageId"
        class="card p-6"
        :class="{ 'ring-2 ring-blue-500': service.popular }"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <component :is="getIcon(service.icon)" class="w-8 h-8 text-blue-600" />
            <div>
              <h3 class="font-semibold text-slate-900 dark:text-white">{{ service.name }}</h3>
              <p class="text-sm text-slate-500">{{ service.packageId }}</p>
            </div>
          </div>
          <div class="flex gap-1">
            <button @click="openModal(service)" class="p-1 text-slate-400 hover:text-blue-600">
              <PencilIcon class="w-4 h-4" />
            </button>
            <button @click="deleteService(service)" class="p-1 text-slate-400 hover:text-red-600">
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <p class="text-slate-600 dark:text-gray-300 text-sm mb-4">{{ service.description }}</p>

        <div class="flex items-center justify-between">
          <span class="text-xl font-bold text-blue-600">
            {{ service.price > 0 ? formatPrice(service.price) + ' ₫' : 'Liên hệ' }}
          </span>
          <span :class="service.isActive ? 'badge-success' : 'badge-danger'" class="badge">
            {{ service.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{ editingService ? 'Edit' : 'Add' }} Service</h2>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveService" class="p-6 space-y-4">
          <div>
            <label class="form-label">Package ID</label>
            <input v-model="form.packageId" class="form-input" required :disabled="editingService" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Name (VI)</label>
              <input v-model="form.name" class="form-input" required />
            </div>
            <div>
              <label class="form-label">Name (EN)</label>
              <input v-model="form.nameEn" class="form-input" />
            </div>
          </div>
          <div>
            <label class="form-label">Price</label>
            <input v-model.number="form.price" type="number" class="form-input" required />
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2">
              <input v-model="form.isActive" type="checkbox" />
              <span>Active</span>
            </label>
            <label class="flex items-center gap-2">
              <input v-model="form.popular" type="checkbox" />
              <span>Popular</span>
            </label>
          </div>
          <div class="flex justify-end gap-2 pt-4">
            <button type="button" @click="showModal = false" class="btn-outline">Cancel</button>
            <button type="submit" class="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { serviceApi } from '@/services/api.js';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  XMarkIcon,
  CubeIcon,
  StarIcon,
  SparklesIcon,
  PuzzlePieceIcon
} from '@heroicons/vue/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

const toast = useToast();

const loading = ref(true);
const services = ref([]);
const showModal = ref(false);
const editingService = ref(null);

const form = reactive({
  packageId: '',
  name: '',
  nameEn: '',
  price: 0,
  icon: 'CubeIcon',
  isActive: true,
  popular: false
});

const iconMap = { CubeIcon, StarIcon, SparklesIcon, PuzzlePieceIcon };
const getIcon = (iconName) => iconMap[iconName] || CubeIcon;

const formatPrice = (price) => price?.toLocaleString('vi-VN') || '0';

const fetchServices = async () => {
  try {
    const response = await serviceApi.getServices();
    services.value = response.data;
  } catch (error) {
    toast.error('Failed to fetch services');
  } finally {
    loading.value = false;
  }
};

const openModal = (service = null) => {
  editingService.value = service;
  if (service) {
    Object.assign(form, service);
    form.packageId = service.id;
  } else {
    Object.assign(form, {
      packageId: '',
      name: '',
      nameEn: '',
      price: 0,
      isActive: true,
      popular: false
    });
  }
  showModal.value = true;
};

const saveService = async () => {
  try {
    if (editingService.value) {
      await serviceApi.updateService(form.packageId, form);
    } else {
      await serviceApi.createService(form);
    }
    toast.success('Service saved');
    showModal.value = false;
    fetchServices();
  } catch (error) {
    toast.error('Failed to save service');
  }
};

const deleteService = async (service) => {
  if (!confirm('Delete this service?')) return;
  try {
    await serviceApi.deleteService(service.id);
    toast.success('Service deleted');
    fetchServices();
  } catch (error) {
    toast.error('Failed to delete');
  }
};

const seedServices = async () => {
  try {
    await serviceApi.seedServices();
    toast.success('Services seeded');
    fetchServices();
  } catch (error) {
    toast.error('Failed to seed');
  }
};

onMounted(fetchServices);
</script>
