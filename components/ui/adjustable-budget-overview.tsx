"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { InlineBudgetEditor } from "./inline-budget-editor"
import { useSettings } from "@/lib/settings-context"
import type { Expense } from "@/lib/types"
import { TrendingUp, Target, Calendar, AlertTriangle, CheckCircle } from "lucide-react"

interface MonthlyBudgetData {
  id: string
  userId: string
  monthlyBudget: number
  currentMonth: string
  createdAt: Date
  updatedAt: Date
}

interface AdjustableBudgetOverviewProps {
  userId: string
  expenses: Expense[]
  onBudgetUpdate?: () => void
}

const MONTHLY_BUDGET_KEY = "monthly_budgets"

export function AdjustableBudgetOverview({ userId, expenses, onBudgetUpdate }: AdjustableBudgetOverviewProps) {
  const [monthlyBudgetData, setMonthlyBudgetData] = useState<MonthlyBudgetData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { formatCurrency } = useSettings()

  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format

  useEffect(() => {
    loadMonthlyBudget()
  }, [userId, currentMonth])

  const loadMonthlyBudget = () => {
    if (typeof window === "undefined") return

    const budgetsStr = localStorage.getItem(MONTHLY_BUDGET_KEY)
    const allBudgets: MonthlyBudgetData[] = budgetsStr ? JSON.parse(budgetsStr) : []

    let userBudget = allBudgets.find((b) => b.userId === userId && b.currentMonth === currentMonth)

    if (!userBudget) {
      // Create default budget for current month
      userBudget = {
        id: `${userId}_${currentMonth}_${Date.now()}`,
        userId,
        monthlyBudget: 5000000, // Default 5M VND
        currentMonth,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      allBudgets.push(userBudget)
      localStorage.setItem(MONTHLY_BUDGET_KEY, JSON.stringify(allBudgets))
    }

    setMonthlyBudgetData(userBudget)
    setIsLoading(false)
  }

  const updateMonthlyBudget = async (newBudget: number) => {
    if (!monthlyBudgetData) return

    const budgetsStr = localStorage.getItem(MONTHLY_BUDGET_KEY)
    const allBudgets: MonthlyBudgetData[] = budgetsStr ? JSON.parse(budgetsStr) : []

    const updatedBudgets = allBudgets.map((budget) =>
      budget.id === monthlyBudgetData.id ? { ...budget, monthlyBudget: newBudget, updatedAt: new Date() } : budget,
    )

    localStorage.setItem(MONTHLY_BUDGET_KEY, JSON.stringify(updatedBudgets))

    setMonthlyBudgetData((prev) => (prev ? { ...prev, monthlyBudget: newBudget, updatedAt: new Date() } : null))
    onBudgetUpdate?.()
  }

  // Calculate current month expenses
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseMonth = new Date(expense.date).toISOString().slice(0, 7)
    return expenseMonth === currentMonth
  })

  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = (monthlyBudgetData?.monthlyBudget || 0) - totalSpent
  const spentPercentage = monthlyBudgetData?.monthlyBudget ? (totalSpent / monthlyBudgetData.monthlyBudget) * 100 : 0

  // Calculate daily averages
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysPassed = today.getDate()
  const daysRemaining = daysInMonth - daysPassed

  const dailyBudget = monthlyBudgetData?.monthlyBudget ? monthlyBudgetData.monthlyBudget / daysInMonth : 0
  const dailyAverage = daysPassed > 0 ? totalSpent / daysPassed : 0
  const suggestedDailySpending = daysRemaining > 0 ? remaining / daysRemaining : 0

  const getStatusColor = () => {
    if (spentPercentage >= 100) return "text-red-600"
    if (spentPercentage >= 90) return "text-orange-600"
    if (spentPercentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getStatusIcon = () => {
    if (spentPercentage >= 100) return <AlertTriangle className="h-5 w-5 text-red-500" />
    if (spentPercentage >= 75) return <TrendingUp className="h-5 w-5 text-orange-500" />
    return <CheckCircle className="h-5 w-5 text-green-500" />
  }

  const getStatusBadge = () => {
    if (spentPercentage >= 100) return <Badge variant="destructive">Vượt ngân sách</Badge>
    if (spentPercentage >= 90) return <Badge className="bg-orange-500">Gần hết</Badge>
    if (spentPercentage >= 75) return <Badge className="bg-yellow-500">Cảnh báo</Badge>
    return <Badge className="bg-green-500">Ổn định</Badge>
  }

  if (isLoading || !monthlyBudgetData) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Budget Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-l-4 border-l-[var(--color-primary)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              {getStatusIcon()}
              Ngân sách tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
            </CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription>Quản lý và theo dõi ngân sách hàng tháng của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Amount Editor */}
          <InlineBudgetEditor
            label="Ngân sách tháng này"
            value={monthlyBudgetData.monthlyBudget}
            onSave={updateMonthlyBudget}
            placeholder="Nhập ngân sách tháng"
            min={100000}
            max={100000000}
            step={100000}
            quickActionAmounts={[500000, 1000000, 2000000, 5000000]}
          />

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tiến độ chi tiêu</span>
              <span className={`font-semibold ${getStatusColor()}`}>{spentPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(spentPercentage, 100)} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Đã chi: {formatCurrency(totalSpent)}</span>
              <span className={remaining >= 0 ? "text-green-600" : "text-red-600"}>
                {remaining >= 0 ? "Còn lại: " : "Vượt: "}
                {formatCurrency(Math.abs(remaining))}
              </span>
            </div>
          </div>

          {/* Remaining Budget Editor */}
          {remaining !== 0 && (
            <InlineBudgetEditor
              label={remaining >= 0 ? "Số tiền còn lại" : "Số tiền vượt ngân sách"}
              value={Math.abs(remaining)}
              onSave={(newRemaining) => {
                const newBudget = totalSpent + (remaining >= 0 ? newRemaining : -newRemaining)
                return updateMonthlyBudget(newBudget)
              }}
              placeholder="Điều chỉnh số tiền còn lại"
              min={0}
              quickActionAmounts={[200000, 500000, 1000000, 2000000]}
            />
          )}
        </CardContent>
      </Card>

      {/* Daily Spending Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Ngân sách hàng ngày
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(dailyBudget)}</div>
            <p className="text-sm text-gray-600">Trung bình mỗi ngày</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Chi tiêu trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(dailyAverage)}</div>
            <p className="text-sm text-gray-600">
              {dailyAverage > dailyBudget ? (
                <span className="text-red-600">Vượt {formatCurrency(dailyAverage - dailyBudget)}/ngày</span>
              ) : (
                <span className="text-green-600">Tiết kiệm {formatCurrency(dailyBudget - dailyAverage)}/ngày</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Gợi ý chi tiêu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {suggestedDailySpending > 0 ? formatCurrency(suggestedDailySpending) : "0₫"}
            </div>
            <p className="text-sm text-gray-600">{daysRemaining > 0 ? `Còn ${daysRemaining} ngày` : "Hết tháng"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-black">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">💡 Gợi ý thông minh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {spentPercentage >= 100 && (
            <p className="text-sm">
              🚨 Bạn đã vượt ngân sách {formatCurrency(Math.abs(remaining))}. Hãy xem xét giảm chi tiêu hoặc tăng ngân
              sách.
            </p>
          )}
          {spentPercentage >= 90 && spentPercentage < 100 && (
            <p className="text-sm">
              ⚠️ Bạn đã sử dụng {spentPercentage.toFixed(1)}% ngân sách. Hãy cẩn thận với các khoản chi tiêu tiếp theo.
            </p>
          )}
          {suggestedDailySpending > 0 && suggestedDailySpending < dailyBudget && (
            <p className="text-sm">
              ✅ Bạn có thể chi tối đa {formatCurrency(suggestedDailySpending)}/ngày trong {daysRemaining} ngày còn lại.
            </p>
          )}
          {dailyAverage < dailyBudget && (
            <p className="text-sm">
              🎉 Tuyệt vời! Bạn đang tiết kiệm {formatCurrency(dailyBudget - dailyAverage)}/ngày so với kế hoạch.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
