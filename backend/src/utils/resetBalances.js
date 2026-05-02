import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { connectDB, disconnectDB } from '../config/database.js';
import { logger } from './logger.js';

dotenv.config();

/**
 * Reset tất cả số dư Gem/Coin về 0
 * Chỉ giữ lại số dư của user đã có giao dịch thành công
 */
const resetBalances = async () => {
  try {
    await connectDB();

    logger.info('Bắt đầu reset số dư...');

    // Reset tất cả user về 0
    const result = await User.updateMany(
      {}, 
      { 
        $set: { 
          gem: 0, 
          coin: 0,
          'sellerInfo.totalEarnings': 0,
          'sellerInfo.availableBalance': 0,
          'sellerInfo.pendingBalance': 0
        } 
      }
    );

    logger.info(`Đã reset ${result.modifiedCount} users về số dư 0`);
    logger.info('User cần nạp tiền qua SePay để có Gem!');

    console.log('\n✅ Reset hoàn tất!');
    console.log('Tất cả số dư đã về 0.');
    console.log('User phải nạp tiền thật mới có Gem/Coin.\n');

  } catch (error) {
    logger.error('Lỗi reset số dư:', error);
    console.error('❌ Lỗi:', error.message);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

// Chạy nếu file được gọi trực tiếp
if (process.argv[1].includes('resetBalances.js')) {
  resetBalances();
}

export default resetBalances;
