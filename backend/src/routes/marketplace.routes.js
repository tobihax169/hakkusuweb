import { Router } from 'express';
import {
  getServices,
  getServiceById,
  getServicesBySeller,
  trackServiceView
} from '../controllers/service.controller.js';

const router = Router();

router.get('/products', getServices);
router.get('/products/:packageId', getServiceById);
router.post('/products/:packageId/view', trackServiceView);
router.get('/sellers/:sellerId/products', getServicesBySeller);

export default router;
