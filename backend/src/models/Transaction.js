import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    // Mã giao dịch (unique)
    transactionCode: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    // Người thực hiện giao dịch
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Loại giao dịch
    type: {
      type: String,
      enum: ['topup', 'payment', 'refund', 'bonus', 'withdraw', 'transfer'],
      required: true,
      index: true
    },

    // Số tiền/Gem/Coin
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['gem', 'coin', 'vnd', 'usd'],
      required: true
    },

    // Số dư trước và sau giao dịch
    balanceBefore: {
      gem: { type: Number, default: 0 },
      coin: { type: Number, default: 0 }
    },
    balanceAfter: {
      gem: { type: Number, default: 0 },
      coin: { type: Number, default: 0 }
    },

    // Trạng thái giao dịch
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'cancelled'],
      default: 'pending',
      index: true
    },

    // Thông tin liên kết
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null
    },
    orderCode: {
      type: String,
      default: null
    },

    // Thông tin thanh toán (cho nạp tiền)
    paymentMethod: {
      type: String,
      enum: ['qr_code', 'bank_transfer', 'card', 'paypal', 'crypto', 'wallet', 'system'],
      default: null
    },
    paymentProvider: {
      type: String,
      default: null
    },
    paymentProviderTransactionId: {
      type: String,
      default: null
    },

    // Thông tin ngân hàng/chuyển khoản (cho nạp/rút)
    bankInfo: {
      bankName: { type: String, default: null },
      accountNumber: { type: String, default: null },
      accountName: { type: String, default: null },
      transferContent: { type: String, default: null }
    },

    // QR Code URL (nếu có)
    qrCodeUrl: {
      type: String,
      default: null
    },

    // Thời gian hết hạn (cho giao dịch pending)
    expiresAt: {
      type: Date,
      default: null
    },

    // Lý do/Mô tả giao dịch
    description: {
      type: String,
      default: ''
    },

    // Ghi chú nội bộ
    internalNote: {
      type: String,
      default: ''
    },

    // Thông tin người tạo/xác nhận (nếu là admin)
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    processedAt: {
      type: Date,
      default: null
    },

    // Metadata từ payment provider
    providerMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // Thời gian tạo và cập nhật
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ==================== INDEXES ====================
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ paymentProviderTransactionId: 1 });
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ createdAt: -1 });

// ==================== VIRTUALS ====================
// Kiểm tra giao dịch có đang pending không
transactionSchema.virtual('isPending').get(function () {
  return this.status === 'pending';
});

// Kiểm tra giao dịch đã hết hạn chưa
transactionSchema.virtual('isExpired').get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Định dạng số tiền hiển thị
transactionSchema.virtual('formattedAmount').get(function () {
  const symbols = {
    vnd: '₫',
    usd: '$',
    gem: '💎',
    coin: '🪙'
  };
  
  if (this.currency === 'vnd') {
    return `${this.amount.toLocaleString('vi-VN')} ${symbols[this.currency]}`;
  }
  
  return `${this.amount} ${symbols[this.currency]}`;
});

// ==================== MIDDLEWARE ====================
transactionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// ==================== METHODS ====================
// Hoàn thành giao dịch
transactionSchema.methods.complete = async function (processedBy = null) {
  this.status = 'success';
  this.processedBy = processedBy;
  this.processedAt = new Date();
  return await this.save();
};

// Hủy giao dịch
transactionSchema.methods.cancel = async function (reason = '') {
  this.status = 'cancelled';
  this.internalNote = reason || this.internalNote;
  return await this.save();
};

// Đánh dấu thất bại
transactionSchema.methods.fail = async function (reason = '') {
  this.status = 'failed';
  this.internalNote = reason || this.internalNote;
  return await this.save();
};

// Cập nhật thông tin thanh toán từ provider
transactionSchema.methods.updateProviderInfo = async function (providerData) {
  this.providerMetadata = { ...this.providerMetadata, ...providerData };
  
  if (providerData.providerTransactionId) {
    this.paymentProviderTransactionId = providerData.providerTransactionId;
  }
  
  return await this.save();
};

// ==================== STATIC METHODS ====================
// Tạo mã giao dịch mới
transactionSchema.statics.generateTransactionCode = async function (type) {
  const prefix = {
    topup: 'TOP',
    payment: 'PAY',
    refund: 'REF',
    bonus: 'BON',
    withdraw: 'WIT',
    transfer: 'TRF'
  };

  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  // Random 4 số
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `${prefix[type] || 'TRX'}${year}${month}${day}${hours}${minutes}${random}`;
};

// Lấy thống kê giao dịch
transactionSchema.statics.getStatistics = async function (startDate, endDate, userId = null) {
  const matchStage = {
    status: 'success'
  };
  
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  if (userId) {
    matchStage.userId = new mongoose.Types.ObjectId(userId);
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Lấy tổng số tiền nạp/rút của user
transactionSchema.statics.getUserBalanceStats = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: 'success'
      }
    },
    {
      $group: {
        _id: '$type',
        totalGem: {
          $sum: {
            $cond: [{ $eq: ['$currency', 'gem'] }, '$amount', 0]
          }
        },
        totalCoin: {
          $sum: {
            $cond: [{ $eq: ['$currency', 'coin'] }, '$amount', 0]
          }
        },
        totalVND: {
          $sum: {
            $cond: [{ $eq: ['$currency', 'vnd'] }, '$amount', 0]
          }
        }
      }
    }
  ]);

  return stats;
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
