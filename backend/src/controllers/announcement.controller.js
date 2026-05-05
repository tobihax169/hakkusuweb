import { Announcement } from '../models/index.js';
import { catchAsync, APIError } from '../middleware/errorHandler.js';

export const listAnnouncements = catchAsync(async (req, res) => {
  const announcements = await Announcement.find()
    .sort({ pinned: -1, createdAt: -1 })
    .lean();

  res.json({ success: true, data: announcements });
});

export const getAnnouncement = catchAsync(async (req, res) => {
  const doc = await Announcement.findById(req.params.id);
  if (!doc) throw new APIError('Không tìm thấy thông báo', 404);
  res.json({ success: true, data: doc });
});

export const createAnnouncement = catchAsync(async (req, res) => {
  const { title, content, type, pinned } = req.body;
  const doc = await Announcement.create({
    title,
    content,
    type: type || 'info',
    pinned: !!pinned,
    createdBy: req.user._id
  });
  res.status(201).json({ success: true, data: doc });
});

export const updateAnnouncement = catchAsync(async (req, res) => {
  const { title, content, type, pinned } = req.body;
  const doc = await Announcement.findByIdAndUpdate(
    req.params.id,
    { title, content, type, pinned },
    { new: true, runValidators: true }
  );
  if (!doc) throw new APIError('Không tìm thấy thông báo', 404);
  res.json({ success: true, data: doc });
});

export const deleteAnnouncement = catchAsync(async (req, res) => {
  const doc = await Announcement.findByIdAndDelete(req.params.id);
  if (!doc) throw new APIError('Không tìm thấy thông báo', 404);
  res.json({ success: true, message: 'Đã xóa' });
});
