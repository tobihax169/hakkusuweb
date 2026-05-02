<template>
  <div class="min-h-screen py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-500/20 rounded-full mb-4">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="text-sm font-medium text-blue-600 dark:text-blue-400">Điều khoản dịch vụ</span>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4">
          Điều khoản sử dụng
        </h1>
        <p class="text-slate-600 dark:text-slate-400">Cập nhật lần cuối: Tháng 5, 2026</p>
      </div>

      <!-- Content -->
      <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 md:p-12">
        <div class="prose dark:prose-invert max-w-none prose-headings:text-slate-800 dark:prose-headings:text-slate-200 prose-p:text-slate-600 dark:prose-p:text-slate-400">
          
          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
              Chấp nhận điều khoản
            </h2>
            <p class="leading-relaxed">
              Bằng việc truy cập và sử dụng dịch vụ của <strong class="text-blue-600 dark:text-blue-400">はっくす Hakkusu Store</strong>, 
              bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện này. 
              Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
              Dịch vụ của chúng tôi
            </h2>
            <p class="leading-relaxed mb-4">
              Hakkusu Store là marketplace trực tuyến cho phép người dùng mua và bán các sản phẩm, dịch vụ số. 
              Chúng tôi cung cấp nền tảng để kết nối người mua và người bán (seller).
            </p>
            <ul class="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
              <li>Mua bán tài khoản game, phần mềm, dịch vụ số</li>
              <li>Hệ thống bảo vệ người mua (Buyer Protection)</li>
              <li>Thanh toán qua nhiều phương thức</li>
              <li>Hỗ trợ khách hàng 24/7</li>
            </ul>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
              Tài khoản người dùng
            </h2>
            <p class="leading-relaxed mb-4">
              Khi tạo tài khoản, bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật. 
              Bạn chịu trách nhiệm bảo mật tài khoản và mật khẩu của mình.
            </p>
            <div class="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4 border-l-4 border-blue-400">
              <p class="text-sm text-blue-800 dark:text-blue-300">
                <strong>Lưu ý:</strong> Bạn phải từ đủ 18 tuổi hoặc có sự đồng ý của cha mẹ/người giám hộ để sử dụng dịch vụ.
              </p>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">4</span>
              Quy định cho Seller
            </h2>
            <p class="leading-relaxed mb-4">
              Người bán (Seller) phải tuân thủ các quy định sau:
            </p>
            <ul class="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
              <li>Cung cấp sản phẩm/dịch vụ đúng như mô tả</li>
              <li>Giao hàng đúng thời hạn đã cam kết</li>
              <li>Không bán hàng cấm, hàng vi phạm pháp luật</li>
              <li>Duy trì uy tín và chất lượng dịch vụ</li>
              <li>Chịu phí hoa hồng theo quy định của nền tảng</li>
            </ul>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">5</span>
              Thanh toán và hoàn tiền
            </h2>
            <p class="leading-relaxed mb-4">
              Chúng tôi sử dụng hệ thống bảo vệ người mua. Tiền sẽ được giữ lại cho đến khi người mua xác nhận nhận được sản phẩm.
            </p>
            <ul class="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
              <li>Hoàn tiền đầy đủ nếu không nhận được sản phẩm</li>
              <li>Hoàn tiền một phần nếu sản phẩm không đúng mô tả</li>
              <li>Thời gian xử lý hoàn tiền: 3-7 ngày làm việc</li>
            </ul>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">6</span>
              Hành vi bị cấm
            </h2>
            <p class="leading-relaxed mb-4">
              Các hành vi sau bị nghiêm cấm và sẽ dẫn đến khóa tài khoản:
            </p>
            <ul class="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
              <li>Lừa đảo, gian lận giao dịch</li>
              <li>Bán hàng cấm, hàng vi phạm bản quyền</li>
              <li>Sử dụng bot, script tự động hóa giao dịch</li>
              <li>Quấy rối, đe dọa người dùng khác</li>
              <li>Tạo nhiều tài khoản để trốn tránh kiểm soát</li>
            </ul>
          </section>

          <section class="mb-10">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">7</span>
              Liên hệ
            </h2>
            <p class="leading-relaxed">
              Nếu có thắc mắc về điều khoản, vui lòng liên hệ:
            </p>
            <div class="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <a href="mailto:support@hakkusu.store" class="hover:underline">support@hakkusu.store</a>
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
// Terms of Service View
</script>
