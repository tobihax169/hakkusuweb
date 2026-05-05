import { User, ServicePackage, Order, Withdrawal, Transaction } from '../models/index.js';
import ShopMessage from '../models/ShopMessage.js';
import { catchAsync, APIError } from '../middleware/errorHandler.js';
import {
  normalizeCategoryForStore,
  isAccountLikeCategory,
  sanitizeImageUrls
} from '../constants/productCategories.js';

// ==================== SELLER REGISTRATION ====================

// Đăng ký làm seller
export const registerAsSeller = catchAsync(async (req, res) => {
  const businessName = req.body.businessName ?? req.body.storeName;
  const businessEmail = req.body.businessEmail ?? req.body.email;
  const { phone, description } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new APIError('Không tìm thấy người dùng', 404);
  }

  if (user.role === 'seller') {
    throw new APIError('Bạn đã là seller rồi', 400);
  }

  // Cập nhật thông tin seller
  user.role = 'seller';
  user.sellerInfo = {
    businessName: businessName || user.username,
    businessEmail: businessEmail || user.email,
    phone: phone || '',
    description: description || '',
    isVerified: false,
    totalEarnings: 0,
    availableBalance: 0,
    pendingBalance: 0,
    totalSales: 0
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Đăng ký seller thành công. Vui lòng chờ admin phê duyệt.',
    data: {
      sellerInfo: user.sellerInfo
    }
  });
});

// Lấy thông tin seller dashboard
export const getSellerDashboard = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Thống kê sản phẩm
  const products = await ServicePackage.countDocuments({ 
    sellerId: userId,
    isActive: true,
    approvalStatus: 'approved'
  });

  const pendingProducts = await ServicePackage.countDocuments({
    sellerId: userId,
    approvalStatus: 'pending'
  });

  // Thống kê đơn hàng
  const orders = await Order.find({ sellerId: userId });
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.sellerAmount, 0);

  // Thống kê rút tiền
  const withdrawalStats = await Withdrawal.aggregate([
    { $match: { sellerId: userId } },
    {
      $group: {
        _id: '$status',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const user = await User.findById(userId);

  const recentOrderDocs = await Order.find({ sellerId: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'username email');

  const recentOrders = recentOrderDocs.map((o) => ({
    _id: o._id,
    orderCode: o.orderCode,
    productName: o.packageName,
    buyer: o.userId,
    totalPrice: o.totalPrice,
    status: o.status
  }));

  const viewsAgg = await ServicePackage.aggregate([
    { $match: { sellerId: userId } },
    { $group: { _id: null, totalSales: { $sum: '$salesCount' } } }
  ]);
  const viewsTotal = viewsAgg[0]?.totalSales || 0;

  res.status(200).json({
    success: true,
    data: {
      sellerInfo: user.sellerInfo,
      recentOrders,
      stats: {
        products: {
          total: products,
          pending: pendingProducts
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: totalOrders - completedOrders
        },
        revenue: {
          total: totalRevenue,
          available: user.sellerInfo?.availableBalance ?? 0,
          pending: user.sellerInfo?.pendingBalance ?? 0
        },
        withdrawals: withdrawalStats,
        views: viewsTotal
      }
    }
  });
});

// ==================== PRODUCT MANAGEMENT ====================

// Đăng sản phẩm mới
export const createProduct = catchAsync(async (req, res) => {
  const sellerId = req.user._id;
  const seller = await User.findById(sellerId);
  if (!seller) {
    throw new APIError('Không tìm thấy seller', 404);
  }
  const {
    name,
    nameEn,
    description,
    descriptionEn,
    price,
    currency,
    icon,
    iconUrl,
    imageUrls,
    features,
    platformFeePercentage,
    metadata,
    isAccountListing,
    highValueThreshold
  } = req.body;
  const rawCategory = metadata?.category || req.body.category || 'other';
  const normalizedCategory = normalizeCategoryForStore(rawCategory);
  const isAccount = Boolean(
    isAccountListing ||
      metadata?.saleType === 'account' ||
      isAccountLikeCategory(rawCategory) ||
      isAccountLikeCategory(normalizedCategory)
  );
  const gallery = sanitizeImageUrls(imageUrls?.length ? imageUrls : iconUrl ? [iconUrl] : [], 5);
  const resolvedIconUrl = gallery[0] || iconUrl || null;
  const resolvedPrice = Number(price || 0);
  const resolvedThreshold = Number(highValueThreshold || seller?.sellerInfo?.compliance?.highValueLimit || 5000000);
  const isHighValueAccount = isAccount && resolvedPrice >= resolvedThreshold;
  const securityDeposit = seller?.sellerInfo?.compliance?.securityDeposit || 0;
  const identityVerified = Boolean(seller?.sellerInfo?.compliance?.identityVerified);

  if (isHighValueAccount && !identityVerified && securityDeposit < resolvedPrice * 0.2) {
    throw new APIError(
      'Sản phẩm account giá trị cao yêu cầu seller đã xác minh CCCD hoặc có tiền đặt cọc tối thiểu 20% giá trị',
      403
    );
  }

  // Tạo packageId
  const packageId = `SP${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const product = await ServicePackage.create({
    packageId,
    name,
    nameEn,
    description,
    descriptionEn,
    price,
    currency: currency || 'vnd',
    icon: icon || 'CubeIcon',
    iconUrl: resolvedIconUrl,
    imageUrls: gallery,
    category: normalizedCategory,
    isAccountListing: isAccount,
    highValueThreshold: resolvedThreshold,
    features: features || [],
    metadata: metadata && typeof metadata === 'object' ? metadata : {},
    sellerId,
    isMarketplaceItem: true,
    approvalStatus: 'pending', // Chờ admin duyệt
    platformFeePercentage: platformFeePercentage || 30,
    isActive: true,
    createdBy: sellerId
  });

  res.status(201).json({
    success: true,
    message: 'Sản phẩm đã được tạo, chờ admin phê duyệt',
    data: product
  });
});

// Lấy danh sách sản phẩm của seller
export const getSellerProducts = catchAsync(async (req, res) => {
  const sellerId = req.user._id;
  const { status, page = 1, limit = 20 } = req.query;

  const query = { sellerId };
  if (status) {
    query.approvalStatus = status;
  }

  const products = await ServicePackage.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await ServicePackage.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// Chi tiết một sản phẩm của seller
export const getSellerProductById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user._id;

  const product = await ServicePackage.findOne({ _id: id, sellerId });
  if (!product) {
    throw new APIError('Không tìm thấy sản phẩm', 404);
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// Cập nhật sản phẩm
export const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user._id;
  const updates = req.body;
  const seller = await User.findById(sellerId);

  const product = await ServicePackage.findOne({ _id: id, sellerId });
  if (!product) {
    throw new APIError('Không tìm thấy sản phẩm', 404);
  }

  // Không cho phép sửa nếu đang có đơn hàng pending
  const hasPendingOrders = await Order.exists({
    packageId: product.packageId,
    status: { $in: ['pending', 'processing'] }
  });

  if (hasPendingOrders) {
    throw new APIError('Không thể sửa sản phẩm khi có đơn hàng đang xử lý', 400);
  }

  // Reset approval status nếu sửa thông tin quan trọng
  if (updates.price || updates.name || updates.description) {
    updates.approvalStatus = 'pending';
  }
  if (updates.metadata?.category && !updates.category) {
    updates.category = updates.metadata.category;
  }

  const rawNextCat =
    updates.category ||
    product.category ||
    updates.metadata?.category ||
    product.metadata?.category ||
    'other';
  const nextCategory = normalizeCategoryForStore(rawNextCat);
  updates.category = nextCategory;
  const nextIsAccount = Boolean(
    updates.isAccountListing ??
      (isAccountLikeCategory(rawNextCat) || isAccountLikeCategory(nextCategory) || product.isAccountListing)
  );
  updates.isAccountListing = nextIsAccount;

  if (updates.imageUrls !== undefined || updates.iconUrl !== undefined) {
    const gallery = sanitizeImageUrls(
      updates.imageUrls?.length ? updates.imageUrls : updates.iconUrl ? [updates.iconUrl] : product.imageUrls,
      5
    );
    updates.imageUrls = gallery;
    updates.iconUrl = gallery[0] || null;
  }
  const nextPrice = Number(updates.price ?? product.price);
  const nextThreshold = Number(updates.highValueThreshold ?? product.highValueThreshold ?? seller?.sellerInfo?.compliance?.highValueLimit ?? 5000000);
  const nextIsHighValueAccount = Boolean(nextIsAccount) && nextPrice >= nextThreshold;
  const securityDeposit = seller?.sellerInfo?.compliance?.securityDeposit || 0;
  const identityVerified = Boolean(seller?.sellerInfo?.compliance?.identityVerified);
  if (nextIsHighValueAccount && !identityVerified && securityDeposit < nextPrice * 0.2) {
    throw new APIError(
      'Sản phẩm account giá trị cao yêu cầu seller đã xác minh CCCD hoặc có tiền đặt cọc tối thiểu 20% giá trị',
      403
    );
  }

  Object.assign(product, updates);
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Cập nhật sản phẩm thành công',
    data: product
  });
});

// Xóa sản phẩm
export const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user._id;

  const product = await ServicePackage.findOne({ _id: id, sellerId });
  if (!product) {
    throw new APIError('Không tìm thấy sản phẩm', 404);
  }

  // Không cho phép xóa nếu có đơn hàng
  const hasOrders = await Order.exists({ packageId: product.packageId });
  if (hasOrders) {
    throw new APIError('Không thể xóa sản phẩm đã có đơn hàng', 400);
  }

  await ServicePackage.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: 'Xóa sản phẩm thành công'
  });
});

// ==================== ORDERS & EARNINGS ====================

// Hội thoại tin nhắn shop (theo buyer)
export const getShopMessageThreads = catchAsync(async (req, res) => {
  const sellerId = req.user._id;
  const threads = await ShopMessage.aggregate([
    { $match: { sellerId } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$buyerId',
        lastAt: { $first: '$createdAt' },
        preview: { $first: '$body' }
      }
    },
    { $sort: { lastAt: -1 } },
    { $limit: 50 }
  ]);

  const buyerIds = threads.map((t) => t._id);
  const users = await User.find({ _id: { $in: buyerIds } })
    .select('username')
    .lean();
  const nameById = Object.fromEntries(users.map((u) => [u._id.toString(), u.username]));

  res.status(200).json({
    success: true,
    data: threads.map((t) => ({
      buyerId: t._id,
      username: nameById[t._id.toString()] || 'User',
      preview: t.preview,
      lastAt: t.lastAt
    }))
  });
});

// Lấy đơn hàng của seller
export const getSellerOrders = catchAsync(async (req, res) => {
  const sellerId = req.user._id;
  const { status, page = 1, limit = 20 } = req.query;

  const query = { sellerId };
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('userId', 'username email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// Lấy chi tiết thu nhập
export const getEarnings = catchAsync(async (req, res) => {
  const sellerId = req.user._id;
  const { period = 'month' } = req.query;

  const user = await User.findById(sellerId);

  // Thống kê theo thời gian
  const dateFilter = {};
  const now = new Date();
  if (period === 'week') {
    dateFilter.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
  } else if (period === 'month') {
    dateFilter.createdAt = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
  } else if (period === 'year') {
    dateFilter.createdAt = { $gte: new Date(now.getFullYear(), 0, 1) };
  }

  const earnings = await Order.aggregate([
    {
      $match: {
        sellerId: new mongoose.Types.ObjectId(sellerId),
        paymentStatus: 'paid',
        ...dateFilter
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        totalRevenue: { $sum: '$sellerAmount' },
        platformFee: { $sum: '$platformFee' },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalEarnings: user.sellerInfo.totalEarnings,
        availableBalance: user.sellerInfo.availableBalance,
        pendingBalance: user.sellerInfo.pendingBalance,
        totalSales: user.sellerInfo.totalSales
      },
      earnings
    }
  });
});

// ==================== WITHDRAWAL ====================

// Yêu cầu rút tiền
export const requestWithdrawal = catchAsync(async (req, res) => {
  const sellerId = req.user._id;
  const { amount, bankName, bankCode, accountNumber, accountName, note } = req.body;

  const user = await User.findById(sellerId);
  if (!user.sellerInfo.isVerified) {
    throw new APIError('Tài khoản seller chưa được xác minh', 403);
  }

  if (amount > user.sellerInfo.availableBalance) {
    throw new APIError('Số dư không đủ', 400);
  }

  if (amount < 10000) {
    throw new APIError('Số tiền rút tối thiểu là 10,000đ', 400);
  }

  // Tạo withdrawal code
  const withdrawalCode = await Withdrawal.generateWithdrawalCode();

  const withdrawal = await Withdrawal.create({
    withdrawalCode,
    sellerId,
    amount,
    bankInfo: {
      bankName,
      bankCode,
      accountNumber,
      accountName
    },
    note,
    status: 'pending'
  });

  // Giữ tiền trong pending balance
  user.sellerInfo.availableBalance -= amount;
  user.sellerInfo.pendingBalance += amount;
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Yêu cầu rút tiền đã được tạo',
    data: withdrawal
  });
});

// Lấy lịch sử rút tiền
export const getWithdrawals = catchAsync(async (req, res) => {
  const sellerId = req.user._id;
  const { status, page = 1, limit = 20 } = req.query;

  const query = { sellerId };
  if (status) {
    query.status = status;
  }

  const withdrawals = await Withdrawal.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Withdrawal.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      withdrawals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// Hủy yêu cầu rút tiền
export const cancelWithdrawal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user._id;

  const withdrawal = await Withdrawal.findOne({ _id: id, sellerId });
  if (!withdrawal) {
    throw new APIError('Không tìm thấy yêu cầu rút tiền', 404);
  }

  if (withdrawal.status !== 'pending') {
    throw new APIError('Không thể hủy yêu cầu đã xử lý', 400);
  }

  // Hoàn tiền về available balance
  const user = await User.findById(sellerId);
  user.sellerInfo.availableBalance += withdrawal.amount;
  user.sellerInfo.pendingBalance -= withdrawal.amount;
  await user.save();

  withdrawal.status = 'cancelled';
  await withdrawal.save();

  res.status(200).json({
    success: true,
    message: 'Hủy yêu cầu rút tiền thành công'
  });
});

// ==================== ADMIN FUNCTIONS ====================

// Admin: Duyệt seller
export const verifySeller = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const adminId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new APIError('Không tìm thấy người dùng', 404);
  }

  if (user.role !== 'seller') {
    throw new APIError('Người dùng không phải seller', 400);
  }

  user.sellerInfo.isVerified = true;
  user.sellerInfo.verifiedAt = new Date();
  user.sellerInfo.verifiedBy = adminId;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Duyệt seller thành công'
  });
});

// Admin: Từ chối seller
export const rejectSeller = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new APIError('Không tìm thấy người dùng', 404);
  }

  // Reset seller info
  user.role = 'user';
  user.sellerInfo = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Đã từ chối seller: ${reason || 'Không có lý do'}`
  });
});

// Admin: Duyệt sản phẩm
export const approveProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user._id;

  const product = await ServicePackage.findById(id);
  if (!product) {
    throw new APIError('Không tìm thấy sản phẩm', 404);
  }
  if (product.approvalStatus !== 'pending') {
    throw new APIError('Chỉ có thể duyệt sản phẩm đang chờ duyệt', 400);
  }

  product.approvalStatus = 'approved';
  product.approvedBy = adminId;
  product.approvedAt = new Date();
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Duyệt sản phẩm thành công'
  });
});

// Admin: Từ chối sản phẩm
export const rejectProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const product = await ServicePackage.findById(id);
  if (!product) {
    throw new APIError('Không tìm thấy sản phẩm', 404);
  }
  if (product.approvalStatus !== 'pending') {
    throw new APIError('Chỉ có thể từ chối sản phẩm đang chờ duyệt', 400);
  }

  product.approvalStatus = 'rejected';
  product.rejectionReason = reason || '';
  await product.save();

  res.status(200).json({
    success: true,
    message: `Đã từ chối sản phẩm: ${reason || 'Không có lý do'}`
  });
});

// Admin: Xử lý rút tiền
export const processWithdrawal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason, receiptUrl } = req.body;
  const adminId = req.user._id;

  const withdrawal = await Withdrawal.findById(id);
  if (!withdrawal) {
    throw new APIError('Không tìm thấy yêu cầu rút tiền', 404);
  }

  if (withdrawal.status !== 'pending') {
    throw new APIError('Yêu cầu đã được xử lý', 400);
  }

  const user = await User.findById(withdrawal.sellerId);

  if (status === 'completed') {
    withdrawal.status = 'completed';
    withdrawal.receiptUrl = receiptUrl;
    
    // Trừ tiền từ pending balance
    user.sellerInfo.pendingBalance -= withdrawal.amount;
    user.sellerInfo.totalEarnings += withdrawal.amount;
  } else if (status === 'rejected') {
    withdrawal.status = 'rejected';
    withdrawal.rejectionReason = rejectionReason;
    
    // Hoàn tiền về available balance
    user.sellerInfo.availableBalance += withdrawal.amount;
    user.sellerInfo.pendingBalance -= withdrawal.amount;
  } else {
    throw new APIError('Status không hợp lệ', 400);
  }

  withdrawal.processedBy = adminId;
  withdrawal.processedAt = new Date();
  await withdrawal.save();
  await user.save();

  res.status(200).json({
    success: true,
    message: `Đã ${status === 'completed' ? 'hoàn thành' : 'từ chối'} yêu cầu rút tiền`
  });
});

// Admin: Lấy danh sách seller chờ duyệt
export const getPendingSellers = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const query = { role: 'seller', 'sellerInfo.isVerified': false };

  const sellers = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      sellers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// Admin: Lấy danh sách sản phẩm chờ duyệt
export const getPendingProducts = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const query = { isMarketplaceItem: true, approvalStatus: 'pending' };

  const products = await ServicePackage.find(query)
    .populate('sellerId', 'username sellerInfo.businessName')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await ServicePackage.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// Admin: Lấy danh sách rút tiền chờ xử lý
export const getPendingWithdrawals = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const withdrawals = await Withdrawal.find({ status: 'pending' })
    .populate('sellerId', 'username email sellerInfo.businessName')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Withdrawal.countDocuments({ status: 'pending' });

  res.status(200).json({
    success: true,
    data: {
      withdrawals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// Admin/Support: cập nhật compliance seller (CCCD / đặt cọc)
export const updateSellerCompliance = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const {
    identityVerified,
    identityDocumentType,
    identityDocumentNumber,
    identityDocumentUrl,
    securityDeposit,
    highValueLimit
  } = req.body;

  const seller = await User.findById(userId);
  if (!seller) {
    throw new APIError('Không tìm thấy seller', 404);
  }
  if (seller.role !== 'seller') {
    throw new APIError('Người dùng không phải seller', 400);
  }

  seller.sellerInfo = seller.sellerInfo || {};
  seller.sellerInfo.compliance = seller.sellerInfo.compliance || {};

  if (identityVerified !== undefined) {
    seller.sellerInfo.compliance.identityVerified = Boolean(identityVerified);
    seller.sellerInfo.compliance.identityVerifiedAt = identityVerified ? new Date() : null;
    seller.sellerInfo.compliance.identityVerifiedBy = identityVerified ? req.user._id : null;
  }
  if (identityDocumentType !== undefined) seller.sellerInfo.compliance.identityDocumentType = identityDocumentType;
  if (identityDocumentNumber !== undefined) seller.sellerInfo.compliance.identityDocumentNumber = identityDocumentNumber;
  if (identityDocumentUrl !== undefined) seller.sellerInfo.compliance.identityDocumentUrl = identityDocumentUrl;
  if (securityDeposit !== undefined) seller.sellerInfo.compliance.securityDeposit = Math.max(0, Number(securityDeposit) || 0);
  if (highValueLimit !== undefined) seller.sellerInfo.compliance.highValueLimit = Math.max(0, Number(highValueLimit) || 0);

  await seller.save();

  res.status(200).json({
    success: true,
    message: 'Đã cập nhật compliance cho seller',
    data: seller.sellerInfo.compliance
  });
});
