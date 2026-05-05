import { Ticket } from '../models/index.js';
import { catchAsync, APIError } from '../middleware/errorHandler.js';

const isStaffUser = (user) => ['admin', 'support'].includes(user?.role);

export const createTicket = catchAsync(async (req, res) => {
  const { title, description, priority } = req.body;
  if (!title?.trim()) {
    throw new APIError('Tiêu đề là bắt buộc', 400);
  }

  const ticketNumber = `T-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const ticket = await Ticket.create({
    ticketNumber,
    title: title.trim(),
    description: description || '',
    priority: priority && ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
    userId: req.user._id,
    replies: []
  });

  const populated = await Ticket.findById(ticket._id).populate('userId', 'username email');
  res.status(201).json({ success: true, data: populated });
});

export const getMyTickets = catchAsync(async (req, res) => {
  const tickets = await Ticket.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('userId', 'username email')
    .lean();

  res.json({ success: true, data: tickets });
});

export const listTickets = catchAsync(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status && ['open', 'pending', 'closed'].includes(status)) {
    query.status = status;
  }

  const tickets = await Ticket.find(query)
    .sort({ createdAt: -1 })
    .populate('userId', 'username email')
    .lean();

  res.json({ success: true, data: tickets });
});

export const getTicketById = catchAsync(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('userId', 'username email')
    .populate('replies.userId', 'username email');

  if (!ticket) throw new APIError('Không tìm thấy ticket', 404);

  const ticketOwnerId = ticket.userId?._id?.toString() || ticket.userId?.toString();
  const owner = ticketOwnerId === req.user._id.toString();
  if (!owner && !isStaffUser(req.user)) {
    throw new APIError('Không có quyền xem ticket này', 403);
  }

  res.json({ success: true, data: ticket });
});

export const replyToTicket = catchAsync(async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) {
    throw new APIError('Nội dung phản hồi là bắt buộc', 400);
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new APIError('Không tìm thấy ticket', 404);

  const owner = ticket.userId.toString() === req.user._id.toString();
  if (!owner && !isStaffUser(req.user)) {
    throw new APIError('Không có quyền phản hồi', 403);
  }

  ticket.replies.push({
    content: content.trim(),
    userId: req.user._id,
    isStaff: isStaffUser(req.user)
  });
  if (ticket.status === 'open' && isStaffUser(req.user)) {
    ticket.status = 'pending';
  }
  await ticket.save();

  const populated = await Ticket.findById(ticket._id)
    .populate('userId', 'username email')
    .populate('replies.userId', 'username email');

  res.json({ success: true, data: populated });
});

export const updateTicket = catchAsync(async (req, res) => {
  const { status } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new APIError('Không tìm thấy ticket', 404);

  if (!isStaffUser(req.user)) {
    throw new APIError('Chỉ staff mới được cập nhật trạng thái', 403);
  }

  if (status && ['open', 'pending', 'closed'].includes(status)) {
    ticket.status = status;
  }
  await ticket.save();

  const populated = await Ticket.findById(ticket._id)
    .populate('userId', 'username email')
    .populate('replies.userId', 'username email');

  res.json({ success: true, data: populated });
});

export const closeTicket = catchAsync(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new APIError('Không tìm thấy ticket', 404);

  const owner = ticket.userId.toString() === req.user._id.toString();
  if (!owner && !isStaffUser(req.user)) {
    throw new APIError('Không có quyền', 403);
  }

  ticket.status = 'closed';
  await ticket.save();

  res.json({ success: true, data: ticket });
});
