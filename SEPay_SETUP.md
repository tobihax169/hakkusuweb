# SePay Payment Integration Setup

## Cấu hình Environment Variables

Thêm các biến môi trường sau vào file `.env` của backend:

```env
# SePay Configuration
SEPAY_API_URL=https://api.sepay.vn
SEPAY_API_TOKEN=your_sepay_api_token_here
SEPAY_BANK_ID=MB
SEPAY_ACCOUNT_NUMBER=your_bank_account_number
SEPAY_ACCOUNT_NAME=YOUR_NAME
SEPAY_WEBHOOK_SECRET=your_webhook_secret
```

## Hướng dẫn lấy API Token từ SePay

1. Đăng ký tài khoản tại [https://sepay.vn](https://sepay.vn)
2. Vào phần **API & Webhook** trong dashboard
3. Tạo API Token mới
4. Copy token và điền vào `SEPAY_API_TOKEN`
5. Copy Webhook Secret và điền vào `SEPAY_WEBHOOK_SECRET`

## Cấu hình Webhook

Trong dashboard SePay, cấu hình webhook URL:

```
https://your-api-domain.com/api/payments/sepay/webhook
```

**Lưu ý:** Webhook phải là HTTPS trong production.

## API Endpoints

### User Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/payments/sepay/topup` | Tạo yêu cầu nạp tiền |
| GET | `/api/payments/sepay/config` | Lấy cấu hình SePay |
| GET | `/api/payments/sepay/history` | Lịch sử giao dịch |
| GET | `/api/payments/sepay/:code/status` | Kiểm tra trạng thái |
| PUT | `/api/payments/sepay/:code/cancel` | Hủy giao dịch |

### Webhook Endpoint

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/payments/sepay/webhook` | Nhận thông báo từ SePay |

### Admin Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/payments/sepay/admin/all` | Tất cả giao dịch SePay |
| GET | `/api/payments/sepay/admin/stats` | Thống kê giao dịch |

## Flow thanh toán

1. User chọn số tiền nạp
2. Frontend gọi `POST /api/payments/sepay/topup`
3. Backend tạo transaction và QR code
4. Frontend hiển thị QR code cho user
5. User quét QR và chuyển khoản
6. SePay gửi webhook khi nhận được tiền
7. Backend xử lý webhook và cộng Gem cho user
8. Frontend poll status hoặc dùng WebSocket để cập nhật

## Lưu ý quan trọng

- Số tiền tối thiểu: 10,000 VND
- Số tiền tối đa: 100,000,000 VND
- QR code hết hạn sau 24 giờ
- Nội dung chuyển khoản phải chứa mã giao dịch (format: `TOPUP TOPxxxxxx`)
- Webhook có thể gửi nhiều lần, cần kiểm tra trạng thái transaction

## Fallback khi SePay API lỗi

Nếu SePay API không khả dụng, hệ thống sẽ tự động chuyển sang dùng **VietQR** - chuẩn QR chung của Napas, user vẫn có thể quét QR và chuyển khoản bình thường.
