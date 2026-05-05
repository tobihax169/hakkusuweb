<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-white mb-8">Điều khoản dịch vụ</h1>
      
      <GlassCard class="p-8 space-y-6">
        <section>
          <h2 class="text-xl font-semibold text-white mb-4">1. Giới thiệu</h2>
          <p class="text-slate-400 leading-relaxed">
            Chào mừng bạn đến với Hakkusu Store. Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-white mb-4">2. Tài khoản người dùng</h2>
          <p class="text-slate-400 leading-relaxed">
            Bạn cần tạo tài khoản để sử dụng một số tính năng của chúng tôi. Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra trên tài khoản của mình.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-white mb-4">3. Giao dịch</h2>
          <p class="text-slate-400 leading-relaxed">
            Tất cả giao dịch trên nền tảng đều được bảo vệ. Người mua và người bán cần tuân thủ các quy định về thanh toán và giao hàng.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-white mb-4">4. Quyền và trách nhiệm</h2>
          <p class="text-slate-400 leading-relaxed">
            Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản vi phạm các điều khoản này. Người dùng cần đảm bảo thông tin cung cấp là chính xác và hợp pháp.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-white mb-4">5. Liên hệ</h2>
          <p class="text-slate-400 leading-relaxed">
            Nếu có bất kỳ câu hỏi nào về điều khoản dịch vụ, vui lòng liên hệ với chúng tôi qua email: support@hakkusu.store
          </p>
        </section>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import GlassCard from '@/components/ui/GlassCard.vue';
</script>
