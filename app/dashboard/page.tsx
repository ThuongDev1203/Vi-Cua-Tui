"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/lib/auth"
import { useSettings } from "@/lib/settings-context"
import type { User } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import {
  Plus,
  TrendingUp,
  DollarSign,
  Target,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Eye,
  Settings,
  Edit3,
  Check,
  X,
} from "lucide-react"

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  userId: string
}

interface MonthlyBudget {
  id: string
  userId: string
  monthlyBudget: number
  currentMonth: string
  createdAt: Date
  updatedAt: Date
}

const MONTHLY_BUDGET_KEY = "monthly_budgets"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [monthlyBudget, setMonthlyBudget] = useState(5000000) // Mặc định 5 triệu
  const [isLoading, setIsLoading] = useState(true)
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [isEditingRemaining, setIsEditingRemaining] = useState(false)
  const [budgetInput, setBudgetInput] = useState("")
  const [remainingInput, setRemainingInput] = useState("")
  const router = useRouter()
  const { settings, formatCurrency } = useSettings()

  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadExpenses(currentUser.id)
    loadMonthlyBudget(currentUser.id)
    setIsLoading(false)
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
      console.error("Lỗi tải chi tiêu:", err)
      setExpenses([])
    }
  }

  const loadMonthlyBudget = (userId: string) => {
    try {
      if (typeof window === "undefined") return

      const budgetsStr = localStorage.getItem(MONTHLY_BUDGET_KEY)
      const allBudgets: MonthlyBudget[] = budgetsStr ? JSON.parse(budgetsStr) : []

      let userBudget = allBudgets.find((b) => b.userId === userId && b.currentMonth === currentMonth)

      if (!userBudget) {
        // Tạo ngân sách mặc định cho tháng hiện tại
        userBudget = {
          id: `${userId}_${currentMonth}_${Date.now()}`,
          userId,
          monthlyBudget: 5000000, // Mặc định 5M VND
          currentMonth,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        allBudgets.push(userBudget)
        localStorage.setItem(MONTHLY_BUDGET_KEY, JSON.stringify(allBudgets))
      }

      setMonthlyBudget(userBudget.monthlyBudget)
    } catch (err) {
      console.error("Lỗi tải ngân sách:", err)
      setMonthlyBudget(5000000)
    }
  }

  const updateMonthlyBudget = (newBudget: number) => {
    if (!user) return

    try {
      const budgetsStr = localStorage.getItem(MONTHLY_BUDGET_KEY)
      const allBudgets: MonthlyBudget[] = budgetsStr ? JSON.parse(budgetsStr) : []

      const existingBudgetIndex = allBudgets.findIndex((b) => b.userId === user.id && b.currentMonth === currentMonth)

      if (existingBudgetIndex >= 0) {
        allBudgets[existingBudgetIndex] = {
          ...allBudgets[existingBudgetIndex],
          monthlyBudget: newBudget,
          updatedAt: new Date(),
        }
      } else {
        allBudgets.push({
          id: `${user.id}_${currentMonth}_${Date.now()}`,
          userId: user.id,
          monthlyBudget: newBudget,
          currentMonth,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }

      localStorage.setItem(MONTHLY_BUDGET_KEY, JSON.stringify(allBudgets))
      setMonthlyBudget(newBudget)
    } catch (err) {
      console.error("Lỗi cập nhật ngân sách:", err)
    }
  }

  // Tính toán chi tiêu tháng hiện tại
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

  // Tính toán chi tiêu tháng trước
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

  const currentMonthExpenses = getCurrentMonthExpenses()
  const lastMonthExpenses = getLastMonthExpenses()
  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
  const budgetUsed = monthlyBudget > 0 ? (currentMonthTotal / monthlyBudget) * 100 : 0
  const remaining = monthlyBudget - currentMonthTotal

  // Tính phần trăm thay đổi so với tháng trước
  const percentageChange = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

  // Tính toán theo danh mục
  const categoryTotals = currentMonthExpenses.reduce(
    (acc, expense) => {
      const category = expense.category || "Khác"
      acc[category] = (acc[category] || 0) + (expense.amount || 0)
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  // Chi tiêu gần đây
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

  // Dịch danh mục
  const translateCategory = (category: string) => {
    const translations: Record<string, string> = {
      food: "Ăn uống",
      transport: "Di chuyển",
      entertainment: "Giải trí",
      shopping: "Mua sắm",
      health: "Y tế",
      education: "Giáo dục",
      bills: "Hóa đơn",
      other: "Khác",
    }
    return translations[category] || category
  }

  // Xử lý chỉnh sửa ngân sách
  const handleEditBudget = () => {
    setIsEditingBudget(true)
    setBudgetInput(monthlyBudget.toString())
  }

  const handleSaveBudget = () => {
    const newBudget = Number.parseFloat(budgetInput)
    if (!isNaN(newBudget) && newBudget > 0) {
      updateMonthlyBudget(newBudget)
      setIsEditingBudget(false)
    } else {
      alert("Vui lòng nhập số tiền hợp lệ")
    }
  }

  const handleCancelBudget = () => {
    setIsEditingBudget(false)
    setBudgetInput("")
  }

  // Xử lý chỉnh sửa số tiền còn lại
  const handleEditRemaining = () => {
    setIsEditingRemaining(true)
    setRemainingInput(Math.abs(remaining).toString())
  }

  const handleSaveRemaining = () => {
    const newRemaining = Number.parseFloat(remainingInput)
    if (!isNaN(newRemaining) && newRemaining >= 0) {
      const newBudget = currentMonthTotal + newRemaining
      updateMonthlyBudget(newBudget)
      setIsEditingRemaining(false)
    } else {
      alert("Vui lòng nhập số tiền hợp lệ")
    }
  }

  const handleCancelRemaining = () => {
    setIsEditingRemaining(false)
    setRemainingInput("")
  }

  // Quick budget presets
  const quickBudgetPresets = [3000000, 5000000, 8000000, 10000000, 15000000, 20000000]

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header chào mừng */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={settings.avatar || "/placeholder.svg"} alt={settings.name || user.name} />
              <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                {(settings.name || user.name).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Xin chào, {settings.name || user.name}! 👋</h1>
              <p className="text-gray-600 text-lg">Đây là tổng quan tài chính của bạn</p>
            </div>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tổng chi tiêu tháng này */}
          <Card className="bg-white shadow-sm border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Chi tiêu tháng này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(currentMonthTotal)}</div>
              <div className="flex items-center mt-2 text-sm">
                {percentageChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
                )}
                <span className={percentageChange >= 0 ? "text-red-500" : "text-green-500"}>
                  {Math.abs(percentageChange).toFixed(1)}%
                </span>
                <span className="text-gray-500 ml-1">so với tháng trước</span>
              </div>
            </CardContent>
          </Card>

          {/* Ngân sách tháng - Có thể chỉnh sửa */}
          <Card className="bg-white shadow-sm border-l-4 border-l-blue-500 group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Ngân sách tháng
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditBudget}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingBudget ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      placeholder="Nhập ngân sách"
                      className="flex-1"
                      autoFocus
                    />
                    <Button onClick={handleSaveBudget} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleCancelBudget} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">≈ {formatCurrency(Number.parseFloat(budgetInput) || 0)}</div>
                  {/* Quick presets */}
                  <div className="flex flex-wrap gap-1">
                    {quickBudgetPresets.map((preset) => (
                      <Button
                        key={preset}
                        variant="outline"
                        size="sm"
                        onClick={() => setBudgetInput(preset.toString())}
                        className="text-xs h-6 px-2"
                      >
                        {formatCurrency(preset)}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyBudget)}</div>
                  <div className="mt-3">
                    <Progress value={Math.min(budgetUsed, 100)} className="h-2" />
                    <p className="text-sm text-gray-500 mt-1">Đã dùng {budgetUsed.toFixed(1)}%</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Số tiền còn lại - Có thể chỉnh sửa */}
          <Card className="bg-white shadow-sm border-l-4 border-l-green-500 group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Còn lại
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditRemaining}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingRemaining ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={remainingInput}
                      onChange={(e) => setRemainingInput(e.target.value)}
                      placeholder="Số tiền muốn còn lại"
                      className="flex-1"
                      autoFocus
                    />
                    <Button onClick={handleSaveRemaining} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleCancelRemaining} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Ngân sách mới: {formatCurrency(currentMonthTotal + (Number.parseFloat(remainingInput) || 0))}
                  </div>
                </div>
              ) : (
                <>
                  <div className={`text-2xl font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(Math.abs(remaining))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{remaining >= 0 ? "Có thể chi tiêu" : "Vượt ngân sách"}</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Số giao dịch */}
          <Card className="bg-white shadow-sm border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Giao dịch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{currentMonthExpenses.length}</div>
              <p className="text-sm text-gray-500 mt-1">Giao dịch tháng này</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chi tiêu gần đây */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-blue-600" />
                    Chi tiêu gần đây
                  </CardTitle>
                  <p className="text-gray-600 mt-1">5 giao dịch mới nhất của bạn</p>
                </div>
                <Link href="/expenses/add">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm chi tiêu
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentExpenses.length > 0 ? (
                  <div className="space-y-4">
                    {recentExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {translateCategory(expense.category).charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{expense.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {translateCategory(expense.category)}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(expense.date).toLocaleDateString("vi-VN")}
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
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">Chưa có chi tiêu nào</p>
                    <Link href="/expenses/add">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm chi tiêu đầu tiên
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Danh mục chi tiêu nhiều nhất */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  Chi tiêu theo danh mục
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topCategories.length > 0 ? (
                  <div className="space-y-4">
                    {topCategories.map(([category, amount], index) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              index === 0 ? "bg-red-500" : index === 1 ? "bg-blue-500" : "bg-green-500"
                            }`}
                          />
                          <span className="font-medium text-gray-900">{translateCategory(category)}</span>
                        </div>
                        <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Chưa có dữ liệu</p>
                )}
              </CardContent>
            </Card>

            {/* Thao tác nhanh */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/expenses/add">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm chi tiêu mới
                  </Button>
                </Link>
                <Link href="/budgets">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Quản lý ngân sách
                  </Button>
                </Link>
                <Link href="/statistics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Xem thống kê
                  </Button>
                </Link>
                <Link href="/expenses">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Xem tất cả chi tiêu
                  </Button>
                </Link>
                <Link href="/analysis">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Phân tích AI
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Cài đặt
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Lời khuyên thông minh */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold">💡 Lời khuyên thông minh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {budgetUsed >= 100 && (
                  <p className="text-sm">
                    🚨 Bạn đã vượt ngân sách {formatCurrency(Math.abs(remaining))}. Hãy cân nhắc điều chỉnh ngân sách
                    hoặc giảm chi tiêu.
                  </p>
                )}
                {budgetUsed >= 80 && budgetUsed < 100 && (
                  <p className="text-sm">
                    ⚠️ Bạn đã sử dụng {budgetUsed.toFixed(1)}% ngân sách. Hãy cẩn thận với các khoản chi tiêu tiếp theo.
                  </p>
                )}
                {budgetUsed < 50 && (
                  <p className="text-sm">✅ Tuyệt vời! Bạn đang quản lý tài chính rất tốt. Tiếp tục duy trì!</p>
                )}
                {currentMonthExpenses.length === 0 && (
                  <p className="text-sm">📝 Hãy bắt đầu ghi lại chi tiêu để theo dõi tài chính hiệu quả hơn.</p>
                )}
                <p className="text-sm">
                  💰 <strong>Mẹo:</strong> Hover vào "Ngân sách tháng" và "Còn lại" để điều chỉnh theo thu nhập của bạn!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
