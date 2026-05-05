import express from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import * as shopController from '../controllers/shop.controller.js';

const router = express.Router();

router.get('/:username/reviews', shopController.getShopReviews);
router.post('/:username/follow', authenticate, shopController.followShop);
router.delete('/:username/follow', authenticate, shopController.unfollowShop);
router.post('/:username/reviews', authenticate, shopController.createShopReview);
router.get('/:username/messages', authenticate, shopController.getShopMessages);
router.post('/:username/messages', authenticate, shopController.postShopMessage);
router.get('/:username', optionalAuth, shopController.getShopByUsername);

export default router;
