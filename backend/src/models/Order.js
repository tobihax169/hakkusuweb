import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
  feature: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
});

const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
});

const orderSchema = new mongoose.Schema(
  {
    // Mã đơn hàng (unique, dễ đọc)
    orderCode: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    // Người đặt hàng
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Thông tin gói dịch vụ
    packageId: {
      type: String,
      required: true
    },
    packageName: {
      type: String,
      required: true
    },
    packageNameEn: {
      type: String
    },

    // Yêu cầu chi tiết
    requirements: [requirementSchema],
    description: {
      type: String,
      default: ''
    },

    // Link Discord server
    discordServerId: {
      type: String,
      default: null
    },
    discordServerName: {
      type: String,
      default: null
    },
    discordInviteLink: {
      type: String,
      default: null
    },

    // File đính kèm
    attachments: [attachmentSchema],

    // Giá cả và thanh toán
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['vnd', 'usd', 'gem', 'coin'],
      default: 'vnd'
    },

    // Thông tin seller (cho marketplace)
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    isMarketplaceOrder: {
      type: Boolean,
      default: false
    },
    
    // Phân chia tiền giữa seller và platform
    platformFee: {
      type: Number,
      default: 0 // Số tiền platform giữ (30%)
    },
    platformFeePercentage: {
      type: Number,
      default: 30
    },
    sellerAmount: {
      type: Number,
      default: 0 // Số tiền seller nhận (70%)
    },
    
    // Trạng thái chuyển tiền cho seller
    sellerPaymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'hold'],
      default: 'pending'
    },
    sellerPaidAt: {
      type: Date,
      default: null
    },
    sellerPaymentTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null
    },

    // Phương thức thanh toán
    paymentMethod: {
      type: String,
      enum: ['qr_code', 'bank_transfer', 'wallet', 'card', 'none'],
      default: 'none'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: {
      type: Date,
      default: null
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null
    },

    // Trạng thái đơn hàng
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
      index: true
    },
    statusHistory: [statusHistorySchema],

    // Người xử lý đơn hàng
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Thời gian dự kiến hoàn thành
    estimatedCompletionDate: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    },

    // Ghi chú nội bộ (chỉ admin/support xem được)
    internalNotes: {
      type: String,
      default: ''
    },

    // Đánh giá sau hoàn thành
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    review: {
      type: String,
      default: ''
    },
    reviewedAt: {
      type: Date,
      default: null
    },

    // Metadata
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
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ assignedTo: 1, status: 1 });
orderSchema.index({ paymentStatus: 1 });

// ==================== VIRTUALS ====================
// Kiểm tra có thể hủy đơn không
orderSchema.virtual('canCancel').get(function () {
  return ['pending', 'processing'].includes(this.status) && this.paymentStatus !== 'refunded';
});

// Kiểm tra có thể hoàn tiền không
orderSchema.virtual('canRefund').get(function () {
  return ['paid', 'completed'].includes(this.paymentStatus) && this.status !== 'refunded';
});

// Tính thời gian chờ (số ngày từ lúc tạo)
orderSchema.virtual('waitingDays').get(function () {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// ==================== MIDDLEWARE ====================
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// ==================== METHODS ====================
// Thay đổi trạng thái đơn hàng
orderSchema.methods.changeStatus = async function (newStatus, changedBy, note = '') {
  const oldStatus = this.status;
  
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy,
    note: note || `Chuyển từ ${oldStatus} sang ${newStatus}`
  });

  if (newStatus === 'completed') {
    this.completedAt = new Date();
  }

  return await this.save();
};

// Đánh dấu đã thanh toán
orderSchema.methods.markAsPaid = async function (transactionId) {
  this.paymentStatus = 'paid';
  this.paidAt = new Date();
  this.transactionId = transactionId;
  
  // Nếu đang pending và đã thanh toán, chuyển sang processing
  if (this.status === 'pending') {
    this.status = 'processing';
    this.statusHistory.push({
      status: 'processing',
      changedBy: null,
      note: 'Tự động chuyển sang xử lý sau khi thanh toán'
    });
  }
  
  return await this.save();
};

// Gán người xử lý
orderSchema.methods.assignTo = async function (userId) {
  this.assignedTo = userId;
  return await this.save();
};

// Thêm đánh giá
orderSchema.methods.addReview = async function (rating, review) {
  this.rating = rating;
  this.review = review;
  this.reviewedAt = new Date();
  return await this.save();
};

// ==================== STATIC METHODS ====================
// Tạo mã đơn hàng mới
orderSchema.statics.generateOrderCode = async function () {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Đếm số đơn hàng trong ngày
  const count = await this.countDocuments({
    createdAt: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999))
    }
  });
  
  const sequence = String(count + 1).padStart(4, '0');
  return `ORD${year}${month}${day}${sequence}`;
};

// Lấy thống kê đơn hàng
orderSchema.statics.getStatistics = async function (startDate, endDate) {
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ['$paymentStatus', 'paid'] },
              '$totalPrice',
              0
            ]
          }
        }
      }
    }
  ]);
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
