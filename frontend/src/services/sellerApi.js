import api from './api.js';

export const sellerApi = {
  // Đăng ký làm seller
  registerSeller(data) {
    return api.post('/seller/register', data);
  },

  // Lấy dashboard
  getDashboard() {
    return api.get('/seller/dashboard');
  },

  // Sản phẩm
  getProducts(params) {
    return api.get('/seller/products', { params });
  },

  createProduct(data) {
    return api.post('/seller/products', data);
  },

  updateProduct(id, data) {
    return api.put(`/seller/products/${id}`, data);
  },

  deleteProduct(id) {
    return api.delete(`/seller/products/${id}`);
  },

  // Đơn hàng
  getOrders(params) {
    return api.get('/seller/orders', { params });
  },

  // Thu nhập
  getEarnings(params) {
    return api.get('/seller/earnings', { params });
  },

  // Rút tiền
  requestWithdrawal(data) {
    return api.post('/seller/withdrawals', data);
  },

  getWithdrawals(params) {
    return api.get('/seller/withdrawals', { params });
  },

  cancelWithdrawal(id) {
    return api.put(`/seller/withdrawals/${id}/cancel`);
  }
};

export default sellerApi;
