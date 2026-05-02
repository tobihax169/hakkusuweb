<template>
  <footer class="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-1">
          <div class="mb-4">
            <span class="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              はっくす
            </span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Marketplace mua bán sản phẩm và dịch vụ trực tuyến hiện đại.
          </p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-4">Dịch vụ</h3>
          <ul class="space-y-3">
            <li>
              <router-link to="/services" class="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                Khám phá sản phẩm
              </router-link>
            </li>
            <li>
              <router-link to="/orders" class="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                Đơn hàng của tôi
              </router-link>
            </li>
            <li>
              <router-link to="/seller/register" class="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                Trở thành Seller
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-4">Tài khoản</h3>
          <ul class="space-y-3">
            <li>
              <router-link to="/user/profile" class="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                Hồ sơ
              </router-link>
            </li>
            <li>
              <router-link to="/user/wallet" class="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                Ví của tôi
              </router-link>
            </li>
            <li>
              <router-link to="/auth/login" class="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                Đăng nhập
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-4">Liên hệ</h3>
          <ul class="space-y-3">
            <li class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              support@hakkusu.store
            </li>
            <li class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Việt Nam
            </li>
          </ul>
          
          <!-- Social Links -->
          <div class="flex items-center gap-3 mt-4">
            <a href="#" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-all">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-all">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.995 16.88l-3.23-4.5-4.5 4.5H8.1l5.4-6.3-5.4-6.3h1.665l4.5 4.5 3.23-4.5h1.665l-5.4 6.3 5.4 6.3h-1.665z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-slate-400 dark:text-slate-500">
          © {{ currentYear }} はっくす Hakkusu Store. All rights reserved.
        </p>
        <div class="flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500">
          <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Điều khoản</a>
          <span class="text-slate-300">|</span>
          <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Bảo mật</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
