import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import ServicePackage from '../models/ServicePackage.js';
import { DEFAULT_PACKAGES } from '../../../shared/constants.js';
import { connectDB, disconnectDB } from '../config/database.js';
import { logger } from './logger.js';

dotenv.config();

/**
 * Seed dữ liệu mặc định cho ứng dụng
 */
const seedData = async () => {
  try {
    await connectDB();

    logger.info('Bắt đầu seed dữ liệu...');

    // ==================== 1. Tạo/Cập nhật Admin User ====================
    const adminEmail = 'otachienti169@gmail.com';
    const adminPassword = 'tobihax169';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const admin = new User({
        username: 'admin',
        email: adminEmail,
        password: adminPassword, // pre-save hook sẽ hash
        role: 'admin',
        gem: 0,
        coin: 0,
        isActive: true,
        isEmailVerified: true
      });

      await admin.save();
      logger.info(`Đã tạo admin user: ${adminEmail}`);
    } else {
      // Cập nhật password và reset gem/coin về 0
      existingAdmin.password = adminPassword;
      existingAdmin.gem = 0;
      existingAdmin.coin = 0;
      await existingAdmin.save();
      logger.info(`Đã cập nhật password và reset số dư cho admin: ${adminEmail}`);
    }

    // ==================== 2. Seed Service Packages ====================
    let createdPackages = 0;
    let updatedPackages = 0;

    for (const pkg of DEFAULT_PACKAGES) {
      const existing = await ServicePackage.findOne({ packageId: pkg.id });
      
      const serviceData = {
        packageId: pkg.id,
        name: pkg.name,
        nameEn: pkg.nameEn,
        description: pkg.description,
        descriptionEn: pkg.descriptionEn,
        price: pkg.price,
        currency: pkg.currency,
        icon: pkg.icon,
        features: pkg.features.map((f, i) => ({
          text: f,
          textEn: pkg.featuresEn[i] || f,
          included: true
        })),
        popular: pkg.popular,
        isActive: pkg.isActive,
        sortOrder: ['basic', 'vip', 'premium', 'custom'].indexOf(pkg.id)
      };

      if (existing) {
        await ServicePackage.updateOne({ packageId: pkg.id }, serviceData);
        updatedPackages++;
      } else {
        const newPackage = new ServicePackage(serviceData);
        await newPackage.save();
        createdPackages++;
      }
    }

    logger.info(`Service Packages: ${createdPackages} tạo mới, ${updatedPackages} cập nhật`);

    // Không tạo demo/support user với số dư có sẵn
    // User phải nạp tiền thật mới có Gem/Coin

    logger.info('Seed dữ liệu hoàn tất!');
    
    // Hiển thị thông tin đăng nhập
    console.log('\n=== THÔNG TIN ĐĂNG NHẬP ===');
    console.log(`Admin:    otachienti169@gmail.com / tobihax169`);
    console.log('===========================\n');
    console.log('Lưu ý: Số dư Gem/Coin = 0, cần nạp tiền qua SePay để có Gem\n');

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
