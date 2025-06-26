"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { getCurrentUser } from "@/lib/auth"
import { useSettings } from "@/lib/settings-context"
import { Overview } from "@/components/ui/overview"
import { RecentSales } from "@/components/ui/recent-sales"
import { Search } from "@/components/ui/search"
import { QuickActions } from "@/components/ui/quick-actions"
import { AdjustableBudgetOverview } from "@/components/ui/adjustable-budget-overview"
import type { User } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Plus, TrendingUp, DollarSign, Target, Wallet, Receipt, ArrowUpRight, ArrowDownRight } from "lucide-react"

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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { settings, getTranslation, formatCurrency } = useSettings()

  useEffect(() => {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }

      setUser(currentUser)
      loadExpenses(currentUser.id)
    } catch (err) {
      console.error("Error loading dashboard:", err)
      setError("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const loadExpenses = (userId: string) => {
    try {
      if (typeof window === "undefined") {
        setExpenses([])
        return
      }

      const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]")
      const userExpenses = Array.isArray(allExpenses)
        ? allExpenses.filter((expense: Expense) => expense.userId === userId)
        : []
      setExpenses(userExpenses)
    } catch (err) {
      console.error("Error loading expenses:", err)
      setExpenses([])
    }
  }

  const getCurrentMonthExpenses = () => {
    if (!Array.isArray(expenses)) return []

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return expenses.filter((expense) => {
      try {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      } catch {
        return false
      }
    })
  }

  const getLastMonthExpenses = () => {
    if (!Array.isArray(expenses)) return []

    const now = new Date()
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
    const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()

    return expenses.filter((expense) => {
      try {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear
      } catch {
        return false
      }
    })
  }

  // Safe calculations with error handling
  const currentMonthExpenses = getCurrentMonthExpenses()
  const lastMonthExpenses = getLastMonthExpenses()
  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
  const monthlyBudget = 10000000 // 10 triệu VND
  const budgetUsed = monthlyBudget > 0 ? (currentMonthTotal / monthlyBudget) * 100 : 0

  const categoryTotals = currentMonthExpenses.reduce(
    (acc, expense) => {
      const category = expense.category || "other"
      acc[category] = (acc[category] || 0) + (expense.amount || 0)
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const recentExpenses = Array.isArray(expenses)
    ? expenses
        .sort((a, b) => {
          try {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          } catch {
            return 0
          }
        })
        .slice(0, 5)
    : []

  const percentageChange = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Not Logged In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Please log in to view your dashboard.</p>
              <Link href="/login">
                <Button>Go to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between space-y-2 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">Dashboard</h2>
            <p className="text-black/70">Here&apos;s an overview of your financial data</p>
          </div>
          <div className="flex items-center space-x-2">
            <Search />
          </div>
        </div>

        <Separator className="mb-8" />

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

        {/* Main Dashboard Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-8">
          <Card className="col-span-4 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Overview expenses={expenses} />
            </CardContent>
          </Card>
          <Card className="col-span-3 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales expenses={recentExpenses} />
            </CardContent>
          </Card>
        </div>

        {/* Adjustable Budget Overview */}
        <div className="mb-8">
          <AdjustableBudgetOverview userId={user.id} expenses={expenses} onBudgetUpdate={() => loadExpenses(user.id)} />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickActions />
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
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
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold">{currentMonthExpenses.length} transactions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average</span>
                  <span className="font-semibold">
                    {currentMonthExpenses.length > 0
                      ? formatCurrency(currentMonthTotal / currentMonthExpenses.length)
                      : formatCurrency(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Budget Status</span>
                  <span
                    className={`font-semibold ${budgetUsed > 100 ? "text-red-600" : budgetUsed > 75 ? "text-orange-600" : "text-green-600"}`}
                  >
                    {budgetUsed > 100 ? "Over Budget" : budgetUsed > 75 ? "Warning" : "On Track"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
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
              <Link href="/budgets">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Budget Management
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
