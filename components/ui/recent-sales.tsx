"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/lib/settings-context"

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  userId: string
}

interface RecentSalesProps {
  expenses?: Expense[]
}

export function RecentSales({ expenses = [] }: RecentSalesProps) {
  const { formatCurrency, getTranslation } = useSettings()

  // Safely handle expenses data
  const safeExpenses = Array.isArray(expenses) ? expenses : []
  const recentExpenses = safeExpenses.slice(0, 5)

  if (recentExpenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chưa có giao dịch nào</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {recentExpenses.map((expense) => (
        <div key={expense.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-black">
              {(expense.category || "O").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{expense.description || "No description"}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{getTranslation(expense.category || "other")}</Badge>
              <p className="text-sm text-muted-foreground">
                {expense.date ? new Date(expense.date).toLocaleDateString("vi-VN") : "No date"}
              </p>
            </div>
          </div>
          <div className="ml-auto font-medium text-red-600">-{formatCurrency(expense.amount || 0)}</div>
        </div>
      ))}
    </div>
  )
}
