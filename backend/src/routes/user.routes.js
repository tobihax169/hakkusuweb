import { Router } from 'express';
import {
  getWallet,
  getUserStats,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserBalance,
  toggleBanUser,
  getAdminUserStats
} from '../controllers/user.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// User routes
router.get('/wallet', authenticate, getWallet);
router.get('/stats', authenticate, getUserStats);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, getAllUsers);
router.get('/admin/stats', authenticate, requireAdmin, getAdminUserStats);
router.get('/admin/:id', authenticate, requireAdmin, getUserById);
router.put('/admin/:id', authenticate, requireAdmin, adminLimiter, updateUser);
router.post('/admin/:id/balance', authenticate, requireAdmin, updateUserBalance);
router.put('/admin/:id/ban', authenticate, requireAdmin, toggleBanUser);

export default router;
