"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getCurrentUser } from "@/lib/auth"
import { useSettings } from "@/lib/settings-context"
import type { User } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import {
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Target,
  Wallet,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  userId: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { settings, getTranslation, formatCurrency } = useSettings()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadExpenses(currentUser.id)
    setIsLoading(false)
  }, [router])

  const loadExpenses = (userId: string) => {
    const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]")
    const userExpenses = allExpenses.filter((expense: Expense) => expense.userId === userId)
    setExpenses(userExpenses)
  }

  const getCurrentMonthExpenses = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })
  }

  const getLastMonthExpenses = () => {
    const now = new Date()
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
    const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear
    })
  }

  const currentMonthExpenses = getCurrentMonthExpenses()
  const lastMonthExpenses = getLastMonthExpenses()
  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyBudget = 10000000 // 10 triệu VND
  const budgetUsed = (currentMonthTotal / monthlyBudget) * 100

  const categoryTotals = currentMonthExpenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const recentExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  const percentageChange = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={settings.avatar || "/placeholder.svg"} alt={settings.name || user.name} />
              <AvatarFallback className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-black text-xl">
                {(settings.name || user.name).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                {getTranslation("welcome")}, {settings.name || user.name}! 👋
              </h1>
              <p className="text-black/70">
                {settings.language === "en" ? "Here's your financial overview" : "Đây là tổng quan tài chính của bạn"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-[var(--color-primary)] bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getTranslation("totalExpenses")}</CardTitle>
              <DollarSign className="h-4 w-4 text-[var(--color-primary)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(currentMonthTotal)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {percentageChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-red-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                )}
                <span className={percentageChange >= 0 ? "text-red-500" : "text-green-500"}>
                  {Math.abs(percentageChange).toFixed(1)}%
                </span>
                <span className="ml-1">{settings.language === "en" ? "from last month" : "so với tháng trước"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getTranslation("monthlyBudget")}</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(monthlyBudget)}</div>
              <div className="mt-2">
                <Progress value={budgetUsed} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {budgetUsed.toFixed(1)}% {settings.language === "en" ? "used" : "đã sử dụng"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{getTranslation("remaining")}</CardTitle>
              <Wallet className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(monthlyBudget - currentMonthTotal)}</div>
              <p className="text-xs text-muted-foreground">
                {settings.language === "en" ? "Available to spend" : "Còn lại để chi tiêu"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {settings.language === "en" ? "Transactions" : "Giao dịch"}
              </CardTitle>
              <Receipt className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentMonthExpenses.length}</div>
              <p className="text-xs text-muted-foreground">
                {settings.language === "en" ? "This month" : "Trong tháng này"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Expenses */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-[var(--color-primary)]" />
                    {getTranslation("recentExpenses")}
                  </CardTitle>
                  <CardDescription>
                    {settings.language === "en" ? "Your latest transactions" : "Các giao dịch gần đây của bạn"}
                  </CardDescription>
                </div>
                <Link href="/expenses/add">
                  <Button className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] hover:from-[var(--color-accent)] hover:to-[var(--color-background)] text-black">
                    <Plus className="h-4 w-4 mr-2" />
                    {getTranslation("addExpense")}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentExpenses.length > 0 ? (
                  <div className="space-y-4">
                    {recentExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-black">
                              {getTranslation(expense.category).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-black">{expense.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{getTranslation(expense.category)}</Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(expense.date).toLocaleDateString(
                                  settings.language === "en" ? "en-US" : "vi-VN",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">-{formatCurrency(expense.amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {settings.language === "en" ? "No expenses yet" : "Chưa có chi tiêu nào"}
                    </p>
                    <Link href="/expenses/add">
                      <Button className="mt-4 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] hover:from-[var(--color-accent)] hover:to-[var(--color-background)] text-black">
                        <Plus className="h-4 w-4 mr-2" />
                        {getTranslation("addExpense")}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Top Categories */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[var(--color-primary)]" />
                  {settings.language === "en" ? "Top Categories" : "Danh mục hàng đầu"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topCategories.length > 0 ? (
                  <div className="space-y-3">
                    {topCategories.map(([category, amount], index) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === 0
                                ? "bg-[var(--color-primary)]"
                                : index === 1
                                  ? "bg-[var(--color-secondary)]"
                                  : "bg-[var(--color-accent)]"
                            }`}
                          />
                          <span className="text-sm font-medium">{getTranslation(category)}</span>
                        </div>
                        <span className="text-sm font-bold">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {settings.language === "en" ? "No data available" : "Chưa có dữ liệu"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--color-primary)]" />
                  {settings.language === "en" ? "Quick Actions" : "Thao tác nhanh"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/expenses/add">
                  <Button className="w-full justify-start bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] hover:from-[var(--color-accent)] hover:to-[var(--color-background)] text-black">
                    <Plus className="h-4 w-4 mr-2" />
                    {getTranslation("addExpense")}
                  </Button>
                </Link>
                <Link href="/statistics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {getTranslation("statistics")}
                  </Button>
                </Link>
                <Link href="/expenses">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    {settings.language === "en" ? "View All" : "Xem tất cả"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
