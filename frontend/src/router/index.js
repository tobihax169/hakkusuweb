import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

// Layouts
const DefaultLayout = () => import('@/layouts/DefaultLayout.vue');
const AuthLayout = () => import('@/layouts/AuthLayout.vue');
const DashboardLayout = () => import('@/layouts/DashboardLayout.vue');

// Views
const HomeView = () => import('@/views/HomeView.vue');
const ServicesView = () => import('@/views/ServicesView.vue');
const LoginView = () => import('@/views/auth/LoginView.vue');
const RegisterView = () => import('@/views/auth/RegisterView.vue');
const ProfileView = () => import('@/views/user/ProfileView.vue');
const WalletView = () => import('@/views/user/WalletView.vue');
const OrdersView = () => import('@/views/orders/OrdersView.vue');
const OrderDetailView = () => import('@/views/orders/OrderDetailView.vue');
const CreateOrderView = () => import('@/views/orders/CreateOrderView.vue');

// Admin Views
const AdminDashboard = () => import('@/views/admin/DashboardView.vue');
const AdminUsers = () => import('@/views/admin/UsersView.vue');
const AdminOrders = () => import('@/views/admin/OrdersView.vue');
const AdminServices = () => import('@/views/admin/ServicesView.vue');
const AdminAnnouncements = () => import('@/views/admin/AnnouncementsView.vue');

// Staff/Support Views
const StaffDashboard = () => import('@/views/staff/StaffDashboard.vue');
const StaffTickets = () => import('@/views/staff/TicketsView.vue');
const StaffApprovals = () => import('@/views/staff/ApprovalsView.vue');

// Seller Views
const SellerRegister = () => import('@/views/seller/SellerRegister.vue');
const SellerDashboard = () => import('@/views/seller/SellerDashboard.vue');
const SellerProducts = () => import('@/views/seller/SellerProducts.vue');
const CreateProduct = () => import('@/views/seller/CreateProduct.vue');

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: HomeView },
      { path: 'services', name: 'Services', component: ServicesView }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      { path: 'register', name: 'Register', component: RegisterView },
      { 
        path: 'callback', 
        name: 'AuthCallback',
        component: () => import('@/views/auth/CallbackView.vue')
      }
    ]
  },
  {
    path: '/user',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'profile', name: 'Profile', component: ProfileView },
      { path: 'wallet', name: 'Wallet', component: WalletView }
    ]
  },
  {
    path: '/orders',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Orders', component: OrdersView },
      { path: 'new', name: 'CreateOrder', component: CreateOrderView },
      { path: ':id', name: 'OrderDetail', component: OrderDetailView }
    ]
  },
  {
    path: '/admin',
    component: DashboardLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'users', name: 'AdminUsers', component: AdminUsers },
      { path: 'orders', name: 'AdminOrders', component: AdminOrders },
      { path: 'services', name: 'AdminServices', component: AdminServices },
      { path: 'announcements', name: 'AdminAnnouncements', component: AdminAnnouncements }
    ]
  },
  // Staff Routes
  {
    path: '/staff',
    component: DashboardLayout,
    meta: { requiresAuth: true, requiresStaff: true },
    children: [
      { path: '', name: 'StaffDashboard', component: StaffDashboard },
      { path: 'tickets', name: 'StaffTickets', component: StaffTickets },
      { path: 'approvals', name: 'StaffApprovals', component: StaffApprovals }
    ]
  },
  // Seller Routes
  {
    path: '/seller',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'register', name: 'SellerRegister', component: SellerRegister },
      { path: 'dashboard', name: 'SellerDashboard', component: SellerDashboard, meta: { requiresSeller: true } },
      { path: 'products', name: 'SellerProducts', component: SellerProducts, meta: { requiresSeller: true } },
      { path: 'products/create', name: 'CreateProduct', component: CreateProduct, meta: { requiresSeller: true } }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Đợi auth store khởi tạo
  if (!authStore.initialized) {
    await authStore.init();
  }

  // Yêu cầu đăng nhập
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  // Yêu cầu admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'Home' });
  }

  // Yêu cầu seller
  if (to.meta.requiresSeller && !authStore.isSeller) {
    return next({ name: 'SellerRegister' });
  }

  // Yêu cầu staff/support
  if (to.meta.requiresStaff && !(authStore.isAdmin || authStore.isSupport)) {
    return next({ name: 'Home' });
  }

  // Chỉ cho khách (đã đăng nhập thì redirect)
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'Home' });
  }

  next();
});

export default router;
