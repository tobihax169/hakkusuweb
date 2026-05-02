import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import { connectDB } from './config/database.js';
import passport from './config/passport.js';
import { logger } from './utils/logger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import seedData from './utils/seed.js';
import {
  handleValidationError,
  handleMongoError,
  handleJWTError,
  globalErrorHandler,
  notFoundHandler
} from './middleware/errorHandler.js';
import routes from './routes/index.js';

// Khởi tạo Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy cho rate limit hoạt động đúng trên Render
app.set('trust proxy', 1);

// ==================== MIDDLEWARE ====================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS - Cho phép nhiều origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://hakkusu.xyz',
  'https://www.hakkusu.xyz'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Cho phép requests không có origin (như mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Log để debug
    console.log('Blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser());

// Passport initialization
app.use(passport.initialize());

// Request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });
}

// ==================== ROUTES ====================

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// ==================== ERROR HANDLERS ====================

// Custom error handlers
app.use(handleValidationError);
app.use(handleMongoError);
app.use(handleJWTError);

// Global error handler
app.use(globalErrorHandler);

// ==================== START SERVER ====================

const startServer = async () => {
  try {
    // Kết nối database
    await connectDB();

    // Seed dữ liệu mặc định (admin, support, demo user)
    await seedData();

    // Khởi động server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Xử lý unhandled errors
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Khởi động server
startServer();

export default app;
