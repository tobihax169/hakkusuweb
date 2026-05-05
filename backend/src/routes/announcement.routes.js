import express from 'express';
import * as announcementController from '../controllers/announcement.controller.js';
import { authenticate, requireAdmin, requireSupport } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requireSupport, announcementController.listAnnouncements);
router.get('/:id', requireSupport, announcementController.getAnnouncement);
router.post('/', requireAdmin, announcementController.createAnnouncement);
router.put('/:id', requireAdmin, announcementController.updateAnnouncement);
router.delete('/:id', requireAdmin, announcementController.deleteAnnouncement);

export default router;
