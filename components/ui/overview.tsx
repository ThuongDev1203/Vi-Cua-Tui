"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  userId: string
}

interface OverviewProps {
  expenses?: Expense[]
}

export function Overview({ expenses = [] }: OverviewProps) {
  // Safely handle expenses data
  const safeExpenses = Array.isArray(expenses) ? expenses : []

  // Get last 6 months of data
  const monthsData = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleDateString("vi-VN", { month: "short" })
    const monthExpenses = safeExpenses.filter((expense) => {
      try {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === date.getMonth() && expenseDate.getFullYear() === date.getFullYear()
      } catch {
        return false
      }
    })

    const total = monthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)

    monthsData.push({
      name: monthName,
      total: total,
    })
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthsData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip
          formatter={(value: number) => [
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value),
            "Chi tiêu",
          ]}
        />
        <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
