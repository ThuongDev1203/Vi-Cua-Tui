"use client"

import type { Expense } from "@/lib/types"
import { EXPENSE_CATEGORIES } from "@/lib/constants"

interface ExpenseChartProps {
  expenses: Expense[]
}

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

  if (total === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Chưa có dữ liệu chi tiêu</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(categoryTotals).map(([category, amount]) => {
          const percentage = (amount / total) * 100
          const categoryInfo = EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]

          return (
            <div
              key={category}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF2EB] to-[#FFE8CD] rounded-lg shadow-sm border-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] flex items-center justify-center">
                  <span className="text-xl">{categoryInfo.icon}</span>
                </div>
                <div>
                  <p className="font-semibold text-black">{categoryInfo.label}</p>
                  <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{amount.toLocaleString("vi-VN")} ₫</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
