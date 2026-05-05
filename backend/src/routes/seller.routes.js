import express from 'express';
import * as sellerController from '../controllers/seller.controller.js';
import { authenticate, requireAdmin, requireSupport } from '../middleware/auth.js';

const router = express.Router();

// Middleware kiểm tra role seller hoặc admin
const requireSeller = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Chưa đăng nhập'
    });
  }

  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Không có quyền - Yêu cầu Seller hoặc Admin'
    });
  }

  next();
};

// Middleware kiểm tra role user (chưa là seller)
const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Chưa đăng nhập'
    });
  }

  if (req.user.role === 'seller') {
    return res.status(400).json({
      success: false,
      message: 'Bạn đã là seller rồi'
    });
  }

  next();
};

// Tất cả routes đều cần authentication
router.use(authenticate);

// ==================== SELLER REGISTRATION ====================
router.post('/register', requireUser, sellerController.registerAsSeller);

// ==================== SELLER DASHBOARD ====================
router.get('/dashboard', requireSeller, sellerController.getSellerDashboard);

// ==================== PRODUCT MANAGEMENT ====================
router.post('/products', requireSeller, sellerController.createProduct);
router.get('/products', requireSeller, sellerController.getSellerProducts);
router.get('/products/:id', requireSeller, sellerController.getSellerProductById);
router.put('/products/:id', requireSeller, sellerController.updateProduct);
router.delete('/products/:id', requireSeller, sellerController.deleteProduct);

// ==================== ORDERS & EARNINGS ====================
router.get('/orders', requireSeller, sellerController.getSellerOrders);
router.get('/earnings', requireSeller, sellerController.getEarnings);

// ==================== WITHDRAWAL ====================
router.post('/withdrawals', requireSeller, sellerController.requestWithdrawal);
router.get('/withdrawals', requireSeller, sellerController.getWithdrawals);
router.put('/withdrawals/:id/cancel', requireSeller, sellerController.cancelWithdrawal);

// ==================== ADMIN / SUPPORT FUNCTIONS ====================
// Duyệt seller (support + admin)
router.put('/admin/sellers/:userId/verify', requireSupport, sellerController.verifySeller);
router.put('/admin/sellers/:userId/reject', requireSupport, sellerController.rejectSeller);
router.get('/admin/pending-sellers', requireSupport, sellerController.getPendingSellers);

// Duyệt sản phẩm
router.put('/admin/products/:id/approve', requireSupport, sellerController.approveProduct);
router.put('/admin/products/:id/reject', requireSupport, sellerController.rejectProduct);
router.get('/admin/pending-products', requireSupport, sellerController.getPendingProducts);

// Xử lý rút tiền (chỉ admin)
router.put('/admin/withdrawals/:id/process', requireAdmin, sellerController.processWithdrawal);
router.get('/admin/pending-withdrawals', requireAdmin, sellerController.getPendingWithdrawals);

export default router;
