import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as uploadController from '../controllers/upload.controller.js';

const router = express.Router();

const requireSeller = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
  }
  if (req.user.role !== 'seller' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Yêu cầu tài khoản seller' });
  }
  next();
};

router.post('/product-image-presign', authenticate, requireSeller, uploadController.presignProductImage);

export default router;
