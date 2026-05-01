// ==================== CONSTANTS CHUNG CHO FRONTEND & BACKEND ====================

// Vai trò người dùng
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPPORT: 'support'
};

// Trạng thái đơn hàng
export const ORDER_STATUS = {
  PENDING: 'pending',       // Đang chờ thanh toán/xác nhận
  PROCESSING: 'processing', // Đang xử lý
  COMPLETED: 'completed',     // Hoàn thành
  CANCELLED: 'cancelled',   // Đã hủy
  REFUNDED: 'refunded'      // Đã hoàn tiền
};

// Loại giao dịch
export const TRANSACTION_TYPE = {
  TOPUP: 'topup',           // Nạp tiền
  PAYMENT: 'payment',       // Thanh toán đơn hàng
  REFUND: 'refund',         // Hoàn tiền
  BONUS: 'bonus',           // Thưởng/thêm tiền
  WITHDRAW: 'withdraw'      // Rút tiền
};

// Loại tiền tệ
export const CURRENCY = {
  GEM: 'gem',               // Tiền trong app (Gem)
  COIN: 'coin',             // Tiền trong app (Coin)
  VND: 'vnd',               // Việt Nam Đồng
  USD: 'usd'                // US Dollar
};

// Trạng thái giao dịch
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// Phương thức thanh toán
export const PAYMENT_METHOD = {
  QR: 'qr_code',
  BANK: 'bank_transfer',
  WALLET: 'wallet',         // Thanh toán bằng Gem/Coin
  CARD: 'card'
};

// Các gói dịch vụ mặc định
export const DEFAULT_PACKAGES = [
  {
    id: 'basic',
    name: 'Gói Cơ Bản',
    nameEn: 'Basic Package',
    description: 'Bot với các tính năng cơ bản cho server nhỏ',
    descriptionEn: 'Bot with basic features for small servers',
    price: 99000,
    currency: CURRENCY.VND,
    icon: 'CubeIcon',
    features: [
      'Lệnh cơ bản (ping, help, info)',
      'Hệ thống welcome/leave',
      'Moderation đơn giản',
      'Hỗ trợ trong 7 ngày'
    ],
    featuresEn: [
      'Basic commands (ping, help, info)',
      'Welcome/leave system',
      'Simple moderation',
      '7-day support'
    ],
    isActive: true,
    popular: false
  },
  {
    id: 'vip',
    name: 'Gói VIP',
    nameEn: 'VIP Package',
    description: 'Nhiều tính năng nâng cao cho server phát triển',
    descriptionEn: 'Advanced features for growing servers',
    price: 299000,
    currency: CURRENCY.VND,
    icon: 'StarIcon',
    features: [
      'Tất cả tính năng Cơ Bản',
      'Music bot tích hợp',
      'Leveling system',
      'Custom commands',
      'Hỗ trợ trong 30 ngày'
    ],
    featuresEn: [
      'All Basic features',
      'Integrated music bot',
      'Leveling system',
      'Custom commands',
      '30-day support'
    ],
    isActive: true,
    popular: true
  },
  {
    id: 'premium',
    name: 'Gói Premium',
    nameEn: 'Premium Package',
    description: 'Giải pháp hoàn chỉnh cho server chuyên nghiệp',
    descriptionEn: 'Complete solution for professional servers',
    price: 599000,
    currency: CURRENCY.VND,
    icon: 'CrownIcon',
    features: [
      'Tất cả tính năng VIP',
      'Dashboard quản lý web',
      'Tích hợp API bên thứ 3',
      'Database riêng',
      'Hỗ trợ 24/7 trong 90 ngày'
    ],
    featuresEn: [
      'All VIP features',
      'Web management dashboard',
      'Third-party API integration',
      'Dedicated database',
      '24/7 support for 90 days'
    ],
    isActive: true,
    popular: false
  },
  {
    id: 'custom',
    name: 'Gói Custom',
    nameEn: 'Custom Package',
    description: 'Thiết kế bot theo yêu cầu riêng của bạn',
    descriptionEn: 'Custom bot designed to your requirements',
    price: 0,
    currency: CURRENCY.VND,
    icon: 'PuzzlePieceIcon',
    features: [
      'Báo giá theo yêu cầu',
      'Tính năng tùy chỉnh hoàn toàn',
      'Source code đầy đủ',
      'Hỗ trợ kỹ thuật 6 tháng'
    ],
    featuresEn: [
      'Quote based on requirements',
      'Fully customized features',
      'Complete source code',
      '6-month technical support'
    ],
    isActive: true,
    popular: false
  }
];

// Ngôn ngữ hỗ trợ
export const LANGUAGES = {
  VI: 'vi',
  EN: 'en'
};

// Theme
export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  AUTO: 'auto'
};

// Tỷ giá quy đổi (1 Gem = ? VND)
export const EXCHANGE_RATE = {
  GEM_TO_VND: 1000,
  COIN_TO_GEM: 10
};

// Pagination mặc định
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};
