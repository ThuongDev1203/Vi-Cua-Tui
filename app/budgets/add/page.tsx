"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { getCurrentUser } from "@/lib/auth"
import { addBudget } from "@/lib/budgets"
import { EXPENSE_CATEGORIES } from "@/lib/constants"
import { useSettings } from "@/lib/settings-context"
import type { User, ExpenseCategory } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Target, Calendar, DollarSign, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddBudgetPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    period: "monthly" as "monthly" | "weekly" | "yearly",
    categories: [] as ExpenseCategory[],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    isActive: true,
    description: "",
  })
  const router = useRouter()
  const { formatCurrency } = useSettings()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleCategoryToggle = (category: ExpenseCategory) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.name || !formData.amount) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    const amount = Number.parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ")
      return
    }

    setIsLoading(true)
    try {
      addBudget({
        userId: user.id,
        name: formData.name,
        amount: amount,
        period: formData.period,
        categories: formData.categories,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        isActive: formData.isActive,
      })

      router.push("/budgets")
    } catch (error) {
      console.error("Error adding budget:", error)
      alert("Có lỗi xảy ra khi tạo ngân sách")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <Link href="/budgets">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách ngân sách
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-black flex items-center gap-3">
            <Target className="h-8 w-8 text-[var(--color-primary)]" />
            Tạo ngân sách mới
          </h1>
          <p className="text-black/70 text-sm sm:text-base">
            Thiết lập ngân sách để kiểm soát chi tiêu trong một khoảng thời gian
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Budget Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[var(--color-primary)]" />
                    Thông tin cơ bản
                  </CardTitle>
                  <CardDescription>Nhập tên và số tiền ngân sách của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Tên ngân sách *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="VD: Ngân sách ăn uống tháng 1"
                      className="border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Số tiền ngân sách *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="0"
                      className="border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      required
                    />
                    {formData.amount && (
                      <p className="text-sm text-gray-600 mt-1">
                        ≈ {formatCurrency(Number.parseFloat(formData.amount) || 0)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Mô tả (tùy chọn)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Mô tả ngắn về mục đích của ngân sách này..."
                      className="border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Period & Dates */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[var(--color-primary)]" />
                    Thời gian áp dụng
                  </CardTitle>
                  <CardDescription>Chọn chu kỳ và thời gian hiệu lực của ngân sách</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="period">Chu kỳ ngân sách</Label>
                    <Select
                      value={formData.period}
                      onValueChange={(value: "monthly" | "weekly" | "yearly") =>
                        setFormData((prev) => ({ ...prev, period: value }))
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                        <SelectItem value="yearly">Hàng năm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Ngày bắt đầu</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="endDate">Ngày kết thúc (tùy chọn)</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                        className="border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                      <p className="text-xs text-gray-500 mt-1">Để trống để áp dụng theo chu kỳ</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Kích hoạt ngân sách ngay</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories Selection */}
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Danh mục áp dụng</CardTitle>
                  <CardDescription>Chọn danh mục chi tiêu. Để trống để áp dụng cho tất cả</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    {Object.entries(EXPENSE_CATEGORIES).map(([key, category]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={formData.categories.includes(key as ExpenseCategory)}
                          onCheckedChange={() => handleCategoryToggle(key as ExpenseCategory)}
                        />
                        <Label htmlFor={key} className="flex items-center gap-2 cursor-pointer">
                          <span style={{ color: category.color }}>{category.icon}</span>
                          <span className="text-sm">{category.label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>

                  {formData.categories.length === 0 && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      💡 Không chọn danh mục nào sẽ áp dụng cho tất cả chi tiêu
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-black">
                <CardHeader>
                  <CardTitle className="text-lg">Tóm tắt ngân sách</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tên:</span>
                    <span className="font-medium">{formData.name || "Chưa nhập"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số tiền:</span>
                    <span className="font-medium">
                      {formData.amount ? formatCurrency(Number.parseFloat(formData.amount)) : "0₫"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chu kỳ:</span>
                    <span className="font-medium">
                      {formData.period === "monthly"
                        ? "Hàng tháng"
                        : formData.period === "weekly"
                          ? "Hàng tuần"
                          : "Hàng năm"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Danh mục:</span>
                    <span className="font-medium">
                      {formData.categories.length === 0 ? "Tất cả" : `${formData.categories.length} danh mục`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trạng thái:</span>
                    <span className="font-medium">{formData.isActive ? "Hoạt động" : "Tạm dừng"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] hover:from-[var(--color-accent)] hover:to-[var(--color-background)] text-black shadow-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Đang tạo ngân sách..." : "Tạo ngân sách"}
            </Button>
            <Link href="/budgets">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Hủy bỏ
              </Button>
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
