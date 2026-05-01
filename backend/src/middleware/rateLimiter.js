import rateLimit from 'express-rate-limit';

/**
 * Rate limiter cơ bản - Áp dụng cho tất cả routes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request mỗi IP trong 15 phút
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Bỏ qua rate limit cho health checks
  skip: (req) => req.path === '/health' || req.path === '/api/health'
});

/**
 * Rate limiter cho authentication routes
 * Nghiêm ngặt hơn để chống brute force
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Giới hạn 5 lần đăng nhập/thử
  message: {
    success: false,
    message: 'Quá nhiều lần thử đăng nhập, vui lòng thử lại sau 15 phút'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Reset counter khi đăng nhập thành công
  skipSuccessfulRequests: true
});

/**
 * Rate limiter cho API thanh toán
 */
export const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 10, // Giới hạn 10 request thanh toán mỗi phút
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu thanh toán, vui lòng thử lại sau 1 phút'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter cho tạo đơn hàng
 */
export const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 5, // Giới hạn 5 đơn hàng mỗi phút
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu tạo đơn hàng, vui lòng thử lại sau 1 phút'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter cho admin routes
 */
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 30, // Giới hạn 30 request admin mỗi phút
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu admin, vui lòng thử lại sau 1 phút'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter cho upload files
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 10, // Giới hạn 10 uploads mỗi phút
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu upload, vui lòng thử lại sau 1 phút'
  },
  standardHeaders: true,
  legacyHeaders: false
});
