import dotenv from 'dotenv';
import User from '../models/User.js';
import { connectDB, disconnectDB } from '../config/database.js';
import { logger } from './logger.js';

dotenv.config();

/**
 * Seed tối thiểu cho môi trường vận hành (không seed dữ liệu ví dụ)
 */
const seedData = async () => {
  try {
    await connectDB();

    logger.info('Khởi tạo dữ liệu runtime tối thiểu...');

    // ==================== 1. Tạo/Cập nhật Admin User từ ENV ====================
    const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
    const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
    const adminUsername = process.env.BOOTSTRAP_ADMIN_USERNAME || 'admin';
    if (!adminEmail || !adminPassword) {
      logger.info('Bỏ qua bootstrap admin: thiếu BOOTSTRAP_ADMIN_EMAIL/BOOTSTRAP_ADMIN_PASSWORD');
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const admin = new User({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword, // pre-save hook sẽ hash
        role: 'admin',
        gem: 0,
        coin: 0,
        isActive: true,
        isEmailVerified: true
      });

      await admin.save();
      logger.info(`Đã tạo admin runtime user: ${adminEmail}`);
    } else {
      existingAdmin.password = adminPassword;
      await existingAdmin.save();
      logger.info(`Đã cập nhật mật khẩu admin runtime: ${adminEmail}`);
    }
    logger.info('Khởi tạo runtime hoàn tất!');

  } catch (error) {
    logger.error('Lỗi seed dữ liệu:', error);
    // Không exit khi được gọi từ app.js
    if (process.argv[1].includes('seed.js')) {
      process.exit(1);
    }
    throw error;
  } finally {
    // Chỉ disconnect khi chạy trực tiếp file seed.js
    if (process.argv[1].includes('seed.js')) {
      await disconnectDB();
      process.exit(0);
    }
  }
};

// Chạy seed nếu file được gọi trực tiếp
if (process.argv[1].includes('seed.js')) {
  seedData();
}

export default seedData;
