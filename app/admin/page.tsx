"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, getUserStats } from "@/lib/auth"
import { getAllExpenses } from "@/lib/expenses"
import type { User } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Users, TrendingUp, Calendar, Database } from "lucide-react"

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [allExpenses, setAllExpenses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    // Only allow demo user to access admin (for demo purposes)
    if (currentUser.email !== "demo@example.com") {
      router.push("/dashboard")
      return
    }

    setUser(currentUser)

    // Get user statistics
    const userStats = getUserStats()
    setStats(userStats)

    // Get all expenses for statistics
    const expenses = getAllExpenses()
    setAllExpenses(expenses)

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD6BA]"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  const totalExpenseAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black flex items-center gap-3">
            <Database className="h-8 w-8 text-[#FFD6BA]" />
            Quản trị hệ thống
          </h1>
          <p className="text-black/70 text-sm sm:text-base mt-2">
            Thống kê tổng quan về người dùng và hoạt động của hệ thống
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-[#FFDCDC] to-[#FFF2EB] border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Tổng người dùng</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-black/70">Đã đăng ký</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#FFE8CD] to-[#FFD6BA] border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Người dùng mới</CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.newUsersThisMonth || 0}</div>
              <p className="text-xs text-black/70">Tháng này</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#FFF2EB] to-[#FFDCDC] border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Tổng giao dịch</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{allExpenses.length}</div>
              <p className="text-xs text-black/70">Tất cả thời gian</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#FFD6BA] to-[#FFE8CD] border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Tổng giá trị</CardTitle>
              <span className="text-xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalExpenseAmount.toLocaleString("vi-VN")} ₫</div>
              <p className="text-xs text-black/70">Chi tiêu tổng</p>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-black">Danh sách người dùng</CardTitle>
              <CardDescription className="text-black/70">Tất cả người dùng đã đăng ký trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {/* Demo User */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FFF2EB] to-[#FFE8CD] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] rounded-full flex items-center justify-center">
                      <span className="text-black font-semibold text-sm">D</span>
                    </div>
                    <div>
                      <p className="font-medium text-black text-sm">Người dùng Demo</p>
                      <p className="text-xs text-black/70">demo@example.com</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Demo
                  </Badge>
                </div>

                {/* Registered Users */}
                {stats?.allUsers?.map((user: any, index: number) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FFDCDC] to-[#FFF2EB] rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#FFE8CD] to-[#FFD6BA] rounded-full flex items-center justify-center">
                        <span className="text-black font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-black text-sm">{user.name}</p>
                        <p className="text-xs text-black/70">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="text-xs mb-1">
                        Người dùng
                      </Badge>
                      <p className="text-xs text-black/70">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>
                ))}

                {(!stats?.allUsers || stats.allUsers.length === 0) && (
                  <div className="text-center py-8 text-black/50">
                    <p className="text-sm">Chưa có người dùng mới đăng ký</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-black">Thông tin hệ thống</CardTitle>
              <CardDescription className="text-black/70">Chi tiết về hoạt động của ứng dụng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#FFF2EB] to-[#FFE8CD] rounded-lg">
                <h4 className="font-semibold text-black mb-2">Thống kê lưu trữ</h4>
                <div className="space-y-2 text-sm text-black/80">
                  <div className="flex justify-between">
                    <span>Người dùng:</span>
                    <span className="font-medium">{stats?.totalUsers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giao dịch:</span>
                    <span className="font-medium">{allExpenses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dung lượng:</span>
                    <span className="font-medium">
                      {Math.round((JSON.stringify(stats).length + JSON.stringify(allExpenses).length) / 1024)} KB
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[#FFDCDC] to-[#FFF2EB] rounded-lg">
                <h4 className="font-semibold text-black mb-2">Trạng thái hệ thống</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-black/80">Database: Hoạt động</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-black/80">Authentication: Hoạt động</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-black/80">Storage: Hoạt động</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  // Export data functionality
                  const data = {
                    users: stats,
                    expenses: allExpenses,
                    exportDate: new Date().toISOString(),
                  }
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `vi-cua-tui-data-${new Date().toISOString().split("T")[0]}.json`
                  a.click()
                }}
                className="w-full bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black font-semibold"
              >
                Xuất dữ liệu hệ thống
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
