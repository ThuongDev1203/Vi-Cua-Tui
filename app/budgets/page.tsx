"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCurrentUser } from "@/lib/auth"
import { getBudgets, getBudgetProgress, deleteBudget, checkBudgetAlerts, getBudgetAlerts } from "@/lib/budgets"
import { getExpenses } from "@/lib/expenses"
import { useSettings } from "@/lib/settings-context"
import type { User, Budget, Expense } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import {
  Plus,
  Target,
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Bell,
  BarChart3,
} from "lucide-react"

export default function BudgetsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { formatCurrency, settings } = useSettings()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadData(currentUser.id)
  }, [router])

  const loadData = (userId: string) => {
    const userBudgets = getBudgets(userId)
    const userExpenses = getExpenses(userId)
    const budgetAlerts = getBudgetAlerts(userId)

    setBudgets(userBudgets)
    setExpenses(userExpenses)
    setAlerts(budgetAlerts.filter((alert) => !alert.isRead))

    // Check for new alerts
    checkBudgetAlerts(userId, userExpenses)

    setIsLoading(false)
  }

  const handleDeleteBudget = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa ngân sách này?")) {
      deleteBudget(id)
      if (user) {
        loadData(user.id)
      }
    }
  }

  const getBudgetStatusColor = (percentage: number) => {
    if (percentage >= 100) return "text-red-600"
    if (percentage >= 90) return "text-orange-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getBudgetStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <XCircle className="h-4 w-4 text-red-500" />
    if (percentage >= 90) return <AlertTriangle className="h-4 w-4 text-orange-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
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

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black flex items-center gap-3">
              <Target className="h-8 w-8 text-[var(--color-primary)]" />
              Quản lý ngân sách
            </h1>
            <p className="text-black/70 text-sm sm:text-base">
              Thiết lập và theo dõi ngân sách để kiểm soát chi tiêu hiệu quả
            </p>
          </div>
          <Link href="/budgets/add">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] hover:from-[var(--color-accent)] hover:to-[var(--color-background)] text-black shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Tạo ngân sách mới
            </Button>
          </Link>
        </div>

        {/* Budget Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-3">
            <h2 className="text-lg font-semibold text-black flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              Cảnh báo ngân sách ({alerts.length})
            </h2>
            {alerts.slice(0, 3).map((alert) => (
              <Alert
                key={alert.id}
                className={`border-l-4 ${
                  alert.type === "exceeded"
                    ? "border-l-red-500 bg-red-50"
                    : alert.type === "approaching"
                      ? "border-l-orange-500 bg-orange-50"
                      : "border-l-yellow-500 bg-yellow-50"
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="font-medium">{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Budget Overview Cards */}
        {budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const progress = getBudgetProgress(budget, expenses)
              const statusColor = getBudgetStatusColor(progress.percentage)
              const statusIcon = getBudgetStatusIcon(progress.percentage)

              return (
                <Card key={budget.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {statusIcon}
                        {budget.name}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Badge variant={budget.isActive ? "default" : "secondary"}>
                          {budget.isActive ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {budget.period === "monthly"
                        ? "Hàng tháng"
                        : budget.period === "weekly"
                          ? "Hàng tuần"
                          : "Hàng năm"}
                      {budget.categories.length > 0 && (
                        <span className="text-sm">• {budget.categories.length} danh mục</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Đã chi</span>
                        <span className={`font-medium ${statusColor}`}>{progress.percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(progress.percentage, 100)} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {formatCurrency(progress.spent)} / {formatCurrency(budget.amount)}
                        </span>
                        <span className={progress.remaining >= 0 ? "text-green-600" : "text-red-600"}>
                          {progress.remaining >= 0 ? "Còn " : "Vượt "}
                          {formatCurrency(Math.abs(progress.remaining))}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          Còn lại
                        </div>
                        <div className="font-medium text-black">{progress.daysRemaining} ngày</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                          <DollarSign className="h-3 w-3" />
                          Hàng ngày
                        </div>
                        <div className="font-medium text-black">{formatCurrency(progress.dailyBudget)}</div>
                      </div>
                    </div>

                    {/* Projection */}
                    {progress.projectedSpending > budget.amount && (
                      <Alert className="py-2">
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Dự báo chi: {formatCurrency(progress.projectedSpending)}
                          <span className="text-red-600 ml-1">
                            (vượt {formatCurrency(progress.projectedSpending - budget.amount)})
                          </span>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/budgets/edit/${budget.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-1" />
                          Sửa
                        </Button>
                      </Link>
                      <Link href={`/budgets/report/${budget.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Báo cáo
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-black">Chưa có ngân sách nào</h3>
              <p className="text-gray-700 mb-6 text-sm sm:text-base">
                Bắt đầu kiểm soát chi tiêu bằng cách tạo ngân sách đầu tiên
              </p>
              <Link href="/budgets/add">
                <Button className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] hover:from-[var(--color-accent)] hover:to-[var(--color-background)] text-black shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo ngân sách đầu tiên
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {budgets.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  Ngân sách đang hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{budgets.filter((b) => b.isActive).length}</div>
                <p className="text-sm text-gray-600">Tổng cộng {budgets.length} ngân sách</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Tổng ngân sách tháng này
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">
                  {formatCurrency(
                    budgets.filter((b) => b.isActive && b.period === "monthly").reduce((sum, b) => sum + b.amount, 0),
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {budgets.filter((b) => b.isActive && b.period === "monthly").length} ngân sách hàng tháng
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Cảnh báo chưa đọc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{alerts.length}</div>
                <p className="text-sm text-gray-600">Cần chú ý ngân sách</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
