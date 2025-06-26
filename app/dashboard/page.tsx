"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { getExpenses } from "@/lib/expenses"
import { EXPENSE_CATEGORIES } from "@/lib/constants"
import type { User, Expense } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ExpenseChart from "@/components/ui/expense-chart"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setExpenses(getExpenses(currentUser.id))
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

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
  })

  const totalMonthlySpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalAllTimeSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const recentExpenses = expenses.slice(-5).reverse()

  // Calculate average spending
  const averageDailySpending = monthlyExpenses.length > 0 ? totalMonthlySpending / new Date().getDate() : 0

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Dashboard</h1>
          <p className="text-black/70 text-sm sm:text-base">Chào mừng trở lại, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-[#FFDCDC] to-[#FFF2EB] border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Chi tiêu tháng này</CardTitle>
              <span className="text-xl sm:text-2xl">💸</span>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-600">
                {totalMonthlySpending.toLocaleString("vi-VN")} ₫
              </div>
              <p className="text-xs text-black/70">{monthlyExpenses.length} giao dịch</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#FFE8CD] to-[#FFD6BA] border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Tổng chi tiêu</CardTitle>
              <span className="text-xl sm:text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-black">
                {totalAllTimeSpending.toLocaleString("vi-VN")} ₫
              </div>
              <p className="text-xs text-black/70">Tất cả thời gian</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#FFF2EB] to-[#FFDCDC] border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Chi tiêu TB/ngày</CardTitle>
              <span className="text-xl sm:text-2xl">📊</span>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {Math.round(averageDailySpending).toLocaleString("vi-VN")} ₫
              </div>
              <p className="text-xs text-black/70">Tháng này</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#FFD6BA] to-[#FFE8CD] border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-black">Hành động nhanh</CardTitle>
              <span className="text-xl sm:text-2xl">⚡</span>
            </CardHeader>
            <CardContent>
              <Link href="/expenses/add">
                <Button className="w-full bg-white text-black hover:bg-gray-100 shadow-lg font-semibold">
                  Thêm chi tiêu
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-black">Thống kê chi tiêu tháng này</CardTitle>
              <CardDescription className="text-black/70">Phân bố chi tiêu theo danh mục</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseChart expenses={monthlyExpenses} />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-black">Giao dịch gần đây</CardTitle>
              <CardDescription className="text-black/70">5 giao dịch mới nhất của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              {recentExpenses.length > 0 ? (
                <div className="space-y-3">
                  {recentExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FFF2EB] to-[#FFE8CD] rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg sm:text-xl">{EXPENSE_CATEGORIES[expense.category].icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-black text-sm sm:text-base truncate">{expense.description}</p>
                          <p className="text-xs sm:text-sm text-black/70">
                            {EXPENSE_CATEGORIES[expense.category].label} •{" "}
                            {new Date(expense.date).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-red-600 text-sm sm:text-base">
                          -{expense.amount.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-black/50">
                  <p className="text-sm sm:text-base">Chưa có giao dịch nào</p>
                  <Link href="/expenses/add">
                    <Button className="mt-4 bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black shadow-lg">
                      Thêm giao dịch đầu tiên
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
