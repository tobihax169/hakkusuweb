import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import orderRoutes from './order.routes.js';
import serviceRoutes from './service.routes.js';
import paymentRoutes from './payment.routes.js';
import sellerRoutes from './seller.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    name: 'Hakkusu Store API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/services', serviceRoutes);
router.use('/payments', paymentRoutes);
router.use('/seller', sellerRoutes);

export default router;
