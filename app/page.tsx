"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, isAdmin } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      // Nếu đã đăng nhập, chuyển hướng đến trang phù hợp
      if (isAdmin(user)) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF2EB] via-[#FFE8CD] to-[#FFD6BA]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center">
          <div className="mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/50">
              <span className="text-2xl sm:text-3xl lg:text-4xl">💰</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-4">Ví Của Tui</h1>
            <p className="text-base sm:text-lg lg:text-xl text-black/80 mb-8 max-w-2xl mx-auto px-4">
              Quản lý chi tiêu cá nhân thông minh, theo dõi tài chính dễ dàng. Giúp bạn kiểm soát ngân sách và đạt được
              mục tiêu tài chính.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 font-semibold px-6 sm:px-8 py-3 shadow-xl border border-gray-200 transition-all duration-300"
              >
                Bắt đầu miễn phí
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-black text-black hover:bg-black hover:text-white px-6 sm:px-8 py-3 transition-all duration-300"
              >
                Đăng nhập
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-16 px-4">
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 text-black border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-3xl sm:text-4xl mb-4">📊</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Theo dõi chi tiêu</h3>
              <p className="text-black/70 text-sm sm:text-base">
                Ghi chép và phân loại chi tiêu theo danh mục một cách dễ dàng
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 text-black border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-3xl sm:text-4xl mb-4">📈</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Thống kê trực quan</h3>
              <p className="text-black/70 text-sm sm:text-base">
                Biểu đồ và báo cáo chi tiết giúp bạn hiểu rõ thói quen chi tiêu
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 text-black border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Mục tiêu tài chính</h3>
              <p className="text-black/70 text-sm sm:text-base">Đặt mục tiêu và theo dõi tiến độ tiết kiệm của bạn</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
