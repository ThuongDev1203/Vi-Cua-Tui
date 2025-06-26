import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ví Của Tui - Quản lý chi tiêu cá nhân",
  description: "Ứng dụng quản lý chi tiêu cá nhân thông minh, giúp bạn theo dõi và kiểm soát tài chính hiệu quả.",
  keywords: "quản lý chi tiêu, tài chính cá nhân, ngân sách, tiết kiệm",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
