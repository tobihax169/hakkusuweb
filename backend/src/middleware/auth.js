import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware xác thực JWT token
 * Gắn thông tin user vào req.user nếu token hợp lệ
 */
export const authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ - User không tồn tại'
      });
    }

    // Kiểm tra user có bị khóa không
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa'
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị cấm',
        reason: user.banReason
      });
    }

    // Gắn user vào request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn'
      });
    }

    logger.error('Auth Middleware Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực'
    });
  }
};

/**
 * Middleware kiểm tra quyền Admin
 * Phải sử dụng sau middleware authenticate
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Chưa đăng nhập'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Không có quyền truy cập - Yêu cầu Admin'
    });
  }

  next();
};

/**
 * Middleware kiểm tra quyền Support hoặc Admin
 */
export const requireSupport = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Chưa đăng nhập'
    });
  }

  if (!['admin', 'support'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Không có quyền truy cập - Yêu cầu Support/Admin'
    });
  }

  next();
};

/**
 * Middleware kiểm tra có phải chủ sở hữu resource hoặc admin
 * Dùng cho các resource cần quyền sở hữu (order của user, v.v.)
 */
export const requireOwnerOrAdmin = (getUserIdFromResource) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Chưa đăng nhập'
        });
      }

      // Admin có quyền tất cả
      if (req.user.role === 'admin') {
        return next();
      }

      // Lấy userId của resource
      const resourceUserId = await getUserIdFromResource(req);

      // Kiểm tra có phải chủ sở hữu
      if (resourceUserId && resourceUserId.toString() === req.user._id.toString()) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập resource này'
      });
    } catch (error) {
      logger.error('RequireOwner Middleware Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi kiểm tra quyền'
      });
    }
  };
};

/**
 * Middleware optional authenticate
 * Cho phép cả người dùng đăng nhập và chưa đăng nhập
 * Nếu có token hợp lệ sẽ gắn user vào req
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (user && user.isActive && !user.isBanned) {
      req.user = user;
      req.token = token;
    }

    next();
  } catch (error) {
    // Bỏ qua lỗi, cho phép tiếp tục không cần auth
    next();
  }
};
