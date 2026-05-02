import { sepayService } from '../services/sepay.service.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { catchAsync, APIError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import Log from '../models/Log.js';

/**
 * Tạo yêu cầu nạp tiền qua SePay
 * POST /api/payments/sepay/topup
 */
export const createSePayTopup = catchAsync(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount < 10000) {
    throw new APIError('Số tiền tối thiểu là 10,000 VND', 400);
  }

  if (amount > 100000000) {
    throw new APIError('Số tiền tối đa là 100,000,000 VND', 400);
  }

  const user = await User.findById(req.user._id);

  // Tạo transaction
  const transaction = new Transaction({
    transactionCode: await Transaction.generateTransactionCode('topup'),
    userId: req.user._id,
    type: 'topup',
    amount,
    currency: 'vnd',
    status: 'pending',
    paymentMethod: 'qr_code',
    paymentProvider: 'sepay',
    description: `Nạp ${amount.toLocaleString('vi-VN')} VND qua SePay`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  await transaction.save();

  // Tạo QR code qua SePay
  const qrResult = await sepayService.createQRCode({
    amount,
    content: `TOPUP ${transaction.transactionCode}`,
    transactionCode: transaction.transactionCode
  });

  if (!qrResult.success) {
    throw new APIError('Không thể tạo mã QR thanh toán', 500);
  }

  // Cập nhật transaction với thông tin QR
  transaction.qrCodeUrl = qrResult.qrCodeUrl;
  transaction.bankInfo = {
    bankName: sepayService.bankId,
    accountNumber: sepayService.accountNumber,
    accountName: sepayService.accountName,
    transferContent: `TOPUP ${transaction.transactionCode}`
  };
  transaction.providerMetadata = {
    sepayTransactionId: qrResult.transactionId,
    deeplink: qrResult.deeplink,
    isVietQR: qrResult.isVietQR || false,
    expiresAt: qrResult.expiresAt
  };

  await transaction.save();

  // Log
  await Log.createLog({
    type: 'payment',
    level: 'info',
    message: `Tạo yêu cầu nạp tiền SePay: ${transaction.transactionCode}`,
    userId: req.user._id,
    targetId: transaction._id.toString(),
    targetType: 'transaction',
    details: { amount, qrGenerated: true }
  });

  res.status(201).json({
    success: true,
    message: 'Tạo yêu cầu nạp tiền thành công',
    data: {
      transaction: {
        id: transaction._id,
        transactionCode: transaction.transactionCode,
        amount: transaction.amount,
        status: transaction.status,
        expiresAt: transaction.expiresAt
      },
      payment: {
        qrCodeUrl: qrResult.qrCodeUrl,
        qrCodeData: qrResult.qrCodeData,
        deeplink: qrResult.deeplink,
        bankInfo: transaction.bankInfo,
        isVietQR: qrResult.isVietQR || false
      }
    }
  });
});

/**
 * Webhook nhận thông báo từ SePay
 * POST /api/payments/sepay/webhook
 */
export const sepayWebhook = catchAsync(async (req, res) => {
  const payload = req.body;
  const signature = req.headers['x-sepay-signature'] || req.headers['x-webhook-signature'];

  logger.info('SePay webhook received:', { payload: JSON.stringify(payload), signature: signature ? 'present' : 'missing' });

  // Xác minh chữ ký (trong production)
  if (process.env.NODE_ENV === 'production') {
    const isValid = sepayService.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      logger.warn('SePay webhook: Invalid signature');
      throw new APIError('Invalid signature', 401);
    }
  }

  // Xử lý webhook
  const result = await sepayService.processWebhook(payload);

  if (!result.success || !result.transactionCode) {
    // Không tìm thấy giao dịch cần xử lý, vẫn trả về 200 để SePay không retry
    return res.json({ success: true, message: result.message || 'Ignored' });
  }

  // Tìm transaction
  const transaction = await Transaction.findOne({
    transactionCode: result.transactionCode,
    status: 'pending'
  });

  if (!transaction) {
    logger.warn(`SePay webhook: Transaction not found or not pending: ${result.transactionCode}`);
    return res.json({ success: true, message: 'Transaction not found or already processed' });
  }

  // Kiểm tra số tiền
  if (result.amount < transaction.amount) {
    logger.warn(`SePay webhook: Amount mismatch. Expected: ${transaction.amount}, Received: ${result.amount}`);
    // Vẫn xử lý nhưng ghi chú lại
    transaction.internalNote = `Số tiền không khớp: Nhận ${result.amount}, cần ${transaction.amount}`;
  }

  // Hoàn thành giao dịch
  await transaction.complete();

  // Cập nhật provider info
  await transaction.updateProviderInfo({
    providerTransactionId: result.providerTransactionId,
    providerReference: result.providerReference,
    receivedAmount: result.amount,
    ...result.providerData
  });

  // Cộng tiền vào tài khoản user
  const user = await User.findById(transaction.userId);
  const gemAmount = Math.floor(transaction.amount / 1000); // 1000 VND = 1 Gem
  await user.addGem(gemAmount);

  // Log
  await Log.createLog({
    type: 'payment',
    level: 'info',
    message: `Nạp tiền SePay thành công: ${result.transactionCode}`,
    userId: transaction.userId,
    targetId: transaction._id.toString(),
    details: {
      amount: transaction.amount,
      gemReceived: gemAmount,
      providerTransactionId: result.providerTransactionId
    }
  });

  logger.info(`SePay payment success: ${result.transactionCode}, User: ${user.email}, Amount: ${transaction.amount}`);

  res.json({
    success: true,
    message: 'Payment processed successfully',
    data: {
      transactionCode: result.transactionCode,
      amount: result.amount,
      gemReceived: gemAmount
    }
  });
});

/**
 * Kiểm tra trạng thái giao dịch SePay
 * GET /api/payments/sepay/:transactionCode/status
 */
export const checkSePayStatus = catchAsync(async (req, res) => {
  const { transactionCode } = req.params;

  const transaction = await Transaction.findOne({
    transactionCode,
    userId: req.user._id,
    paymentProvider: 'sepay'
  });

  if (!transaction) {
    throw new APIError('Không tìm thấy giao dịch', 404);
  }

  // Query từ SePay nếu đang pending
  let providerStatus = null;
  if (transaction.status === 'pending' && transaction.providerMetadata?.sepayTransactionId) {
    const queryResult = await sepayService.queryTransaction(
      transaction.providerMetadata.sepayTransactionId
    );
    providerStatus = queryResult.success ? queryResult.status : null;
  }

  res.json({
    success: true,
    data: {
      transactionCode: transaction.transactionCode,
      status: transaction.status,
      providerStatus,
      amount: transaction.amount,
      isPending: transaction.isPending,
      isExpired: transaction.isExpired,
      expiresAt: transaction.expiresAt,
      completedAt: transaction.processedAt
    }
  });
});

/**
 * Lấy thông tin cấu hình SePay (cho frontend)
 * GET /api/payments/sepay/config
 */
export const getSePayConfig = catchAsync(async (req, res) => {
  // Chỉ trả về thông tin công khai
  res.json({
    success: true,
    data: {
      bankId: sepayService.bankId,
      accountNumber: sepayService.accountNumber,
      accountName: sepayService.accountName,
      minAmount: 10000,
      maxAmount: 100000000,
      supportedBanks: await sepayService.getSupportedBanks()
    }
  });
});

/**
 * Hủy giao dịch SePay
 * PUT /api/payments/sepay/:transactionCode/cancel
 */
export const cancelSePayTransaction = catchAsync(async (req, res) => {
  const { transactionCode } = req.params;

  const transaction = await Transaction.findOne({
    transactionCode,
    userId: req.user._id,
    paymentProvider: 'sepay'
  });

  if (!transaction) {
    throw new APIError('Không tìm thấy giao dịch', 404);
  }

  if (transaction.status !== 'pending') {
    throw new APIError('Chỉ có thể hủy giao dịch đang chờ xử lý', 400);
  }

  await transaction.cancel('Người dùng hủy qua SePay');

  await Log.createLog({
    type: 'payment',
    level: 'info',
    message: `Hủy giao dịch SePay: ${transactionCode}`,
    userId: req.user._id,
    targetId: transaction._id.toString()
  });

  res.json({
    success: true,
    message: 'Đã hủy giao dịch',
    data: transaction
  });
});

/**
 * Lấy lịch sử giao dịch SePay
 * GET /api/payments/sepay/history
 */
export const getSePayHistory = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const query = {
    userId: req.user._id,
    paymentProvider: 'sepay'
  };

  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
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

// ==================== ADMIN CONTROLLERS ====================

/**
 * Lấy tất cả giao dịch SePay (Admin)
 * GET /api/admin/payments/sepay
 */
export const getAllSePayTransactions = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, search, startDate, endDate } = req.query;

  const query = { paymentProvider: 'sepay' };

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
 * Thống kê giao dịch SePay (Admin)
 * GET /api/admin/payments/sepay/stats
 */
export const getSePayStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchStage = {
    paymentProvider: 'sepay',
    status: 'success'
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const stats = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalCount: { $sum: 1 },
        averageAmount: { $avg: '$amount' }
      }
    }
  ]);

  const statusStats = await Transaction.aggregate([
    {
      $match: {
        paymentProvider: 'sepay',
        ...(startDate && endDate ? { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {})
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        amount: { $sum: '$amount' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      summary: stats[0] || { totalAmount: 0, totalCount: 0, averageAmount: 0 },
      byStatus: statusStats
    }
  });
});
