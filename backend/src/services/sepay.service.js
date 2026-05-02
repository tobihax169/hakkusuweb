import crypto from 'crypto';
import axios from 'axios';
import { logger } from '../utils/logger.js';

/**
 * SePay Payment Service
 * Tích hợp cổng thanh toán SePay (https://sepay.vn)
 */
class SePayService {
  constructor() {
    this.apiUrl = process.env.SEPAY_API_URL || 'https://api.sepay.vn';
    this.apiToken = process.env.SEPAY_API_TOKEN;
    this.bankId = process.env.SEPAY_BANK_ID || 'MB'; // Mã ngân hàng (MB, ACB, VCB...)
    this.accountNumber = process.env.SEPAY_ACCOUNT_NUMBER;
    this.accountName = process.env.SEPAY_ACCOUNT_NAME;
    this.webhookSecret = process.env.SEPAY_WEBHOOK_SECRET;
    
    this.apiClient = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  /**
   * Tạo mã QR thanh toán
   * @param {Object} params - Thông tin thanh toán
   * @param {number} params.amount - Số tiền
   * @param {string} params.content - Nội dung chuyển khoản
   * @param {string} params.transactionCode - Mã giao dịch
   * @returns {Promise<Object>} - Thông tin QR code
   */
  async createQRCode({ amount, content, transactionCode }) {
    try {
      // Tạo nội dung chuyển khoản theo format SePay
      const transferContent = content || `TOPUP ${transactionCode}`;
      
      // Gọi API tạo QR của SePay
      const response = await this.apiClient.post('/v1/qr/create', {
        bank_id: this.bankId,
        account_number: this.accountNumber,
        account_name: this.accountName,
        amount: amount,
        content: transferContent,
        transaction_id: transactionCode,
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      });

      if (response.data && response.data.success) {
        return {
          success: true,
          qrCodeUrl: response.data.data.qr_code_url,
          qrCodeData: response.data.data.qr_code_data, // Dữ liệu QR dạng text
          deeplink: response.data.data.deeplink, // Link mở app ngân hàng
          transactionId: response.data.data.transaction_id,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Hết hạn sau 24h
        };
      }

      throw new Error(response.data?.message || 'Không thể tạo QR code');
    } catch (error) {
      logger.error('SePay createQRCode error:', error);
      
      // Fallback: Tạo QR VietQR nếu API lỗi
      return this.generateVietQR({ amount, content: transferContent, transactionCode });
    }
  }

  /**
   * Tạo QR code VietQR (fallback khi API lỗi)
   * @param {Object} params
   * @returns {Object}
   */
  generateVietQR({ amount, content, transactionCode }) {
    // Format VietQR theo chuẩn NAPAS
    // Dữ liệu QR: amount|bank_id|account|content
    const qrData = `amount=${amount}&bank_id=${this.bankId}&account=${this.accountNumber}&content=${encodeURIComponent(content)}`;
    
    // URL QR VietQR
    const qrCodeUrl = `https://api.vietqr.io/${this.bankId}/${this.accountNumber}/${amount}/${encodeURIComponent(content)}/vietqr.png`;
    
    return {
      success: true,
      qrCodeUrl,
      qrCodeData: qrData,
      deeplink: null,
      transactionId: transactionCode,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isVietQR: true // Đánh dấu là VietQR
    };
  }

  /**
   * Xác minh webhook signature từ SePay
   * @param {Object} payload - Dữ liệu webhook
   * @param {string} signature - Chữ ký từ header
   * @returns {boolean}
   */
  verifyWebhookSignature(payload, signature) {
    try {
      if (!this.webhookSecret) {
        logger.warn('SePay webhook secret not configured');
        return true; // Skip verify trong dev
      }

      // Tạo chữ ký từ payload
      const dataString = JSON.stringify(payload);
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(dataString)
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      logger.error('SePay verify signature error:', error);
      return false;
    }
  }

  /**
   * Xử lý webhook từ SePay
   * @param {Object} payload - Dữ liệu từ SePay
   * @returns {Object} - Thông tin giao dịch đã xử lý
   */
  async processWebhook(payload) {
    try {
      // Format payload từ SePay:
      // {
      //   "id": "123456",
      //   "gateway": "MB",
      //   "transactionDate": "2024-01-01 10:00:00",
      //   "accountNumber": "1234567890",
      //   "transferAmount": 100000,
      //   "content": "TOPUP TOP24010110001234",
      //   "transferType": "in",
      //   "referenceCode": "MB123456789"
      // }

      const {
        id,
        gateway,
        transactionDate,
        accountNumber,
        transferAmount,
        content,
        transferType,
        referenceCode
      } = payload;

      // Chỉ xử lý giao dịch vào (in)
      if (transferType !== 'in') {
        return { success: true, message: 'Bỏ qua giao dịch ra' };
      }

      // Kiểm tra số tài khoản
      if (accountNumber !== this.accountNumber) {
        return { success: true, message: 'Số tài khoản không khớp' };
      }

      // Parse transaction code từ content
      // Format: "TOPUP TOP24010110001234" hoặc "TOP24010110001234"
      const transactionMatch = content?.match(/(TOP|PAY|REF|WIT)\d{12,16}/);
      const transactionCode = transactionMatch ? transactionMatch[0] : null;

      if (!transactionCode) {
        logger.warn('SePay webhook: Không tìm thấy mã giao dịch trong content:', content);
        return { success: true, message: 'Không tìm thấy mã giao dịch' };
      }

      return {
        success: true,
        transactionCode,
        amount: transferAmount,
        providerTransactionId: id,
        providerReference: referenceCode,
        providerData: {
          gateway,
          transactionDate,
          content,
          raw: payload
        }
      };
    } catch (error) {
      logger.error('SePay processWebhook error:', error);
      throw error;
    }
  }

  /**
   * Query trạng thái giao dịch từ SePay
   * @param {string} transactionId - Mã giao dịch
   * @returns {Promise<Object>}
   */
  async queryTransaction(transactionId) {
    try {
      const response = await this.apiClient.get(`/v1/transactions/${transactionId}`);
      
      if (response.data && response.data.success) {
        return {
          success: true,
          status: response.data.data.status, // pending, success, failed
          amount: response.data.data.amount,
          completedAt: response.data.data.completed_at
        };
      }

      return { success: false, message: response.data?.message };
    } catch (error) {
      logger.error('SePay queryTransaction error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Lấy danh sách ngân hàng hỗ trợ
   * @returns {Promise<Array>}
   */
  async getSupportedBanks() {
    try {
      const response = await this.apiClient.get('/v1/banks');
      return response.data?.data || [];
    } catch (error) {
      logger.error('SePay getSupportedBanks error:', error);
      // Return default banks
      return [
        { id: 'MB', name: 'MB Bank', short_name: 'MB' },
        { id: 'ACB', name: 'ACB', short_name: 'ACB' },
        { id: 'VCB', name: 'Vietcombank', short_name: 'VCB' },
        { id: 'TCB', name: 'Techcombank', short_name: 'TCB' },
        { id: 'VPB', name: 'VPBank', short_name: 'VPB' }
      ];
    }
  }
}

// Export singleton instance
export const sepayService = new SePayService();
export default sepayService;
