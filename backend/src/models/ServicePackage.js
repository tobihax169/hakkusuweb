import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  textEn: {
    type: String,
    default: ''
  },
  included: {
    type: Boolean,
    default: true
  }
});

const servicePackageSchema = new mongoose.Schema(
  {
    // Mã gói (unique)
    packageId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    // Tên gói
    name: {
      type: String,
      required: [true, 'Tên gói là bắt buộc'],
      trim: true
    },
    nameEn: {
      type: String,
      default: ''
    },

    // Mô tả
    description: {
      type: String,
      required: [true, 'Mô tả là bắt buộc']
    },
    descriptionEn: {
      type: String,
      default: ''
    },

    // Giá cả
    price: {
      type: Number,
      required: [true, 'Giá là bắt buộc'],
      min: [0, 'Giá không thể âm']
    },
    currency: {
      type: String,
      enum: ['vnd', 'usd', 'gem', 'coin'],
      default: 'vnd'
    },
    category: {
      type: String,
      enum: ['game', 'software', 'mobile', 'giftcard', 'service', 'other'],
      default: 'other',
      index: true
    },

    // Icon/Emoji đại diện
    icon: {
      type: String,
      default: 'CubeIcon'
    },
    iconUrl: {
      type: String,
      default: null
    },

    // Danh sách tính năng
    features: [featureSchema],

    // Sắp xếp (thứ tự hiển thị)
    sortOrder: {
      type: Number,
      default: 0
    },

    // Hiển thị là gói phổ biến
    popular: {
      type: Boolean,
      default: false
    },

    // Trạng thái
    isActive: {
      type: Boolean,
      default: true
    },

    // Giới hạn sử dụng (nếu có)
    limits: {
      maxOrders: { type: Number, default: null }, // null = không giới hạn
      maxServers: { type: Number, default: null },
      supportDuration: { type: Number, default: 30 }, // Số ngày hỗ trợ
    },

    // Metadata bổ sung
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    isAccountListing: {
      type: Boolean,
      default: false,
      index: true
    },
    highValueThreshold: {
      type: Number,
      default: 5000000,
      min: 0
    },

    // Người tạo/cập nhật
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // Thông tin seller (cho marketplace)
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    isMarketplaceItem: {
      type: Boolean,
      default: false,
      index: true
    },
    
    // Trạng thái duyệt sản phẩm
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved' // Sản phẩm của admin auto approved
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    
    // Phí nền tảng (mặc định 30%)
    platformFeePercentage: {
      type: Number,
      default: 30,
      min: 0,
      max: 100
    },
    
    // Thống kê bán hàng
    salesCount: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },

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
servicePackageSchema.index({ isActive: 1, sortOrder: 1 });
servicePackageSchema.index({ popular: 1 });
servicePackageSchema.index({ price: 1 });
servicePackageSchema.index({ isActive: 1, approvalStatus: 1, isMarketplaceItem: 1, category: 1 });

// ==================== VIRTUALS ====================
// Giá đã định dạng
servicePackageSchema.virtual('formattedPrice').get(function () {
  const symbols = {
    vnd: '₫',
    usd: '$',
    gem: '💎',
    coin: '🪙'
  };
  
  if (this.price === 0) {
    return 'Liên hệ';
  }
  
  if (this.currency === 'vnd') {
    return `${this.price.toLocaleString('vi-VN')} ${symbols[this.currency]}`;
  }
  
  return `${this.price} ${symbols[this.currency]}`;
});

// ==================== MIDDLEWARE ====================
servicePackageSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// ==================== METHODS ====================
// Lấy thông tin theo ngôn ngữ
servicePackageSchema.methods.getLocalized = function (lang = 'vi') {
  const isEnglish = lang === 'en';
  
  return {
    id: this.packageId,
    name: isEnglish && this.nameEn ? this.nameEn : this.name,
    description: isEnglish && this.descriptionEn ? this.descriptionEn : this.description,
    price: this.price,
    currency: this.currency,
    formattedPrice: this.formattedPrice,
    icon: this.icon,
    iconUrl: this.iconUrl,
    category: this.category || this.metadata?.category || 'other',
    features: this.features.map(f => ({
      text: isEnglish && f.textEn ? f.textEn : f.text,
      included: f.included
    })),
    popular: this.popular,
    limits: this.limits,
    isActive: this.isActive,
    isMarketplaceItem: this.isMarketplaceItem,
    seller: this.sellerId || null,
    approvalStatus: this.approvalStatus,
    viewCount: this.metadata?.views || 0
  };
};

// ==================== STATIC METHODS ====================
// Lấy danh sách gói đang active + đã duyệt theo điều kiện filter marketplace
servicePackageSchema.statics.getActivePackages = async function (lang = 'vi', options = {}) {
  const {
    search,
    category,
    sort = 'popular',
    sellerId,
    marketplaceOnly = true,
    page = 1,
    limit = 50
  } = options;

  const query = {
    isActive: true,
    approvalStatus: 'approved'
  };

  if (marketplaceOnly) {
    query.isMarketplaceItem = true;
  }
  if (sellerId) {
    query.sellerId = sellerId;
  }
  if (category && category !== 'all') {
    query.category = category;
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { nameEn: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { descriptionEn: { $regex: search, $options: 'i' } }
    ];
  }

  const sortMap = {
    popular: { popular: -1, salesCount: -1, sortOrder: 1, price: 1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 }
  };

  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
  const safePage = Math.max(parseInt(page, 10) || 1, 1);

  const packages = await this.find(query)
    .sort(sortMap[sort] || sortMap.popular)
    .skip((safePage - 1) * safeLimit)
    .limit(safeLimit)
    .populate('sellerId', 'username sellerInfo.businessName')
    .lean();
  
  return packages.map(pkg => {
    const doc = new this(pkg);
    return doc.getLocalized(lang);
  });
};

// Lấy gói theo ID
servicePackageSchema.statics.getByPackageId = async function (packageId, lang = 'vi') {
  const pkg = await this.findOne({
    packageId,
    isActive: true,
    approvalStatus: 'approved'
  }).populate('sellerId', 'username sellerInfo.businessName');
  
  if (!pkg) return null;
  
  return pkg.getLocalized(lang);
};

const ServicePackage = mongoose.model('ServicePackage', servicePackageSchema);

export default ServicePackage;
