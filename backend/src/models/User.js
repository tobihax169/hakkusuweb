import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // Thông tin Discord
    discordId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null/undefined và vẫn giữ unique constraint
      index: true
    },
    discordUsername: {
      type: String,
      default: null
    },
    discordAvatar: {
      type: String,
      default: null
    },

    // Thông tin tài khoản
    username: {
      type: String,
      required: [true, 'Username là bắt buộc'],
      unique: true,
      trim: true,
      minlength: [3, 'Username phải có ít nhất 3 ký tự'],
      maxlength: [30, 'Username không được quá 30 ký tự']
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
    },
    password: {
      type: String,
      // Password có thể null đối với user đăng nhập bằng Discord
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false // Không trả về password trong query mặc định
    },
    isDiscordUser: {
      type: Boolean,
      default: false
    },

    // Ví điện tử - Số dư
    gem: {
      type: Number,
      default: 0,
      min: [0, 'Số dư Gem không thể âm']
    },
    coin: {
      type: Number,
      default: 0,
      min: [0, 'Số dư Coin không thể âm']
    },

    // Vai trò và quyền hạn
    role: {
      type: String,
      enum: ['user', 'admin', 'support', 'seller'],
      default: 'user'
    },

    // Thông tin seller (nếu role = seller)
    sellerInfo: {
      isVerified: { type: Boolean, default: false },
      verifiedAt: { type: Date, default: null },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      businessName: { type: String, default: '' },
      businessEmail: { type: String, default: '' },
      phone: { type: String, default: '' },
      description: { type: String, default: '' },
      totalEarnings: { type: Number, default: 0 },
      availableBalance: { type: Number, default: 0 },
      pendingBalance: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      rating: { type: Number, min: 0, max: 5, default: 0 },
      reviewCount: { type: Number, default: 0 }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isBanned: {
      type: Boolean,
      default: false
    },
    banReason: {
      type: String,
      default: null
    },

    // Cài đặt cá nhân
    language: {
      type: String,
      enum: ['vi', 'en'],
      default: 'vi'
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'auto'],
      default: 'dark'
    },

    // Xác thực email
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      select: false
    },
    emailVerificationExpires: {
      type: Date,
      select: false
    },

    // Reset mật khẩu
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      select: false
    },

    // Thống kê
    lastLogin: {
      type: Date,
      default: null
    },
    loginCount: {
      type: Number,
      default: 0
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
    timestamps: true, // Tự động cập nhật createdAt và updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ==================== INDEXES ====================
userSchema.index({ email: 1 });
userSchema.index({ discordId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// ==================== VIRTUALS ====================
// Virtual để lấy tổng số dư quy đổi sang Gem
userSchema.virtual('totalBalanceInGem').get(function () {
  // Giả sử 1 Coin = 10 Gem
  return this.gem + this.coin * 10;
});

// Virtual để lấy display name
userSchema.virtual('displayName').get(function () {
  return this.discordUsername || this.username;
});

// ==================== MIDDLEWARE ====================
// Hash password trước khi save
userSchema.pre('save', async function (next) {
  // Chỉ hash nếu password được thay đổi và không null
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Cập nhật updatedAt
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// ==================== METHODS ====================
// So sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Cộng Gem
userSchema.methods.addGem = async function (amount) {
  this.gem += amount;
  return await this.save();
};

// Trừ Gem (có kiểm tra số dư)
userSchema.methods.deductGem = async function (amount) {
  if (this.gem < amount) {
    throw new Error('Số dư Gem không đủ');
  }
  this.gem -= amount;
  return await this.save();
};

// Cộng Coin
userSchema.methods.addCoin = async function (amount) {
  this.coin += amount;
  return await this.save();
};

// Trừ Coin
userSchema.methods.deductCoin = async function (amount) {
  if (this.coin < amount) {
    throw new Error('Số dư Coin không đủ');
  }
  this.coin -= amount;
  return await this.save();
};

// Cập nhật thời gian đăng nhập
userSchema.methods.updateLoginStats = async function () {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return await this.save();
};

// Kiểm tra có phải admin
userSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};

// Kiểm tra có phải support
userSchema.methods.isSupport = function () {
  return this.role === 'support' || this.role === 'admin';
};

// ==================== STATIC METHODS ====================
// Tìm user theo email hoặc username
userSchema.statics.findByCredentials = async function (identifier) {
  return await this.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
  }).select('+password');
};

const User = mongoose.model('User', userSchema);

export default User;
