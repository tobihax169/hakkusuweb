import api from './api.js';

/**
 * SePay API Service
 * Tích hợp thanh toán qua SePay
 */

/**
 * Tạo yêu cầu nạp tiền qua SePay
 * @param {number} amount - Số tiền (VND)
 * @returns {Promise<Object>}
 */
export const createTopup = async (amount) => {
  try {
    const response = await api.post('/payments/sepay/topup', { amount });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Lấy cấu hình SePay
 * @returns {Promise<Object>}
 */
export const getConfig = async () => {
  try {
    const response = await api.get('/payments/sepay/config');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Kiểm tra trạng thái giao dịch
 * @param {string} transactionCode - Mã giao dịch
 * @returns {Promise<Object>}
 */
export const checkStatus = async (transactionCode) => {
  try {
    const response = await api.get(`/payments/sepay/${transactionCode}/status`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Hủy giao dịch
 * @param {string} transactionCode - Mã giao dịch
 * @returns {Promise<Object>}
 */
export const cancelTransaction = async (transactionCode) => {
  try {
    const response = await api.put(`/payments/sepay/${transactionCode}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Lấy lịch sử giao dịch SePay
 * @param {Object} params - Query params
 * @returns {Promise<Object>}
 */
export const getHistory = async (params = {}) => {
  try {
    const response = await api.get('/payments/sepay/history', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Poll kiểm tra trạng thái giao dịch
 * @param {string} transactionCode - Mã giao dịch
 * @param {Function} onSuccess - Callback khi thành công
 * @param {Function} onError - Callback khi lỗi
 * @param {number} interval - Khoảng thời gian poll (ms)
 * @param {number} maxAttempts - Số lần thử tối đa
 * @returns {Function} - Hàm dừng polling
 */
export const pollTransactionStatus = (
  transactionCode,
  onSuccess,
  onError,
  interval = 5000,
  maxAttempts = 60
) => {
  let attempts = 0;
  let isRunning = true;

  const poll = async () => {
    if (!isRunning || attempts >= maxAttempts) {
      if (isRunning && attempts >= maxAttempts) {
        onError?.(new Error('Timeout'));
      }
      return;
    }

    attempts++;

    try {
      const response = await checkStatus(transactionCode);
      const { status, isExpired } = response.data;

      if (status === 'success') {
        isRunning = false;
        onSuccess?.(response.data);
        return;
      }

      if (status === 'failed' || status === 'cancelled' || isExpired) {
        isRunning = false;
        onError?.(new Error(status === 'failed' ? 'Giao dịch thất bại' : 'Giao dịch đã hủy hoặc hết hạn'));
        return;
      }

      // Tiếp tục poll nếu đang pending
      setTimeout(poll, interval);
    } catch (error) {
      if (isRunning) {
        onError?.(error);
      }
    }
  };

  // Bắt đầu polling
  poll();

  // Trả về hàm dừng
  return () => {
    isRunning = false;
  };
};

/**
 * Tạo deeplink mở app ngân hàng
 * @param {string} bankId - Mã ngân hàng
 * @param {string} deeplink - URL deeplink từ SePay
 * @returns {string|null}
 */
export const generateBankDeeplink = (bankId, deeplink) => {
  if (deeplink) return deeplink;

  // Fallback: Tạo deeplink cho một số ngân hàng phổ biến
  const deeplinks = {
    MB: 'https://online.mbbank.com.vn',
    VCB: 'vietcombankmobile://',
    TCB: 'techcombankmobile://',
    ACB: 'acbonline://',
    VPB: 'vpbankonline://',
    BIDV: 'bidvmobile://'
  };

  return deeplinks[bankId] || null;
};

/**
 * Format số tiền hiển thị
 * @param {number} amount 
 * @returns {string}
 */
export const formatAmount = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Tính số Gem nhận được
 * @param {number} amount - Số tiền VND
 * @returns {number}
 */
export const calculateGemAmount = (amount) => {
  return Math.floor(amount / 1000);
};

export default {
  createTopup,
  getConfig,
  checkStatus,
  cancelTransaction,
  getHistory,
  pollTransactionStatus,
  generateBankDeeplink,
  formatAmount,
  calculateGemAmount
};
