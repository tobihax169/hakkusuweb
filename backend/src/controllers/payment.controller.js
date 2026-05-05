import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { catchAsync, APIError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import Log from '../models/Log.js';
import QRCode from 'qrcode';

/**
 * Tạo yêu cầu nạp tiền
 * POST /api/payments/topup
 */
export const createTopup = catchAsync(async (req, res) => {
  const { amount, currency, paymentMethod } = req.body;

  if (!amount || amount <= 0) {
    throw new APIError('Số tiền không hợp lệ', 400);
  }

  // Chỉ hỗ trợ VND cho nạp tiền thật
  if (currency !== 'vnd') {
    throw new APIError('Chỉ hỗ trợ nạp tiền VND', 400);
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new APIError('Không tìm thấy người dùng', 404);
  }

  if (paymentMethod === 'qr_code') {
    const bankId = process.env.PAYMENT_BANK_ID;
    const accountNumber = process.env.PAYMENT_ACCOUNT_NUMBER;
    const accountName = process.env.PAYMENT_ACCOUNT_NAME;
    if (!bankId || !accountNumber || !accountName) {
      throw new APIError('Thiếu cấu hình thanh toán realtime (PAYMENT_BANK_ID/PAYMENT_ACCOUNT_NUMBER/PAYMENT_ACCOUNT_NAME)', 500);
    }
  }

  // Tạo transaction
  const transaction = new Transaction({
    transactionCode: await Transaction.generateTransactionCode('topup'),
    userId: req.user._id,
    type: 'topup',
    amount,
    currency,
    status: 'pending',
    paymentMethod,
    description: `Nạp ${amount.toLocaleString('vi-VN')} VND`,
    // Hết hạn sau 24 giờ
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  await transaction.save();

  // Tạo QR code theo cấu hình runtime (realtime, không hard-code demo)
  let qrCodeData = null;
  if (paymentMethod === 'qr_code') {
    const bankId = process.env.PAYMENT_BANK_ID;
    const accountNumber = process.env.PAYMENT_ACCOUNT_NUMBER;
    const accountName = process.env.PAYMENT_ACCOUNT_NAME;
    if (!bankId || !accountNumber || !accountName) {
      throw new APIError('Thiếu cấu hình thanh toán realtime (PAYMENT_BANK_ID/PAYMENT_ACCOUNT_NUMBER/PAYMENT_ACCOUNT_NAME)', 500);
    }

    const bankInfo = {
      bankId,
      accountNumber,
      accountName,
      amount: amount,
      description: `TOPUP ${transaction.transactionCode}`
    };
    
    const qrContent = JSON.stringify(bankInfo);
    qrCodeData = await QRCode.toDataURL(qrContent);
    
    transaction.qrCodeUrl = qrCodeData;
    transaction.bankInfo = {
      bankName: bankInfo.bankId,
      accountNumber: bankInfo.accountNumber,
      accountName: bankInfo.accountName,
      transferContent: bankInfo.description
    };
    
    await transaction.save();
  }

  // Log
  await Log.createLog({
    type: 'payment',
    level: 'info',
    message: `Yêu cầu nạp tiền: ${transaction.transactionCode}`,
    userId: req.user._id,
    targetId: transaction._id.toString(),
    targetType: 'transaction',
    details: { amount, currency, paymentMethod }
  });

  res.status(201).json({
    success: true,
    message: 'Tạo yêu cầu nạp tiền thành công',
    data: {
      transaction,
      qrCode: qrCodeData,
      bankInfo: transaction.bankInfo
    }
  });
});

/**
 * Xác nhận thanh toán (Webhook từ payment provider)
 * POST /api/payments/webhook
 */
export const paymentWebhook = catchAsync(async (req, res) => {
  const { transactionCode, status, providerData } = req.body;

  // Verify webhook signature theo secret chia sẻ
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (process.env.NODE_ENV === 'production' && !webhookSecret) {
    throw new APIError('Thiếu cấu hình PAYMENT_WEBHOOK_SECRET trong production', 500);
  }
  if (webhookSecret) {
    const incoming = req.headers['x-webhook-secret'];
    if (!incoming || incoming !== webhookSecret) {
      throw new APIError('Webhook signature không hợp lệ', 401);
    }
  }

  const transaction = await Transaction.findOne({ transactionCode });
  if (!transaction) {
    throw new APIError('Không tìm thấy giao dịch', 404);
  }

  if (transaction.status !== 'pending') {
    return res.json({ success: true, message: 'Giao dịch đã được xử lý' });
  }

  // Cập nhật thông tin từ provider
  await transaction.updateProviderInfo(providerData);

  if (status === 'success') {
    // Hoàn thành giao dịch
    await transaction.complete();

    // Cộng tiền vào tài khoản user
    const user = await User.findById(transaction.userId);
    
    // Quy đổi VND sang Gem (ví dụ: 1000 VND = 1 Gem)
    const gemAmount = Math.floor(transaction.amount / 1000);
    await user.addGem(gemAmount);

    // Log
    await Log.createLog({
      type: 'payment',
      level: 'info',
      message: `Nạp tiền thành công: ${transactionCode}`,
      userId: transaction.userId,
      targetId: transaction._id.toString(),
      details: { amount: transaction.amount, gemReceived: gemAmount }
    });

    logger.info(`Payment success: ${transactionCode}, User: ${user.email}, Amount: ${transaction.amount}`);
  } else if (status === 'failed') {
    await transaction.fail(providerData?.failureReason || 'Thanh toán thất bại');
    
    logger.warn(`Payment failed: ${transactionCode}`);
  }

  res.json({ success: true });
});

/**
 * Lấy lịch sử giao dịch của user
 * GET /api/payments/history
 */
export const getTransactionHistory = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    type,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = { userId: req.user._id };
  if (type) query.type = type;
  if (status) query.status = status;

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('orderId', 'orderCode packageName')
      .lean(),
    Transaction.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: transactions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Lấy chi tiết giao dịch
 * GET /api/payments/:transactionCode
 */
export const getTransactionByCode = catchAsync(async (req, res) => {
  const { transactionCode } = req.params;

  const transaction = await Transaction.findOne({ transactionCode })
    .populate('orderId', 'orderCode packageName status')
    .populate('processedBy', 'username');

  if (!transaction) {
    throw new APIError('Không tìm thấy giao dịch', 404);
  }

  // Kiểm tra quyền xem
  if (transaction.userId.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin') {
    throw new APIError('Không có quyền xem giao dịch này', 403);
  }

  res.json({
    success: true,
    data: transaction
  });
});

/**
 * Kiểm tra trạng thái thanh toán
 * GET /api/payments/:transactionCode/status
 */
export const checkPaymentStatus = catchAsync(async (req, res) => {
  const { transactionCode } = req.params;

  const transaction = await Transaction.findOne({ 
    transactionCode,
    userId: req.user._id 
  });

  if (!transaction) {
    throw new APIError('Không tìm thấy giao dịch', 404);
  }

  res.json({
    success: true,
    data: {
      status: transaction.status,
      isPending: transaction.isPending,
      isExpired: transaction.isExpired,
      expiresAt: transaction.expiresAt,
      completedAt: transaction.processedAt
    }
  });
});

/**
 * Hủy giao dịch đang pending
 * PUT /api/payments/:transactionCode/cancel
 */
export const cancelTransaction = catchAsync(async (req, res) => {
  const { transactionCode } = req.params;

  const transaction = await Transaction.findOne({
    transactionCode,
    userId: req.user._id
  });

  if (!transaction) {
    throw new APIError('Không tìm thấy giao dịch', 404);
  }

  if (transaction.status !== 'pending') {
    throw new APIError('Chỉ có thể hủy giao dịch đang chờ xử lý', 400);
  }

  await transaction.cancel('Người dùng hủy');

  // Log
  await Log.createLog({
    type: 'payment',
    level: 'info',
    message: `Giao dịch bị hủy: ${transactionCode}`,
    userId: req.user._id,
    targetId: transaction._id.toString()
  });

  res.json({
    success: true,
    message: 'Đã hủy giao dịch',
    data: transaction
  });
});

// ==================== ADMIN CONTROLLERS ====================

/**
 * Lấy tất cả giao dịch (Admin)
 * GET /api/admin/payments
 */
export const getAllTransactions = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    type,
    status,
    search,
    startDate,
    endDate
  } = req.query;

  const query = {};
  if (type) query.type = type;
  if (status) query.status = status;
  
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  if (search) {
    query.$or = [
      { transactionCode: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username email')
      .populate('processedBy', 'username')
      .lean(),
    Transaction.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: transactions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Cập nhật/xác nhận giao dịch thủ công (Admin)
 * PUT /api/admin/payments/:transactionCode
 */
export const updateTransaction = catchAsync(async (req, res) => {
  const { transactionCode } = req.params;
  const { status, note } = req.body;

  const transaction = await Transaction.findOne({ transactionCode });
  if (!transaction) {
    throw new APIError('Không tìm thấy giao dịch', 404);
  }

  if (status === 'success' && transaction.status === 'pending') {
    await transaction.complete(req.user._id);

    // Cộng tiền cho user
    const user = await User.findById(transaction.userId);
    const gemAmount = Math.floor(transaction.amount / 1000);
    await user.addGem(gemAmount);
  } else if (status === 'failed') {
    await transaction.fail(note || 'Admin từ chối');
  } else if (status === 'cancelled') {
    await transaction.cancel(note || 'Admin hủy');
  }

  // Log
  await Log.createLog({
    type: 'admin',
    level: 'info',
    message: `Admin cập nhật giao dịch: ${transactionCode} -> ${status}`,
    userId: req.user._id,
    targetId: transaction._id.toString(),
    targetType: 'transaction',
    details: { newStatus: status, note }
  });

  res.json({
    success: true,
    message: 'Cập nhật giao dịch thành công',
    data: transaction
  });
});

/**
 * Thống kê giao dịch (Admin)
 * GET /api/admin/payments/stats
 */
export const getPaymentStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const stats = await Transaction.getStatistics(startDate, endDate);

  // Tính tổng
  const totals = stats.reduce((acc, item) => {
    acc.totalAmount += item.totalAmount || 0;
    acc.totalCount += item.count;
    return acc;
  }, { totalAmount: 0, totalCount: 0 });

  res.json({
    success: true,
    data: {
      byType: stats,
      ...totals
    }
  });
});
