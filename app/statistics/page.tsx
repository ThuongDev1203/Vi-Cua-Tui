"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { getExpenses } from "@/lib/expenses"
import type { User, Expense } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ExpenseChart from "@/components/ui/expense-chart"

export default function StatisticsPage() {
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

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      name: date.toLocaleDateString("vi-VN", { month: "short", year: "numeric" }),
    }
  }).reverse()

  const monthlyTotals = last6Months.map(({ month, year, name }) => {
    const monthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === month && expenseDate.getFullYear() === year
    })

    return {
      name,
      total: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Thống kê chi tiêu</h1>
          <p className="text-gray-700 text-sm sm:text-base">Phân tích chi tiết về thói quen chi tiêu của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-black">Chi tiêu theo danh mục (Tháng này)</CardTitle>
              <CardDescription className="text-gray-700">
                Phân bố chi tiêu trong tháng{" "}
                {new Date().toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseChart expenses={monthlyExpenses} />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-black">Xu hướng 6 tháng gần đây</CardTitle>
              <CardDescription className="text-gray-700">Tổng chi tiêu theo từng tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTotals.map((month, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FFF2EB] to-[#FFE8CD] rounded-lg"
                  >
                    <span className="font-medium text-black text-sm sm:text-base">{month.name}</span>
                    <span className="font-bold text-base sm:text-lg text-black">
                      {month.total.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-black">Thống kê tổng quan</CardTitle>
            <CardDescription className="text-gray-700">Các chỉ số quan trọng về chi tiêu của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-[#FFDCDC] to-[#FFF2EB] rounded-lg text-black shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold mb-2">
                  {expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString("vi-VN")} ₫
                </div>
                <div className="text-xs sm:text-sm opacity-80">Tổng chi tiêu</div>
              </div>

              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-[#FFE8CD] to-[#FFD6BA] rounded-lg text-black shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold mb-2">
                  {monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString("vi-VN")} ₫
                </div>
                <div className="text-xs sm:text-sm opacity-80">Chi tiêu tháng này</div>
              </div>

              <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-[#FFD6BA] to-[#FFDCDC] rounded-lg text-black shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold mb-2">
                  {expenses.length > 0
                    ? Math.round(
                        expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length,
                      ).toLocaleString("vi-VN")
                    : 0}{" "}
                  ₫
                </div>
                <div className="text-xs sm:text-sm opacity-80">Chi tiêu trung bình</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
