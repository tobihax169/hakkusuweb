import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Kết nối đến MongoDB Database
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Các options mặc định của Mongoose 6+ đã được tối ưu
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Đóng kết nối MongoDB (dùng cho testing hoặc graceful shutdown)
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB Disconnected');
  } catch (error) {
    logger.error(`MongoDB Disconnect Error: ${error.message}`);
  }
};
