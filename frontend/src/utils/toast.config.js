import { useToast } from 'vue-toastification';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon 
} from '@heroicons/vue/24/solid';

// Toast options với styling đẹp hơn
export const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true,
  filterBeforeCreate: (toast, toasts) => {
    // Tránh duplicate toasts
    if (toasts.filter(t => t.content === toast.content).length !== 0) {
      return false;
    }
    return toast;
  }
};

// Custom toast content với icons
export const createToastContent = (message, type) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  };
  
  const colors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };
  
  return {
    component: {
      props: {
        message: String,
        icon: Object,
        colorClass: String
      },
      template: `
        <div class="flex items-center space-x-3">
          <component :is="icon" class="w-5 h-5" :class="colorClass" />
          <span class="text-sm font-medium">{{ message }}</span>
        </div>
      `
    },
    props: {
      message,
      icon: icons[type],
      colorClass: colors[type]
    }
  };
};

// Wrapper functions cho toast
export const useCustomToast = () => {
  const toast = useToast();
  
  return {
    success: (message, options = {}) => {
      toast.success(message, {
        ...toastOptions,
        ...options,
        icon: CheckCircleIcon
      });
    },
    error: (message, options = {}) => {
      toast.error(message, {
        ...toastOptions,
        ...options,
        icon: XCircleIcon,
        timeout: 8000 // Error messages hiển thị lâu hơn
      });
    },
    warning: (message, options = {}) => {
      toast.warning(message, {
        ...toastOptions,
        ...options,
        icon: ExclamationTriangleIcon
      });
    },
    info: (message, options = {}) => {
      toast.info(message, {
        ...toastOptions,
        ...options,
        icon: InformationCircleIcon
      });
    }
  };
};

export default toastOptions;
