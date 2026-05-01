import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  seedServices
} from '../controllers/service.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public routes
router.get('/', getServices);
router.get('/:packageId', getServiceById);

// Admin routes
router.post('/admin', authenticate, requireAdmin, adminLimiter, createService);
router.post('/admin/seed', authenticate, requireAdmin, seedServices);
router.put('/admin/:packageId', authenticate, requireAdmin, updateService);
router.delete('/admin/:packageId', authenticate, requireAdmin, deleteService);

export default router;
