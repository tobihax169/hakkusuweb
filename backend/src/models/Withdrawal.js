import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    // Mã yêu cầu rút tiền
    withdrawalCode: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    // Người rút tiền (seller)
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Số tiền rút
    amount: {
      type: Number,
      required: true,
      min: [10000, 'Số tiền rút tối thiểu là 10,000đ']
    },
    currency: {
      type: String,
      enum: ['vnd', 'usd'],
      default: 'vnd'
    },

    // Thông tin ngân hàng
    bankInfo: {
      bankName: { type: String, required: true },
      bankCode: { type: String, default: '' },
      accountNumber: { type: String, required: true },
      accountName: { type: String, required: true }
    },

    // Trạng thái yêu cầu
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'rejected', 'cancelled'],
      default: 'pending',
      index: true
    },

    // Người xử lý (admin)
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    processedAt: {
      type: Date,
      default: null
    },

    // Ghi chú từ seller
    note: {
      type: String,
      default: ''
    },

    // Ghi chú từ admin
    adminNote: {
      type: String,
      default: ''
    },

    // Lý do từ chối
    rejectionReason: {
      type: String,
      default: ''
    },

    // Mã giao dịch thanh toán (nếu có)
    paymentTransactionId: {
      type: String,
      default: null
    },

    // Biên lai/ảnh chụp thanh toán
    receiptUrl: {
      type: String,
      default: null
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now
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
withdrawalSchema.index({ sellerId: 1, status: 1 });
withdrawalSchema.index({ status: 1, createdAt: -1 });
withdrawalSchema.index({ createdAt: -1 });

// ==================== VIRTUALS ====================
withdrawalSchema.virtual('formattedAmount').get(function () {
  if (this.currency === 'vnd') {
    return `${this.amount.toLocaleString('vi-VN')}đ`;
  }
  return `$${this.amount}`;
});

// Kiểm tra có thể hủy không
withdrawalSchema.virtual('canCancel').get(function () {
  return this.status === 'pending';
});

// ==================== MIDDLEWARE ====================
withdrawalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// ==================== STATIC METHODS ====================
// Tạo mã rút tiền
withdrawalSchema.statics.generateWithdrawalCode = async function () {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Đếm số yêu cầu trong ngày
  const count = await this.countDocuments({
    createdAt: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999))
    }
  });
  
  const sequence = String(count + 1).padStart(4, '0');
  return `WIT${year}${month}${day}${sequence}`;
};

// Lấy thống kê rút tiền của seller
withdrawalSchema.statics.getSellerStats = async function (sellerId) {
  return await this.aggregate([
    { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
    {
      $group: {
        _id: '$status',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);
export default Withdrawal;
