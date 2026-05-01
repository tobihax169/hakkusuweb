import User from '../models/User.js';
import Order from '../models/Order.js';
import Transaction from '../models/Transaction.js';
import { catchAsync, APIError } from '../middleware/errorHandler.js';
import Log from '../models/Log.js';

/**
 * Lấy thông tin wallet của user hiện tại
 * GET /api/users/wallet
 */
export const getWallet = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('gem coin');

  // Lấy tổng giao dịch
  const stats = await Transaction.getUserBalanceStats(req.user._id);
  
  const summary = stats.reduce((acc, item) => {
    if (item._id === 'topup') {
      acc.totalTopupGem = item.totalGem;
      acc.totalTopupVND = item.totalVND;
    }
    if (item._id === 'payment') {
      acc.totalSpentGem = item.totalGem;
    }
    if (item._id === 'refund') {
      acc.totalRefundGem = item.totalGem;
    }
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      balance: {
        gem: user.gem,
        coin: user.coin,
        totalInGem: user.totalBalanceInGem
      },
      summary: {
        totalTopupGem: summary.totalTopupGem || 0,
        totalTopupVND: summary.totalTopupVND || 0,
        totalSpentGem: summary.totalSpentGem || 0,
        totalRefundGem: summary.totalRefundGem || 0
      }
    }
  });
});

/**
 * Lấy thống kê cá nhân
 * GET /api/users/stats
 */
export const getUserStats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const [orderStats, transactionStats] = await Promise.all([
    Order.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [
                { $eq: ['$paymentStatus', 'paid'] },
                '$totalPrice',
                0
              ]
            }
          }
        }
      }
    ]),
    Transaction.aggregate([
      { $match: { userId: userId, status: 'success' } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ])
  ]);

  res.json({
    success: true,
    data: {
      orders: orderStats,
      transactions: transactionStats
    }
  });
});

/**
 * Lấy danh sách user (Admin)
 * GET /api/admin/users
 */
export const getAllUsers = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { discordUsername: { $regex: search, $options: 'i' } }
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password')
      .lean(),
    User.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Lấy chi tiết user (Admin)
 * GET /api/admin/users/:id
 */
export const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .select('-password')
    .lean();

  if (!user) {
    throw new APIError('Không tìm thấy user', 404);
  }

  // Lấy thêm thông tin đơn hàng và giao dịch gần đây
  const [recentOrders, recentTransactions] = await Promise.all([
    Order.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderCode packageName status totalPrice createdAt'),
    Transaction.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('transactionCode type amount currency status createdAt')
  ]);

  res.json({
    success: true,
    data: {
      user,
      recentOrders,
      recentTransactions
    }
  });
});

/**
 * Cập nhật user (Admin)
 * PUT /api/admin/users/:id
 */
export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new APIError('Không tìm thấy user', 404);
  }

  // Không cho phép tự hạ cấp chính mình
  if (id === req.user._id.toString() && updates.role && updates.role !== 'admin') {
    throw new APIError('Không thể tự hạ cấp tài khoản admin của mình', 400);
  }

  // Các trường được phép cập nhật
  const allowedFields = ['username', 'email', 'role', 'isActive', 'isBanned', 'banReason', 'gem', 'coin'];
  
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  });

  await user.save();

  // Log
  await Log.createLog({
    type: 'admin',
    level: 'info',
    message: `Admin cập nhật user: ${user.email}`,
    userId: req.user._id,
    targetId: user._id.toString(),
    targetType: 'user',
    details: updates
  });

  res.json({
    success: true,
    message: 'Cập nhật user thành công',
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isBanned: user.isBanned,
      gem: user.gem,
      coin: user.coin
    }
  });
});

/**
 * Cộng/trừ Gem/Coin cho user (Admin)
 * POST /api/admin/users/:id/balance
 */
export const updateUserBalance = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { amount, currency, type, reason } = req.body;

  if (!amount || amount === 0) {
    throw new APIError('Số tiền không hợp lệ', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new APIError('Không tìm thấy user', 404);
  }

  // Cập nhật số dư
  if (currency === 'gem') {
    if (type === 'add') {
      await user.addGem(amount);
    } else {
      await user.deductGem(amount);
    }
  } else if (currency === 'coin') {
    if (type === 'add') {
      await user.addCoin(amount);
    } else {
      await user.deductCoin(amount);
    }
  }

  // Tạo transaction ghi nhận
  const transaction = new Transaction({
    transactionCode: await Transaction.generateTransactionCode(type === 'add' ? 'bonus' : 'withdraw'),
    userId: id,
    type: type === 'add' ? 'bonus' : 'withdraw',
    amount: Math.abs(amount),
    currency,
    status: 'success',
    description: reason || `Admin ${type === 'add' ? 'cộng' : 'trừ'} ${currency}`,
    processedBy: req.user._id,
    processedAt: new Date()
  });

  await transaction.save();

  // Log
  await Log.createLog({
    type: 'admin',
    level: 'info',
    message: `Admin ${type === 'add' ? 'cộng' : 'trừ'} ${amount} ${currency} cho ${user.email}`,
    userId: req.user._id,
    targetId: user._id.toString(),
    targetType: 'user',
    details: { amount, currency, type, reason }
  });

  res.json({
    success: true,
    message: `Đã ${type === 'add' ? 'cộng' : 'trừ'} ${amount} ${currency} cho user`,
    data: {
      userId: user._id,
      currentBalance: {
        gem: user.gem,
        coin: user.coin
      },
      transaction
    }
  });
});

/**
 * Ban/Unban user (Admin)
 * PUT /api/admin/users/:id/ban
 */
export const toggleBanUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { reason, ban } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new APIError('Không tìm thấy user', 404);
  }

  // Không cho phép tự ban mình
  if (id === req.user._id.toString()) {
    throw new APIError('Không thể tự cấm tài khoản của mình', 400);
  }

  user.isBanned = ban !== false;
  user.banReason = ban !== false ? (reason || 'Vi phạm quy định') : null;
  await user.save();

  // Log
  await Log.createLog({
    type: 'admin',
    level: ban !== false ? 'warn' : 'info',
    message: `Admin ${ban !== false ? 'cấm' : 'gỡ cấm'} user: ${user.email}`,
    userId: req.user._id,
    targetId: user._id.toString(),
    targetType: 'user',
    details: { isBanned: user.isBanned, reason: user.banReason }
  });

  res.json({
    success: true,
    message: ban !== false ? 'Đã cấm user' : 'Đã gỡ cấm user',
    data: {
      id: user._id,
      isBanned: user.isBanned,
      banReason: user.banReason
    }
  });
});

/**
 * Thống kê người dùng (Admin)
 * GET /api/admin/users/stats
 */
export const getAdminUserStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const [userStats, roleStats, newUsers] = await Promise.all([
    // Tổng quan
    User.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          banned: { $sum: { $cond: ['$isBanned', 1, 0] } },
          discordUsers: { $sum: { $cond: ['$isDiscordUser', 1, 0] } }
        }
      }
    ]),
    // Theo role
    User.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]),
    // Người dùng mới theo ngày (30 ngày gần nhất)
    User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json({
    success: true,
    data: {
      overview: userStats[0] || { total: 0, active: 0, banned: 0, discordUsers: 0 },
      byRole: roleStats,
      newUsersDaily: newUsers
    }
  });
});
