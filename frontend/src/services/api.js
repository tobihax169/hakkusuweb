import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

// Tạo axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor - Thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý lỗi
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    // Xử lý lỗi 401 - Unauthorized
    if (response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login?expired=true';
    }

    // Trả về error object với message từ server
    return Promise.reject({
      message: response?.data?.message || 'Có lỗi xảy ra',
      status: response?.status,
      data: response?.data
    });
  }
);

// ==================== AUTH API ====================
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken })
};

// ==================== USER API ====================
export const userApi = {
  getWallet: () => api.get('/users/wallet'),
  getStats: () => api.get('/users/stats'),
  // Admin
  getAllUsers: (params) => api.get('/users/admin/all', { params }),
  getUserById: (id) => api.get(`/users/admin/${id}`),
  updateUser: (id, data) => api.put(`/users/admin/${id}`, data),
  updateUserBalance: (id, data) => api.post(`/users/admin/${id}/balance`, data),
  toggleBanUser: (id, data) => api.put(`/users/admin/${id}/ban`, data),
  getAdminUserStats: (params) => api.get('/users/admin/stats', { params })
};

// ==================== ORDER API ====================
export const orderApi = {
  getMyOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  payWithWallet: (id, data) => api.post(`/orders/${id}/pay`, data),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  reviewOrder: (id, data) => api.put(`/orders/${id}/review`, data),
  // Admin
  getAllOrders: (params) => api.get('/orders/admin/all', { params }),
  updateOrder: (id, data) => api.put(`/orders/admin/${id}`, data),
  getOrderStats: (params) => api.get('/orders/admin/stats', { params })
};

// ==================== SERVICE API ====================
export const serviceApi = {
  getServices: (params = {}) => api.get('/services', { params }),
  getServicesBySeller: (sellerId, params = {}) => api.get(`/services/seller/${sellerId}`, { params }),
  getServiceById: (packageId, lang) => api.get(`/services/${packageId}`, { params: { lang } }),
  trackView: (packageId) => api.post(`/services/${packageId}/view`),
  // Admin
  createService: (data) => api.post('/services/admin', data),
  updateService: (packageId, data) => api.put(`/services/admin/${packageId}`, data),
  deleteService: (packageId) => api.delete(`/services/admin/${packageId}`)
};

// ==================== MARKETPLACE API ====================
export const marketplaceApi = {
  getProducts: (params = {}) => api.get('/marketplace/products', { params }),
  getProductById: (packageId, lang) => api.get(`/marketplace/products/${packageId}`, { params: { lang } }),
  getSellerProducts: (sellerId, params = {}) => api.get(`/marketplace/sellers/${sellerId}/products`, { params }),
  trackView: (packageId) => api.post(`/marketplace/products/${packageId}/view`)
};

// ==================== PAYMENT API ====================
export const paymentApi = {
  createTopup: (data) => api.post('/payments/topup', data),
  getTransactionHistory: (params) => api.get('/payments/history', { params }),
  getTransactionByCode: (code) => api.get(`/payments/${code}`),
  checkPaymentStatus: (code) => api.get(`/payments/${code}/status`),
  cancelTransaction: (code) => api.put(`/payments/${code}/cancel`),
  // Admin
  getAllTransactions: (params) => api.get('/payments/admin/all', { params }),
  updateTransaction: (code, data) => api.put(`/payments/admin/${code}`, data),
  getPaymentStats: (params) => api.get('/payments/admin/stats', { params })
};

// ==================== ANNOUNCEMENT API ====================
export const announcementApi = {
  getAll: (params) => api.get('/announcements', { params }),
  getById: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`)
};

// ==================== TICKET API ====================
export const ticketApi = {
  getAllTickets: (params) => api.get('/tickets', { params }),
  getMyTickets: () => api.get('/tickets/my'),
  getTicketById: (id) => api.get(`/tickets/${id}`),
  createTicket: (data) => api.post('/tickets', data),
  replyToTicket: (id, data) => api.post(`/tickets/${id}/reply`, data),
  updateTicket: (id, data) => api.put(`/tickets/${id}`, data),
  closeTicket: (id) => api.put(`/tickets/${id}/close`)
};

// ==================== SELLER API (base: /api/seller) ====================
export const sellerApi = {
  registerSeller: (data) => api.post('/seller/register', data),
  /** Alias dashboard payload (no separate /me on server). */
  getMySellerInfo: () => api.get('/seller/dashboard'),
  getDashboard: () => api.get('/seller/dashboard'),
  getMyOrders: (params) => api.get('/seller/orders', { params }),
  // Staff/Admin — paths match seller.routes.js
  getPendingSellers: (params) => api.get('/seller/admin/pending-sellers', { params }),
  approveSeller: (userId) => api.put(`/seller/admin/sellers/${userId}/verify`),
  rejectSeller: (userId, data) => api.put(`/seller/admin/sellers/${userId}/reject`, data || {}),
  updateSellerCompliance: (userId, data) => api.put(`/seller/admin/sellers/${userId}/compliance`, data)
};

// ==================== PRODUCT API (seller marketplace products under /seller) ====================
export const productApi = {
  getMyProducts: (params) => api.get('/seller/products', { params }),
  getProductById: (id) => api.get(`/seller/products/${id}`),
  createProduct: (data) => api.post('/seller/products', data),
  updateProduct: (id, data) => api.put(`/seller/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/seller/products/${id}`),
  // Staff/Admin
  getPendingProducts: (params) => api.get('/seller/admin/pending-products', { params }),
  approveProduct: (id) => api.put(`/seller/admin/products/${id}/approve`),
  rejectProduct: (id, data) => api.put(`/seller/admin/products/${id}/reject`, data || {})
};

export default api;
