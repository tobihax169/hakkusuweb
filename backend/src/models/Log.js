import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    // Loại log
    type: {
      type: String,
      enum: ['auth', 'order', 'payment', 'user', 'system', 'admin', 'error'],
      required: true,
      index: true
    },

    // Mức độ nghiêm trọng
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'debug'],
      default: 'info'
    },

    // Thông điệp
    message: {
      type: String,
      required: true
    },

    // Người thực hiện (nếu có)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    userEmail: {
      type: String,
      default: null
    },

    // Đối tượng bị tác động (nếu có)
    targetId: {
      type: String,
      default: null
    },
    targetType: {
      type: String,
      enum: ['user', 'order', 'transaction', 'service', 'system'],
      default: null
    },

    // Chi tiết thêm
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // Thông tin request
    ip: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    },
    endpoint: {
      type: String,
      default: null
    },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', null],
      default: null
    },

    // Thời gian
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// ==================== INDEXES ====================
logSchema.index({ type: 1, createdAt: -1 });
logSchema.index({ userId: 1, createdAt: -1 });
logSchema.index({ level: 1, createdAt: -1 });
logSchema.index({ createdAt: -1 });

// TTL index - Tự động xóa log sau 90 ngày
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// ==================== STATIC METHODS ====================
// Tạo log mới
logSchema.statics.createLog = async function (data) {
  return await this.create(data);
};

// Lấy logs theo type
logSchema.statics.getByType = async function (type, limit = 50) {
  return await this.find({ type })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'username email')
    .lean();
};

// Lấy logs của user
logSchema.statics.getByUser = async function (userId, limit = 50) {
  return await this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Lấy logs lỗi
logSchema.statics.getErrors = async function (startDate, endDate, limit = 100) {
  const query = { level: 'error' };
  
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  return await this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Thống kê logs
logSchema.statics.getStats = async function (startDate, endDate) {
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
        _id: '$type',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

const Log = mongoose.model('Log', logSchema);

export default Log;
