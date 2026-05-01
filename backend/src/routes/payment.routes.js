import { Router } from 'express';
import {
  createTopup,
  paymentWebhook,
  getTransactionHistory,
  getTransactionByCode,
  checkPaymentStatus,
  cancelTransaction,
  getAllTransactions,
  updateTransaction,
  getPaymentStats
} from '../controllers/payment.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Webhook (public, nhưng cần verify signature trong controller)
router.post('/webhook', paymentWebhook);

// User routes
router.get('/history', authenticate, getTransactionHistory);
router.post('/topup', authenticate, paymentLimiter, createTopup);
router.get('/:transactionCode', authenticate, getTransactionByCode);
router.get('/:transactionCode/status', authenticate, checkPaymentStatus);
router.put('/:transactionCode/cancel', authenticate, cancelTransaction);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, getAllTransactions);
router.get('/admin/stats', authenticate, requireAdmin, getPaymentStats);
router.put('/admin/:transactionCode', authenticate, requireAdmin, updateTransaction);

export default router;
