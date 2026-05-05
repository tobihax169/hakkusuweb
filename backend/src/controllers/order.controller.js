import Order from '../models/Order.js';
import ServicePackage from '../models/ServicePackage.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { catchAsync, APIError } from '../middleware/errorHandler.js';
import Log from '../models/Log.js';

const releaseEscrowToSeller = async (order, actorId) => {
  if (!order.isMarketplaceOrder || !order.sellerId || order.sellerPaymentStatus !== 'hold') return;

  const seller = await User.findById(order.sellerId);
  if (!seller || seller.role !== 'seller') return;

  seller.sellerInfo.pendingBalance = Math.max(0, (seller.sellerInfo.pendingBalance || 0) - order.sellerAmount);
  seller.sellerInfo.availableBalance = (seller.sellerInfo.availableBalance || 0) + order.sellerAmount;
  await seller.save();

  const releaseTransaction = new Transaction({
    transactionCode: await Transaction.generateTransactionCode('bonus'),
    userId: seller._id,
    type: 'bonus',
    amount: order.sellerAmount,
    currency: order.currency,
    status: 'success',
    orderId: order._id,
    description: `Giải ngân escrow đơn ${order.orderCode}`
  });
  await releaseTransaction.save();

  order.sellerPaymentStatus = 'paid';
  order.sellerPaidAt = new Date();
  order.sellerPaymentTransactionId = releaseTransaction._id;
  await order.save();
};

const reverseEscrowForCancelledOrder = async (order) => {
  if (!order.isMarketplaceOrder || !order.sellerId) return;

  const seller = await User.findById(order.sellerId);
  if (!seller || seller.role !== 'seller') return;

  if (order.sellerPaymentStatus === 'hold') {
    seller.sellerInfo.pendingBalance = Math.max(0, (seller.sellerInfo.pendingBalance || 0) - order.sellerAmount);
  } else if (order.sellerPaymentStatus === 'paid') {
    const remaining = Math.max(0, order.sellerAmount - (seller.sellerInfo.availableBalance || 0));
    seller.sellerInfo.availableBalance = Math.max(0, (seller.sellerInfo.availableBalance || 0) - order.sellerAmount);
    if (remaining > 0) {
      seller.sellerInfo.pendingBalance = Math.max(0, (seller.sellerInfo.pendingBalance || 0) - remaining);
    }
  }

  seller.sellerInfo.totalSales = Math.max(0, (seller.sellerInfo.totalSales || 0) - 1);
  await seller.save();

  order.sellerPaymentStatus = 'pending';
  order.sellerPaidAt = null;
  await order.save();
};

/**
 * Lấy danh sách đơn hàng của user hiện tại
 * GET /api/orders
 */
export const getMyOrders = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = { userId: req.user._id };
  if (status) query.status = status;

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Order.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Lấy chi tiết đơn hàng
 * GET /api/orders/:id
 */
export const getOrderById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('userId', 'username email discordUsername')
    .populate('assignedTo', 'username email')
    .populate('statusHistory.changedBy', 'username');

  if (!order) {
    throw new APIError('Không tìm thấy đơn hàng', 404);
  }

  // Kiểm tra quyền xem
  if (order.userId._id.toString() !== req.user._id.toString() && 
      !['admin', 'support'].includes(req.user.role)) {
    throw new APIError('Không có quyền xem đơn hàng này', 403);
  }

  res.json({
    success: true,
    data: order
  });
});

/**
 * Tạo đơn hàng mới
 * POST /api/orders
 */
export const createOrder = catchAsync(async (req, res) => {
  const {
    packageId,
    requirements,
    description,
    discordServerId,
    discordServerName,
    discordInviteLink,
    paymentMethod
  } = req.body;

  // Kiểm tra gói dịch vụ
  const servicePackage = await ServicePackage.findOne({
    packageId,
    isActive: true,
    approvalStatus: 'approved'
  });
  if (!servicePackage) {
    throw new APIError('Gói dịch vụ không tồn tại hoặc đã bị vô hiệu hóa', 400);
  }

  if (servicePackage.isMarketplaceItem && servicePackage.sellerId) {
    const seller = await User.findById(servicePackage.sellerId).select('role sellerInfo.compliance');
    if (!seller || seller.role !== 'seller') {
      throw new APIError('Seller không hợp lệ cho sản phẩm marketplace', 400);
    }

    const isHighValueAccount = Boolean(servicePackage.isAccountListing) && Number(servicePackage.price) >= Number(servicePackage.highValueThreshold || 5000000);
    const hasVerifiedIdentity = Boolean(seller?.sellerInfo?.compliance?.identityVerified);
    const depositAmount = Number(seller?.sellerInfo?.compliance?.securityDeposit || 0);
    if (isHighValueAccount && !hasVerifiedIdentity && depositAmount < Number(servicePackage.price) * 0.2) {
      throw new APIError('Sản phẩm tạm khóa giao dịch: seller chưa đạt điều kiện CCCD/đặt cọc cho account giá trị cao', 403);
    }
  }

  // Tính giá (có thể thêm discount logic sau)
  const basePrice = servicePackage.price;
  const discountAmount = 0;
  const totalPrice = basePrice - discountAmount;

  // Tính phí cho marketplace (nếu là sản phẩm của seller)
  let sellerId = null;
  let isMarketplaceOrder = false;
  let platformFee = 0;
  let platformFeePercentage = 30;
  let sellerAmount = 0;

  if (servicePackage.isMarketplaceItem && servicePackage.sellerId) {
    sellerId = servicePackage.sellerId;
    isMarketplaceOrder = true;
    platformFeePercentage = servicePackage.platformFeePercentage || 30;
    platformFee = Math.round(totalPrice * (platformFeePercentage / 100));
    sellerAmount = totalPrice - platformFee;
  }

  // Tạo mã đơn hàng
  const orderCode = await Order.generateOrderCode();

  // Tạo đơn hàng
  const order = new Order({
    orderCode,
    userId: req.user._id,
    packageId: servicePackage.packageId,
    packageName: servicePackage.name,
    packageNameEn: servicePackage.nameEn,
    requirements: requirements || [],
    description: description || '',
    discordServerId,
    discordServerName,
    discordInviteLink,
    basePrice,
    discountAmount,
    totalPrice,
    currency: servicePackage.currency,
    paymentMethod,
    paymentStatus: paymentMethod === 'wallet' ? 'pending' : 'pending',
    status: 'pending',
    // Marketplace info
    sellerId,
    isMarketplaceOrder,
    platformFee,
    platformFeePercentage,
    sellerAmount,
    statusHistory: [{
      status: 'pending',
      changedBy: req.user._id,
      note: 'Đơn hàng được tạo'
    }]
  });

  await order.save();

  // Log
  await Log.createLog({
    type: 'order',
    level: 'info',
    message: `Đơn hàng mới được tạo: ${orderCode}`,
    userId: req.user._id,
    targetId: order._id.toString(),
    targetType: 'order',
    details: { packageId, totalPrice }
  });

  res.status(201).json({
    success: true,
    message: 'Đơn hàng đã được tạo',
    data: order
  });
});

/**
 * Thanh toán đơn hàng bằng ví (Gem/Coin)
 * POST /api/orders/:id/pay
 */
export const payWithWallet = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { currency: payCurrency } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new APIError('Không tìm thấy đơn hàng', 404);
  }

  // Kiểm tra quyền
  if (order.userId.toString() !== req.user._id.toString()) {
    throw new APIError('Không có quyền thanh toán đơn hàng này', 403);
  }

  // Kiểm tra trạng thái
  if (order.paymentStatus === 'paid') {
    throw new APIError('Đơn hàng đã được thanh toán', 400);
  }

  if (order.status === 'cancelled') {
    throw new APIError('Đơn hàng đã bị hủy', 400);
  }

  const user = await User.findById(req.user._id);
  let amountToDeduct = order.totalPrice;
  let transactionCurrency = 'gem';

  // Quy đổi giá sang Gem nếu cần
  if (order.currency === 'vnd') {
    // Giả sử 1000 VND = 1 Gem
    amountToDeduct = Math.ceil(order.totalPrice / 1000);
  }

  // Kiểm tra số dư
  if (payCurrency === 'coin') {
    // Quy đổi Coin sang Gem: 1 Coin = 10 Gem
    const gemEquivalent = amountToDeduct / 10;
    if (user.coin < gemEquivalent) {
      throw new APIError('Số dư Coin không đủ', 400);
    }
    await user.deductCoin(gemEquivalent);
    transactionCurrency = 'coin';
  } else {
    if (user.gem < amountToDeduct) {
      throw new APIError('Số dư Gem không đủ', 400);
    }
    await user.deductGem(amountToDeduct);
  }

  // Tạo transaction
  const transaction = new Transaction({
    transactionCode: await Transaction.generateTransactionCode('payment'),
    userId: req.user._id,
    type: 'payment',
    amount: amountToDeduct,
    currency: transactionCurrency,
    status: 'success',
    orderId: order._id,
    orderCode: order.orderCode,
    description: `Thanh toán đơn hàng ${order.orderCode}`
  });

  await transaction.save();

  // Cập nhật đơn hàng
  await order.markAsPaid(transaction._id);

  // Nếu là marketplace order, cộng tiền cho seller
  if (order.isMarketplaceOrder && order.sellerId) {
    const seller = await User.findById(order.sellerId);
    if (seller && seller.role === 'seller') {
      seller.sellerInfo.pendingBalance += order.sellerAmount;
      seller.sellerInfo.totalSales += 1;
      await seller.save();

      // Tạo transaction escrow giữ tiền seller
      const escrowTransaction = new Transaction({
        transactionCode: await Transaction.generateTransactionCode('bonus'),
        userId: seller._id,
        type: 'bonus',
        amount: order.sellerAmount,
        currency: order.currency,
        status: 'pending',
        orderId: order._id,
        description: `Escrow giữ tiền đơn ${order.orderCode} (sau phí ${order.platformFeePercentage}%)`
      });
      await escrowTransaction.save();

      order.sellerPaymentStatus = 'hold';
      order.sellerPaymentTransactionId = escrowTransaction._id;
      await order.save();

      // Cập nhật sản phẩm
      await ServicePackage.updateOne(
        { packageId: order.packageId },
        { $inc: { salesCount: 1, totalRevenue: order.sellerAmount } }
      );
    }
  }

  // Log
  await Log.createLog({
    type: 'payment',
    level: 'info',
    message: `Thanh toán thành công: ${order.orderCode}`,
    userId: req.user._id,
    targetId: order._id.toString(),
    targetType: 'order',
    details: { amount: amountToDeduct, currency: transactionCurrency }
  });

  res.json({
    success: true,
    message: 'Thanh toán thành công',
    data: {
      order,
      transaction,
      remainingGem: user.gem,
      remainingCoin: user.coin
    }
  });
});

/**
 * Hủy đơn hàng
 * PUT /api/orders/:id/cancel
 */
export const cancelOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new APIError('Không tìm thấy đơn hàng', 404);
  }

  // Kiểm tra quyền (chủ đơn hoặc admin/support)
  const isOwner = order.userId.toString() === req.user._id.toString();
  const isStaff = ['admin', 'support'].includes(req.user.role);

  if (!isOwner && !isStaff) {
    throw new APIError('Không có quyền hủy đơn hàng này', 403);
  }

  // Kiểm tra có thể hủy
  if (!order.canCancel) {
    throw new APIError('Không thể hủy đơn hàng ở trạng thái này', 400);
  }

  // Hoàn tiền nếu đã thanh toán
  if (order.paymentStatus === 'paid') {
    const user = await User.findById(order.userId);
    
    // Quy đổi lại
    let refundAmount = order.totalPrice;
    if (order.currency === 'vnd') {
      refundAmount = Math.ceil(order.totalPrice / 1000);
    }

    await user.addGem(refundAmount);

    // Tạo transaction hoàn tiền
    const refundTransaction = new Transaction({
      transactionCode: await Transaction.generateTransactionCode('refund'),
      userId: order.userId,
      type: 'refund',
      amount: refundAmount,
      currency: 'gem',
      status: 'success',
      orderId: order._id,
      description: `Hoàn tiền đơn hàng ${order.orderCode} - Đã hủy`
    });

    await refundTransaction.save();
    order.paymentStatus = 'refunded';
  }

  await reverseEscrowForCancelledOrder(order);

  // Cập nhật trạng thái
  await order.changeStatus('cancelled', req.user._id, reason || 'Người dùng hủy đơn');

  // Log
  await Log.createLog({
    type: 'order',
    level: 'warn',
    message: `Đơn hàng bị hủy: ${order.orderCode}`,
    userId: req.user._id,
    targetId: order._id.toString(),
    targetType: 'order',
    details: { reason, cancelledBy: isOwner ? 'user' : 'staff' }
  });

  res.json({
    success: true,
    message: 'Đã hủy đơn hàng',
    data: order
  });
});

/**
 * Đánh giá đơn hàng
 * PUT /api/orders/:id/review
 */
export const reviewOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new APIError('Không tìm thấy đơn hàng', 404);
  }

  // Chỉ chủ đơn mới đánh giá được
  if (order.userId.toString() !== req.user._id.toString()) {
    throw new APIError('Không có quyền đánh giá đơn hàng này', 403);
  }

  // Chỉ đánh giá đơn hoàn thành
  if (order.status !== 'completed') {
    throw new APIError('Chỉ có thể đánh giá đơn hàng đã hoàn thành', 400);
  }

  // Chỉ đánh giá 1 lần
  if (order.rating) {
    throw new APIError('Đơn hàng đã được đánh giá', 400);
  }

  await order.addReview(rating, review);

  // Log
  await Log.createLog({
    type: 'order',
    level: 'info',
    message: `Đơn hàng được đánh giá: ${order.orderCode}`,
    userId: req.user._id,
    targetId: order._id.toString(),
    details: { rating, review }
  });

  res.json({
    success: true,
    message: 'Đánh giá thành công',
    data: order
  });
});

// ==================== ADMIN CONTROLLERS ====================

/**
 * Lấy tất cả đơn hàng (Admin/Support)
 * GET /api/admin/orders
 */
export const getAllOrders = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    paymentStatus,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (search) {
    query.$or = [
      { orderCode: { $regex: search, $options: 'i' } },
      { packageName: { $regex: search, $options: 'i' } }
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username email discordUsername')
      .populate('assignedTo', 'username')
      .lean(),
    Order.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Cập nhật đơn hàng (Admin/Support)
 * PUT /api/admin/orders/:id
 */
export const updateOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new APIError('Không tìm thấy đơn hàng', 404);
  }

  // Cập nhật các trường cho phép
  const allowedUpdates = [
    'status', 'paymentStatus', 'assignedTo', 
    'estimatedCompletionDate', 'internalNotes', 'discountAmount'
  ];

  const nextStatus = updates.status;
  const hasStatusChange = nextStatus && nextStatus !== order.status;

  allowedUpdates.forEach(field => {
    if (field !== 'status' && updates[field] !== undefined) {
      order[field] = updates[field];
    }
  });

  if (hasStatusChange) {
    await order.changeStatus(nextStatus, req.user._id, updates.statusNote || 'Cập nhật bởi admin');
  } else {
    await order.save();
  }

  if (hasStatusChange && nextStatus === 'completed' && order.paymentStatus === 'paid') {
    await releaseEscrowToSeller(order, req.user._id);
  }
  if (hasStatusChange && ['cancelled', 'refunded'].includes(nextStatus)) {
    await reverseEscrowForCancelledOrder(order);
  }

  // Log
  await Log.createLog({
    type: 'admin',
    level: 'info',
    message: `Admin cập nhật đơn hàng: ${order.orderCode}`,
    userId: req.user._id,
    targetId: order._id.toString(),
    targetType: 'order',
    details: updates
  });

  res.json({
    success: true,
    message: 'Cập nhật đơn hàng thành công',
    data: order
  });
});

/**
 * Thống kê đơn hàng (Admin)
 * GET /api/admin/orders/stats
 */
export const getOrderStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const stats = await Order.getStatistics(startDate, endDate);

  // Tính tổng doanh thu
  const totalRevenue = stats.reduce((sum, item) => sum + (item.totalRevenue || 0), 0);
  const totalOrders = stats.reduce((sum, item) => sum + item.count, 0);

  res.json({
    success: true,
    data: {
      byStatus: stats,
      totalRevenue,
      totalOrders
    }
  });
});
