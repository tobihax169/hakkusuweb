<template>
  <div class="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
    </div>

    <div class="relative z-10 max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-white mb-8">Chính sách bảo mật</h1>
      
      <GlassCard class="p-8 space-y-6">
        <section>
          <h2 class="text-xl font-semibold text-white mb-4">1. Thông tin chúng tôi thu thập</h2>
          <p class="text-slate-400 leading-relaxed">
            Chúng tôi thu thập thông tin cá nhân như tên, email, số điện thoại khi bạn đăng ký tài khoản. Thông tin thanh toán được xử lý an toàn thông qua các đối tác thanh toán đáng tin cậy.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-white mb-4">2. Cách chúng tôi sử dụng thông tin</h2>
          <p class="text-slate-400 leading-relaxed">
            Thông tin của bạn được sử dụng để cung cấp và cải thiện dịch vụ, xử lý giao dịch, gửi thông báo quan trọng và hỗ trợ khách hàng.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-white mb-4">3. Bảo mật thông tin</h2>
          <p class="text-slate-400 leading-relaxed">
            Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn. Dữ liệu được mã hóa và lưu trữ trên các máy chủ an toàn.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-white mb-4">4. Chia sẻ thông tin</h2>
          <p class="text-slate-400 leading-relaxed">
            Chúng tôi không bán thông tin cá nhân cho bên thứ ba. Thông tin chỉ được chia sẻ khi cần thiết để cung cấp dịch vụ hoặc theo yêu cầu pháp lý.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-white mb-4">5. Quyền của bạn</h2>
          <p class="text-slate-400 leading-relaxed">
            Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình. Liên hệ với chúng tôi để thực hiện các quyền này.
          </p>
        </section>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import GlassCard from '@/components/ui/GlassCard.vue';
</script>
