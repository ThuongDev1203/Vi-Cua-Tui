"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, getUserStats, isAdmin } from "@/lib/auth"
import { getAllExpenses } from "@/lib/expenses"
import type { User } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Users, TrendingUp, Calendar, Database, Shield, Activity } from "lucide-react"

export default function AdminDashboard() {
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

    if (!isAdmin(currentUser)) {
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user || !isAdmin(user)) return null

  const totalExpenseAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const today = new Date()
  const todayExpenses = allExpenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.toDateString() === today.toDateString()
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Admin Dashboard</h1>
          </div>
          <p className="text-black/70 text-sm sm:text-base">
            Chào mừng {user.name}, quản trị viên hệ thống "Ví Của Tui"
          </p>
        </div>

        {/* Admin Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-red-100 to-red-50 border-red-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Tổng người dùng</CardTitle>
              <Users className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-black/70">Đã đăng ký</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-100 to-blue-50 border-blue-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Người dùng mới</CardTitle>
              <Calendar className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.newUsersThisMonth || 0}</div>
              <p className="text-xs text-black/70">Tháng này</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-100 to-green-50 border-green-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Giao dịch hôm nay</CardTitle>
              <Activity className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{todayExpenses.length}</div>
              <p className="text-xs text-black/70">Hoạt động</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-100 to-purple-50 border-purple-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Tổng giao dịch</CardTitle>
              <Database className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{allExpenses.length}</div>
              <p className="text-xs text-black/70">Tất cả thời gian</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-white">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                Quản lý người dùng
              </CardTitle>
              <CardDescription className="text-black/70">
                Xem và quản lý tất cả người dùng trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-black/70">Người dùng hoạt động:</span>
                  <span className="font-semibold text-black">{stats?.totalUsers || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black/70">Đăng ký mới:</span>
                  <span className="font-semibold text-green-600">+{stats?.newUsersThisMonth || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Thống kê hệ thống
              </CardTitle>
              <CardDescription className="text-black/70">Theo dõi hiệu suất và hoạt động của ứng dụng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-black/70">Tổng giao dịch:</span>
                  <span className="font-semibold text-black">{allExpenses.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black/70">Giá trị:</span>
                  <span className="font-semibold text-blue-600">{Math.round(totalExpenseAmount / 1000000)}M ₫</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                Trạng thái hệ thống
              </CardTitle>
              <CardDescription className="text-black/70">Tình trạng hoạt động của các dịch vụ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/70">Database:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Hoạt động</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/70">Authentication:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Hoạt động</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-black">Hoạt động gần đây</CardTitle>
            <CardDescription className="text-black/70">Các hoạt động mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayExpenses.slice(0, 5).map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-black text-sm">Giao dịch mới</p>
                      <p className="text-xs text-black/70">
                        {expense.description} - {expense.amount.toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-black/50">
                    {new Date(expense.createdAt).toLocaleTimeString("vi-VN")}
                  </span>
                </div>
              ))}

              {todayExpenses.length === 0 && (
                <div className="text-center py-8 text-black/50">
                  <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Chưa có hoạt động nào hôm nay</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
