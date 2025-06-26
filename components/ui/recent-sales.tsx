"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSettings } from "@/lib/settings-context"
import { getExpenses } from "@/lib/expenses"
import { useEffect, useState } from "react"
import type { Expense } from "@/lib/types"

export function RecentSales() {
  const { settings } = useSettings()
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const expenses = getExpenses()
    // Get the 5 most recent expenses
    const recent = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
    setRecentExpenses(recent)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Ăn uống": "🍽️",
      "Di chuyển": "🚗",
      "Mua sắm": "🛍️",
      "Giải trí": "🎬",
      "Y tế": "🏥",
      "Giáo dục": "📚",
      "Hóa đơn": "📄",
      Khác: "📦",
    }
    return icons[category] || "📦"
  }

  if (recentExpenses.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>💰</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Chưa có chi tiêu nào</p>
            <p className="text-sm text-muted-foreground">Thêm chi tiêu đầu tiên của bạn</p>
          </div>
          <div className="ml-auto font-medium">0₫</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {recentExpenses.map((expense) => (
        <div key={expense.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getCategoryIcon(expense.category)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{expense.description}</p>
            <p className="text-sm text-muted-foreground">
              {expense.category} • {new Date(expense.date).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <div className="ml-auto font-medium text-red-600">-{formatCurrency(expense.amount)}</div>
        </div>
      ))}
    </div>
  )
}
