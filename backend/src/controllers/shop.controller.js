import mongoose from 'mongoose';
import { User, ServicePackage, Order } from '../models/index.js';
import SellerFollow from '../models/SellerFollow.js';
import ShopReview from '../models/ShopReview.js';
import ShopMessage from '../models/ShopMessage.js';
import { catchAsync, APIError } from '../middleware/errorHandler.js';

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function recalculateSellerRating(sellerId) {
  const agg = await ShopReview.aggregate([
    { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const row = agg[0];
  await User.updateOne(
    { _id: sellerId },
    {
      $set: {
        'sellerInfo.rating': row ? Math.round(row.avg * 10) / 10 : 0,
        'sellerInfo.reviewCount': row ? row.count : 0
      }
    }
  );
}

export const getShopByUsername = catchAsync(async (req, res) => {
  const username = (req.params.username || '').trim();
  if (!username) {
    throw new APIError('Thiếu username', 400);
  }

  const seller = await User.findOne({
    username: new RegExp(`^${escapeRegex(username)}$`, 'i'),
    role: 'seller'
  }).select('username email sellerInfo discordAvatar discordUsername role');

  if (!seller) {
    throw new APIError('Không tìm thấy cửa hàng', 404);
  }

  const sellerId = seller._id;
  const [followerCount, isFollowing, products] = await Promise.all([
    SellerFollow.countDocuments({ sellerId }),
    req.user
      ? SellerFollow.exists({ sellerId, followerId: req.user._id })
      : Promise.resolve(false),
    ServicePackage.getActivePackages(req.query.lang || 'vi', {
      sellerId,
      marketplaceOnly: true,
      page: 1,
      limit: 48,
      sort: 'newest'
    })
  ]);

  res.json({
    success: true,
    data: {
      seller: {
        _id: seller._id,
        username: seller.username,
        businessName: seller.sellerInfo?.businessName || seller.username,
        description: seller.sellerInfo?.description || '',
        rating: seller.sellerInfo?.rating ?? 0,
        reviewCount: seller.sellerInfo?.reviewCount ?? 0,
        avatarUrl: seller.discordAvatar || null
      },
      followerCount,
      isFollowing: Boolean(isFollowing),
      products
    }
  });
});

export const followShop = catchAsync(async (req, res) => {
  const username = (req.params.username || '').trim();
  const seller = await User.findOne({
    username: new RegExp(`^${escapeRegex(username)}$`, 'i'),
    role: 'seller'
  });
  if (!seller) throw new APIError('Không tìm thấy cửa hàng', 404);
  if (seller._id.equals(req.user._id)) {
    throw new APIError('Không thể theo dõi chính mình', 400);
  }
  try {
    await SellerFollow.create({ followerId: req.user._id, sellerId: seller._id });
  } catch (e) {
    if (e.code !== 11000) throw e;
  }
  const followerCount = await SellerFollow.countDocuments({ sellerId: seller._id });
  res.json({ success: true, data: { followerCount, isFollowing: true } });
});

export const unfollowShop = catchAsync(async (req, res) => {
  const username = (req.params.username || '').trim();
  const seller = await User.findOne({
    username: new RegExp(`^${escapeRegex(username)}$`, 'i'),
    role: 'seller'
  });
  if (!seller) throw new APIError('Không tìm thấy cửa hàng', 404);
  await SellerFollow.deleteOne({ followerId: req.user._id, sellerId: seller._id });
  const followerCount = await SellerFollow.countDocuments({ sellerId: seller._id });
  res.json({ success: true, data: { followerCount, isFollowing: false } });
});

export const getShopReviews = catchAsync(async (req, res) => {
  const username = (req.params.username || '').trim();
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  const seller = await User.findOne({
    username: new RegExp(`^${escapeRegex(username)}$`, 'i'),
    role: 'seller'
  });
  if (!seller) throw new APIError('Không tìm thấy cửa hàng', 404);

  const [total, reviews] = await Promise.all([
    ShopReview.countDocuments({ sellerId: seller._id }),
    ShopReview.find({ sellerId: seller._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('reviewerId', 'username')
      .lean()
  ]);

  res.json({
    success: true,
    data: {
      reviews: reviews.map((r) => ({
        _id: r._id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        reviewer: r.reviewerId
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 }
    }
  });
});

export const createShopReview = catchAsync(async (req, res) => {
  const username = (req.params.username || '').trim();
  const { orderId, rating, comment = '' } = req.body;

  const seller = await User.findOne({
    username: new RegExp(`^${escapeRegex(username)}$`, 'i'),
    role: 'seller'
  });
  if (!seller) throw new APIError('Không tìm thấy cửa hàng', 404);

  const order = await Order.findById(orderId);
  if (!order) throw new APIError('Không tìm thấy đơn hàng', 404);
  const buyerId = order.userId?._id || order.userId;
  if (String(buyerId) !== String(req.user._id)) {
    throw new APIError('Không có quyền đánh giá đơn này', 403);
  }
  if (!order.sellerId || String(order.sellerId) !== String(seller._id)) {
    throw new APIError('Đơn hàng không thuộc cửa hàng này', 400);
  }
  if (order.status !== 'completed') {
    throw new APIError('Chỉ đơn đã hoàn thành mới được đánh giá', 400);
  }

  const r = Number(rating);
  if (!Number.isFinite(r) || r < 1 || r > 5) {
    throw new APIError('Điểm đánh giá từ 1 đến 5', 400);
  }

  try {
    await ShopReview.create({
      sellerId: seller._id,
      reviewerId: req.user._id,
      orderId: order._id,
      rating: r,
      comment: String(comment).slice(0, 2000)
    });
  } catch (e) {
    if (e.code === 11000) {
      throw new APIError('Bạn đã đánh giá đơn hàng này rồi', 400);
    }
    throw e;
  }

  await recalculateSellerRating(seller._id);
  const fresh = await User.findById(seller._id).select('sellerInfo.rating sellerInfo.reviewCount');

  res.status(201).json({
    success: true,
    data: {
      rating: fresh?.sellerInfo?.rating ?? 0,
      reviewCount: fresh?.sellerInfo?.reviewCount ?? 0
    }
  });
});

export const getShopMessages = catchAsync(async (req, res) => {
  const username = (req.params.username || '').trim();
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);

  const seller = await User.findOne({
    username: new RegExp(`^${escapeRegex(username)}$`, 'i'),
    role: 'seller'
  });
  if (!seller) throw new APIError('Không tìm thấy cửa hàng', 404);

  let buyerId;
  if (req.user._id.equals(seller._id)) {
    const raw = req.query.buyerId;
    if (!raw) throw new APIError('Seller cần truyền buyerId để xem hội thoại', 400);
    buyerId = new mongoose.Types.ObjectId(raw);
  } else {
    buyerId = req.user._id;
  }

  const query = { sellerId: seller._id, buyerId };
  const [total, messages] = await Promise.all([
    ShopMessage.countDocuments(query),
    ShopMessage.find(query)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('senderId', 'username')
      .lean()
  ]);

  res.json({
    success: true,
    data: {
      messages: messages.map((m) => ({
        _id: m._id,
        body: m.body,
        createdAt: m.createdAt,
        senderId: m.senderId?._id,
        sender: m.senderId
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 }
    }
  });
});

export const postShopMessage = catchAsync(async (req, res) => {
  const username = (req.params.username || '').trim();
  const text = (req.body?.body || '').trim();
  if (!text) throw new APIError('Nội dung tin nhắn không được để trống', 400);

  const seller = await User.findOne({
    username: new RegExp(`^${escapeRegex(username)}$`, 'i'),
    role: 'seller'
  });
  if (!seller) throw new APIError('Không tìm thấy cửa hàng', 404);

  let buyerId;
  let senderId = req.user._id;

  if (req.user._id.equals(seller._id)) {
    const raw = req.body?.buyerId;
    if (!raw) throw new APIError('Seller cần buyerId khi gửi tin', 400);
    buyerId = new mongoose.Types.ObjectId(raw);
    if (buyerId.equals(seller._id)) {
      throw new APIError('buyerId không hợp lệ', 400);
    }
  } else {
    buyerId = req.user._id;
  }

  const msg = await ShopMessage.create({
    sellerId: seller._id,
    buyerId,
    senderId,
    body: text.slice(0, 4000)
  });
  await msg.populate('senderId', 'username');

  const io = req.app.get('io');
  if (io) {
    const payload = {
      _id: msg._id,
      body: msg.body,
      createdAt: msg.createdAt,
      sellerId: seller._id.toString(),
      buyerId: buyerId.toString(),
      senderId: senderId.toString(),
      sender: msg.senderId
    };
    io.to(`shop:${seller._id}`).emit('shop_message', payload);
  }

  res.status(201).json({
    success: true,
    data: {
      _id: msg._id,
      body: msg.body,
      createdAt: msg.createdAt,
      senderId: msg.senderId?._id,
      sender: msg.senderId
    }
  });
});
