<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
            </div>
            <span class="text-lg font-bold text-gray-900 dark:text-white">Hakkusu Shop</span>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Marketplace mua bán sản phẩm và dịch vụ trực tuyến.
          </p>
        </div>

        <!-- Links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Dịch vụ</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/services" class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Gói dịch vụ
              </router-link>
            </li>
            <li>
              <router-link to="/orders" class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Đơn hàng
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Tài khoản</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/user/profile" class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Hồ sơ
              </router-link>
            </li>
            <li>
              <router-link to="/user/wallet" class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Ví của tôi
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Liên hệ</h3>
          <ul class="space-y-2">
            <li class="text-sm text-gray-500 dark:text-gray-400">
              support@discordbot.com
            </li>
            <li class="flex gap-4 mt-4">
              <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span class="sr-only">Discord</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-center text-gray-400 dark:text-gray-500">
          © {{ currentYear }} Hakkusu Shop. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
