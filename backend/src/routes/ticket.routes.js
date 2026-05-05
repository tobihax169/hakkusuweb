import express from 'express';
import * as ticketController from '../controllers/ticket.controller.js';
import { authenticate, requireSupport } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, ticketController.createTicket);
router.get('/my', authenticate, ticketController.getMyTickets);

router.get('/', authenticate, requireSupport, ticketController.listTickets);
router.get('/:id', authenticate, ticketController.getTicketById);
router.post('/:id/reply', authenticate, ticketController.replyToTicket);
router.put('/:id', authenticate, requireSupport, ticketController.updateTicket);
router.put('/:id/close', authenticate, ticketController.closeTicket);

export default router;
