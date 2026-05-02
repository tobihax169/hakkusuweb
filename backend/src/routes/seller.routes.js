import express from 'express';
import * as sellerController from '../controllers/seller.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(authenticate);

// ==================== SELLER REGISTRATION ====================
router.post('/register', authorize('user'), sellerController.registerAsSeller);

// ==================== SELLER DASHBOARD ====================
router.get('/dashboard', authorize('seller', 'admin'), sellerController.getSellerDashboard);

// ==================== PRODUCT MANAGEMENT ====================
router.post('/products', authorize('seller', 'admin'), sellerController.createProduct);
router.get('/products', authorize('seller', 'admin'), sellerController.getSellerProducts);
router.put('/products/:id', authorize('seller', 'admin'), sellerController.updateProduct);
router.delete('/products/:id', authorize('seller', 'admin'), sellerController.deleteProduct);

// ==================== ORDERS & EARNINGS ====================
router.get('/orders', authorize('seller', 'admin'), sellerController.getSellerOrders);
router.get('/earnings', authorize('seller', 'admin'), sellerController.getEarnings);

// ==================== WITHDRAWAL ====================
router.post('/withdrawals', authorize('seller', 'admin'), sellerController.requestWithdrawal);
router.get('/withdrawals', authorize('seller', 'admin'), sellerController.getWithdrawals);
router.put('/withdrawals/:id/cancel', authorize('seller', 'admin'), sellerController.cancelWithdrawal);

// ==================== ADMIN FUNCTIONS ====================
// Duyệt seller
router.put('/admin/sellers/:userId/verify', authorize('admin'), sellerController.verifySeller);
router.put('/admin/sellers/:userId/reject', authorize('admin'), sellerController.rejectSeller);
router.get('/admin/pending-sellers', authorize('admin'), sellerController.getPendingSellers);

// Duyệt sản phẩm
router.put('/admin/products/:id/approve', authorize('admin'), sellerController.approveProduct);
router.put('/admin/products/:id/reject', authorize('admin'), sellerController.rejectProduct);
router.get('/admin/pending-products', authorize('admin'), sellerController.getPendingProducts);

// Xử lý rút tiền
router.put('/admin/withdrawals/:id/process', authorize('admin'), sellerController.processWithdrawal);
router.get('/admin/pending-withdrawals', authorize('admin'), sellerController.getPendingWithdrawals);

export default router;
