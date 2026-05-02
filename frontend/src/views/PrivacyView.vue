<template>
  <div class="min-h-screen py-12 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-full mb-4">
          <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400">Bảo mật & Quyền riêng tư</span>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
          Chính sách bảo mật
        </h1>
        <p class="text-slate-600 dark:text-slate-400">Cập nhật lần cuối: Tháng 5, 2026</p>
      </div>

      <!-- Content -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 md:p-12">
        <div class="prose dark:prose-invert max-w-none prose-headings:text-slate-800 dark:prose-headings:text-slate-200 prose-p:text-slate-600 dark:prose-p:text-slate-400">
          
          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">1</span>
              Cam kết bảo mật
            </h2>
            <p class="leading-relaxed">
              <strong class="text-indigo-600 dark:text-indigo-400">はっくす Hakkusu Store</strong> cam kết bảo vệ thông tin cá nhân của bạn. 
              Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn khi sử dụng dịch vụ.
            </p>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">2</span>
              Thông tin chúng tôi thu thập
            </h2>
            <p class="leading-relaxed mb-4">
              Chúng tôi thu thập các loại thông tin sau:
            </p>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Thông tin cá nhân
                </h3>
                <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Tên, email, số điện thoại</li>
                  <li>• Địa chỉ thanh toán</li>
                  <li>• Ảnh đại diện</li>
                </ul>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  Thông tin giao dịch
                </h3>
                <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Lịch sử mua bán</li>
                  <li>• Số dư ví (Gem, Coin)</li>
                  <li>• Phương thức thanh toán</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">3</span>
              Cách chúng tôi sử dụng thông tin
            </h2>
            <p class="leading-relaxed mb-4">
              Thông tin của bạn được sử dụng cho các mục đích:
            </p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <span class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                <span class="text-slate-600 dark:text-slate-400">Xử lý giao dịch và thanh toán</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                <span class="text-slate-600 dark:text-slate-400">Bảo vệ tài khoản và phát hiện gian lận</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                <span class="text-slate-600 dark:text-slate-400">Hỗ trợ khách hàng</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold flex-shrink-0 mt-0.5">✓</span>
                <span class="text-slate-600 dark:text-slate-400">Cải thiện dịch vụ và trải nghiệm người dùng</span>
              </li>
            </ul>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">4</span>
              Bảo mật dữ liệu
            </h2>
            <p class="leading-relaxed mb-4">
              Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt:
            </p>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div class="w-12 h-12 mx-auto mb-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-sm">Mã hóa SSL</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Tất cả dữ liệu truyền tải đều được mã hóa</p>
              </div>
              <div class="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div class="w-12 h-12 mx-auto mb-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-sm">Xác thực 2FA</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Hỗ trợ xác thực hai yếu tố</p>
              </div>
              <div class="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div class="w-12 h-12 mx-auto mb-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-sm">Audit Log</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Ghi nhận mọi hoạt động quan trọng</p>
              </div>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">5</span>
              Quyền của bạn
            </h2>
            <p class="leading-relaxed mb-4">
              Bạn có các quyền sau đối với dữ liệu cá nhân:
            </p>
            <ul class="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
              <li>Quyền truy cập thông tin cá nhân</li>
              <li>Quyền chỉnh sửa thông tin không chính xác</li>
              <li>Quyền yêu cầu xóa dữ liệu (trong phạm vi pháp luật)</li>
              <li>Quyền rút lại sự đồng ý sử dụng dữ liệu</li>
            </ul>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">6</span>
              Cookies và Tracking
            </h2>
            <p class="leading-relaxed">
              Chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng, ghi nhớ đăng nhập và phân tích lưu lượng. 
              Bạn có thể tắt cookies trong cài đặt trình duyệt, nhưng một số tính năng có thể không hoạt động.
            </p>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-bold">7</span>
              Liên hệ bảo mật
            </h2>
            <p class="leading-relaxed">
              Nếu bạn có câu hỏi về chính sách bảo mật hoặc muốn báo cáo vấn đề:
            </p>
            <div class="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <a href="mailto:support@hakkusu.store" class="flex items-center gap-2 hover:underline">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                support@hakkusu.store
              </a>
              <span class="hidden sm:block text-slate-400">|</span>
              <span class="text-sm text-slate-500">Phản hồi trong 24 giờ</span>
            </div>
          </section>

        </div>
      </div>

      <!-- Back button -->
      <div class="mt-8 text-center">
        <router-link 
          to="/" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Quay lại trang chủ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Privacy Policy View
</script>
