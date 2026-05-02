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

    // ==================== 1. Tạo Admin User ====================
    const adminEmail = process.env.ADMIN_EMAIL || 'otachienti169@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'tobihax169';

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const admin = new User({
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        gem: 999999,
        coin: 999999,
        isActive: true,
        isEmailVerified: true
      });

      await admin.save();
      logger.info(`Đã tạo admin user: ${adminEmail}`);
    } else {
      logger.info(`Admin user đã tồn tại: ${adminEmail}`);
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

    // ==================== 3. Tạo Support User (optional) ====================
    const supportEmail = 'support@example.com';
    const existingSupport = await User.findOne({ email: supportEmail });
    
    if (!existingSupport) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('support123', salt);

      const support = new User({
        username: 'support',
        email: supportEmail,
        password: hashedPassword,
        role: 'support',
        gem: 10000,
        coin: 10000,
        isActive: true,
        isEmailVerified: true
      });

      await support.save();
      logger.info(`Đã tạo support user: ${supportEmail}`);
    }

    // ==================== 4. Tạo Demo User (optional) ====================
    const demoEmail = 'demo@example.com';
    const existingDemo = await User.findOne({ email: demoEmail });
    
    if (!existingDemo) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('demo123', salt);

      const demoUser = new User({
        username: 'demouser',
        email: demoEmail,
        password: hashedPassword,
        role: 'user',
        gem: 5000,
        coin: 1000,
        isActive: true,
        isEmailVerified: true
      });

      await demoUser.save();
      logger.info(`Đã tạo demo user: ${demoEmail}`);
    }

    logger.info('Seed dữ liệu hoàn tất!');
    
    // Hiển thị thông tin đăng nhập
    console.log('\n=== THÔNG TIN ĐĂNG NHẬP ===');
    console.log(`Admin:    otachienti169@gmail.com / tobihax169`);
    console.log(`Support:  support@example.com / support123`);
    console.log(`Demo:     demo@example.com / demo123`);
    console.log('===========================\n');

  } catch (error) {
    logger.error('Lỗi seed dữ liệu:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

// Chạy seed nếu file được gọi trực tiếp
if (process.argv[1].includes('seed.js')) {
  seedData();
}

export default seedData;
