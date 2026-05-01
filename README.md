# Discord Web Platform

Nền tảng Web dịch vụ Custom Bot Discord - Hệ thống quản lý đơn hàng, thanh toán và cấu hình Bot Discord.

## Tính Năng

### User Features
- **Đăng nhập/Đăng ký**: Email/Password và Discord OAuth2
- **Quản lý Profile**: Thông tin cá nhân, ngôn ngữ, giao diện
- **Ví điện tử**: Quản lý Gem/Coin, nạp tiền, lịch sử giao dịch
- **Đặt hàng**: Chọn gói dịch vụ, thanh toán, theo dõi trạng thái

### Admin Features
- **Dashboard**: Thống kê tổng quan
- **Quản lý Users**: Xem, chỉnh sửa, khóa/mở tài khoản
- **Quản lý Orders**: Cập nhật trạng thái đơn hàng
- **Quản lý Services**: Thêm/sửa/xóa gói dịch vụ

## Công Nghệ

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Discord OAuth2 (Passport.js)
- Joi Validation

### Frontend
- Vue.js 3 (Composition API + `<script setup>`)
- Vite
- TailwindCSS
- Pinia (State Management)
- Vue Router
- vue-i18n (Đa ngôn ngữ)

## Cấu Trúc Thư Mục

```
discord-web-platform/
├── backend/              # Backend Node.js
│   ├── src/
│   │   ├── config/       # Database, Passport
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Auth, Rate limiting, Error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Utils, Validators
│   │   └── app.js        # Entry point
│   └── package.json
│
├── frontend/             # Frontend Vue 3
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── locales/      # i18n files
│   │   ├── router/
│   │   ├── services/     # API calls
│   │   ├── stores/       # Pinia stores
│   │   └── views/
│   └── package.json
│
└── shared/               # Shared constants
```

## Cài Đặt

### Yêu cầu
- Node.js 18+
- MongoDB

### Backend Setup

```bash
cd backend
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn:
# - MongoDB URI
# - JWT Secret
# - Discord App credentials

# Chạy development
npm run dev

# Hoặc production
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Seed Database

```bash
cd backend
npm run seed
```

Mặc định tạo:
- Admin: `admin@example.com` / `admin123`
- Support: `support@example.com` / `support123`
- Demo: `demo@example.com` / `demo123`

## Môi Trường Production

```bash
# Build frontend
cd frontend
npm run build

# Copy dist vào backend public (nếu cần)
# Hoặc serve frontend riêng
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/discord` - Discord OAuth
- `GET /api/auth/me` - Lấy thông tin user

### Orders
- `GET /api/orders` - Danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `POST /api/orders/:id/pay` - Thanh toán

### Services
- `GET /api/services` - Danh sách gói dịch vụ

### Payments
- `GET /api/payments/history` - Lịch sử giao dịch
- `POST /api/payments/topup` - Nạp tiền

### Admin (cần quyền admin)
- `GET /api/admin/users` - Danh sách users
- `GET /api/admin/orders` - Danh sách tất cả đơn hàng
- `GET /api/admin/services` - Quản lý services

## Discord OAuth Setup

1. Tạo app tại https://discord.com/developers/applications
2. Thêm redirect URI: `http://localhost:5000/api/auth/discord/callback`
3. Copy Client ID và Secret vào `.env`

## Tích Hợp Thanh Toán

Hiện tại hỗ trợ:
- Thanh toán bằng Gem/Coin (Wallet)
- QR Code (Demo - cần tích hợp provider thực)

Để tích hợp provider thực (Momo, VNPay, etc.), cập nhật `payment.controller.js` trong backend.

## Đóng Góp

1. Fork repository
2. Tạo branch mới
3. Commit changes
4. Push và tạo Pull Request

## License

MIT License
