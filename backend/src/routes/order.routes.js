import { Router } from 'express';
import {
  getMyOrders,
  getOrderById,
  createOrder,
  payWithWallet,
  cancelOrder,
  reviewOrder,
  getAllOrders,
  updateOrder,
  getOrderStats
} from '../controllers/order.controller.js';
import { authenticate, requireSupport, requireAdmin } from '../middleware/auth.js';
import { orderLimiter } from '../middleware/rateLimiter.js';
import {
  validate,
  createOrderSchema,
  updateOrderSchema,
  reviewOrderSchema,
  listOrdersQuerySchema,
  orderStatsQuerySchema
} from '../validators/order.validator.js';

const router = Router();

// User routes
router.get('/', authenticate, validate(listOrdersQuerySchema), getMyOrders);
router.post('/', authenticate, orderLimiter, validate(createOrderSchema), createOrder);
router.get('/:id', authenticate, getOrderById);
router.post('/:id/pay', authenticate, payWithWallet);
router.put('/:id/cancel', authenticate, cancelOrder);
router.put('/:id/review', authenticate, validate(reviewOrderSchema), reviewOrder);

// Admin/Support routes
router.get('/admin/all', authenticate, requireSupport, validate(listOrdersQuerySchema), getAllOrders);
router.get('/admin/stats', authenticate, requireAdmin, validate(orderStatsQuerySchema), getOrderStats);
router.put('/admin/:id', authenticate, requireSupport, validate(updateOrderSchema), updateOrder);

export default router;
