import { logger } from '../utils/logger.js';

/**
 * Custom Error Class cho API errors
 */
export class APIError extends Error {
  constructor(message, statusCode = 500, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Xử lý lỗi validation (Joi/Zod)
 */
export const handleValidationError = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.isJoi) {
    const errors = err.details || err.errors;
    
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: Array.isArray(errors) 
        ? errors.map(e => ({
            field: e.path?.join('.') || e.field,
            message: e.message
          }))
        : Object.entries(errors).map(([field, error]) => ({
            field,
            message: error.message
          }))
    });
  }
  next(err);
};

/**
 * Xử lý lỗi MongoDB (Mongoose)
 */
export const handleMongoError = (err, req, res, next) => {
  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    
    return res.status(409).json({
      success: false,
      message: `${field} "${value}" đã tồn tại`,
      field,
      value
    });
  }

  // Cast error (sai ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `ID không hợp lệ: ${err.value}`,
      field: err.path
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors
    });
  }

  next(err);
};

/**
 * Xử lý lỗi JWT
 */
export const handleJWTError = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token đã hết hạn'
    });
  }

  next(err);
};

/**
 * Global error handler - Middleware cuối cùng
 */
export const globalErrorHandler = (err, req, res, next) => {
  // Log lỗi
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?._id
  });

  // Operational error (đã xử lý)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.errorCode
    });
  }

  // Programming error hoặc unknown error
  // Không leak thông tin chi tiết ra ngoài production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Đã xảy ra lỗi hệ thống'
    : err.message;

  return res.status(err.statusCode || 500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

/**
 * Catch async errors trong controllers
 * Thay vì dùng try-catch ở mỗi controller
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy đường dẫn: ${req.originalUrl}`
  });
};
