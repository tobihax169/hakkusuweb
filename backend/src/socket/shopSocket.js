import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import ShopMessage from '../models/ShopMessage.js';
import { logger } from '../utils/logger.js';

export function initShopSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Unauthorized'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user || !user.isActive || user.isBanned) {
        return next(new Error('Unauthorized'));
      }
      socket.user = user;
      socket.userId = user._id.toString();
      next();
    } catch (e) {
      logger.warn('Socket auth failed', e.message);
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('join_shop', (payload, cb) => {
      const sellerId = payload?.sellerId;
      if (!sellerId || !mongoose.isValidObjectId(sellerId)) {
        return cb?.({ ok: false, message: 'sellerId không hợp lệ' });
      }
      socket.join(`shop:${sellerId}`);
      cb?.({ ok: true });
    });

    socket.on('leave_shop', (payload) => {
      const sellerId = payload?.sellerId;
      if (sellerId) socket.leave(`shop:${sellerId}`);
    });

    socket.on('shop_message', async (payload, cb) => {
      try {
        const { sellerId, body, buyerId: clientBuyerId } = payload || {};
        if (!sellerId || !mongoose.isValidObjectId(sellerId)) {
          throw new Error('sellerId không hợp lệ');
        }
        const text = (body || '').trim();
        if (!text) throw new Error('Nội dung trống');

        const seller = await User.findById(sellerId);
        if (!seller || seller.role !== 'seller') throw new Error('Cửa hàng không hợp lệ');

        const uid = socket.user._id;
        let buyerId;
        const senderId = uid;

        if (uid.equals(seller._id)) {
          if (!clientBuyerId || !mongoose.isValidObjectId(clientBuyerId)) {
            throw new Error('Seller cần buyerId');
          }
          buyerId = new mongoose.Types.ObjectId(clientBuyerId);
          if (buyerId.equals(seller._id)) throw new Error('buyerId không hợp lệ');
        } else {
          buyerId = uid;
        }

        const msg = await ShopMessage.create({
          sellerId: seller._id,
          buyerId,
          senderId,
          body: text.slice(0, 4000)
        });
        await msg.populate('senderId', 'username');

        const out = {
          _id: msg._id,
          body: msg.body,
          createdAt: msg.createdAt,
          sellerId: seller._id.toString(),
          buyerId: buyerId.toString(),
          senderId: senderId.toString(),
          sender: msg.senderId
        };
        io.to(`shop:${sellerId}`).emit('shop_message', out);
        cb?.({ ok: true, data: out });
      } catch (e) {
        cb?.({ ok: false, message: e.message || 'Lỗi gửi tin' });
      }
    });
  });
}
