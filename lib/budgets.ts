"use client"

import type { Budget, BudgetAlert, Expense, ExpenseCategory } from "./types"

const BUDGETS_STORAGE_KEY = "budgets"
const BUDGET_ALERTS_STORAGE_KEY = "budget_alerts"

export const getBudgets = (userId: string): Budget[] => {
  if (typeof window === "undefined") return []
  const budgetsStr = localStorage.getItem(BUDGETS_STORAGE_KEY)
  const allBudgets: Budget[] = budgetsStr ? JSON.parse(budgetsStr) : []
  return allBudgets.filter((budget) => budget.userId === userId)
}

export const getAllBudgets = (): Budget[] => {
  if (typeof window === "undefined") return []
  const budgetsStr = localStorage.getItem(BUDGETS_STORAGE_KEY)
  return budgetsStr ? JSON.parse(budgetsStr) : []
}

export const addBudget = (budget: Omit<Budget, "id" | "createdAt">): Budget => {
  const newBudget: Budget = {
    ...budget,
    id: Date.now().toString(),
    createdAt: new Date(),
    startDate: new Date(budget.startDate),
    endDate: budget.endDate ? new Date(budget.endDate) : undefined,
  }

  const allBudgets = getAllBudgets()
  allBudgets.push(newBudget)
  saveBudgets(allBudgets)

  return newBudget
}

export const updateBudget = (id: string, updates: Partial<Budget>): Budget | null => {
  const allBudgets = getAllBudgets()
  const index = allBudgets.findIndex((budget) => budget.id === id)

  if (index === -1) return null

  allBudgets[index] = { ...allBudgets[index], ...updates }
  saveBudgets(allBudgets)

  return allBudgets[index]
}

export const deleteBudget = (id: string): boolean => {
  const allBudgets = getAllBudgets()
  const filteredBudgets = allBudgets.filter((budget) => budget.id !== id)

  if (filteredBudgets.length === allBudgets.length) return false

  saveBudgets(filteredBudgets)

  // Also delete related alerts
  const allAlerts = getBudgetAlerts("")
  const filteredAlerts = allAlerts.filter((alert) => alert.budgetId !== id)
  saveBudgetAlerts(filteredAlerts)

  return true
}

export const getBudgetProgress = (
  budget: Budget,
  expenses: Expense[],
): {
  spent: number
  remaining: number
  percentage: number
  isOverBudget: boolean
  daysRemaining: number
  dailyBudget: number
  projectedSpending: number
} => {
  const now = new Date()
  const budgetStart = new Date(budget.startDate)
  let budgetEnd: Date

  // Calculate budget end date based on period
  switch (budget.period) {
    case "weekly":
      budgetEnd = new Date(budgetStart)
      budgetEnd.setDate(budgetEnd.getDate() + 7)
      break
    case "monthly":
      budgetEnd = new Date(budgetStart)
      budgetEnd.setMonth(budgetEnd.getMonth() + 1)
      break
    case "yearly":
      budgetEnd = new Date(budgetStart)
      budgetEnd.setFullYear(budgetEnd.getFullYear() + 1)
      break
    default:
      budgetEnd = budget.endDate || new Date()
  }

  // Filter expenses for this budget period and categories
  const relevantExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const isInPeriod = expenseDate >= budgetStart && expenseDate <= budgetEnd
    const isInCategory = budget.categories.length === 0 || budget.categories.includes(expense.category)
    return isInPeriod && isInCategory
  })

  const spent = relevantExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remaining = budget.amount - spent
  const percentage = (spent / budget.amount) * 100
  const isOverBudget = spent > budget.amount

  // Calculate days remaining
  const daysRemaining = Math.max(0, Math.ceil((budgetEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  // Calculate daily budget
  const totalDays = Math.ceil((budgetEnd.getTime() - budgetStart.getTime()) / (1000 * 60 * 60 * 24))
  const daysPassed = Math.ceil((now.getTime() - budgetStart.getTime()) / (1000 * 60 * 60 * 24))
  const dailyBudget = budget.amount / totalDays

  // Project spending based on current rate
  const projectedSpending = daysPassed > 0 ? (spent / daysPassed) * totalDays : 0

  return {
    spent,
    remaining,
    percentage,
    isOverBudget,
    daysRemaining,
    dailyBudget,
    projectedSpending,
  }
}

export const checkBudgetAlerts = (userId: string, expenses: Expense[]): BudgetAlert[] => {
  const budgets = getBudgets(userId)
  const alerts: BudgetAlert[] = []

  budgets.forEach((budget) => {
    if (!budget.isActive) return

    const progress = getBudgetProgress(budget, expenses)

    // Check for different alert types
    if (progress.percentage >= 100 && !progress.isOverBudget) {
      alerts.push({
        id: `${budget.id}_exceeded_${Date.now()}`,
        budgetId: budget.id,
        userId,
        type: "exceeded",
        threshold: 100,
        message: `Bạn đã vượt quá ngân sách "${budget.name}" với ${(progress.percentage - 100).toFixed(1)}%`,
        isRead: false,
        createdAt: new Date(),
      })
    } else if (progress.percentage >= 90) {
      alerts.push({
        id: `${budget.id}_approaching_${Date.now()}`,
        budgetId: budget.id,
        userId,
        type: "approaching",
        threshold: 90,
        message: `Bạn đã sử dụng ${progress.percentage.toFixed(1)}% ngân sách "${budget.name}"`,
        isRead: false,
        createdAt: new Date(),
      })
    } else if (progress.percentage >= 75) {
      alerts.push({
        id: `${budget.id}_warning_${Date.now()}`,
        budgetId: budget.id,
        userId,
        type: "warning",
        threshold: 75,
        message: `Cảnh báo: Bạn đã sử dụng ${progress.percentage.toFixed(1)}% ngân sách "${budget.name}"`,
        isRead: false,
        createdAt: new Date(),
      })
    }
  })

  // Save new alerts
  if (alerts.length > 0) {
    const existingAlerts = getBudgetAlerts(userId)
    const allAlerts = [...existingAlerts, ...alerts]
    saveBudgetAlerts(allAlerts)
  }

  return alerts
}

export const getBudgetAlerts = (userId: string): BudgetAlert[] => {
  if (typeof window === "undefined") return []
  const alertsStr = localStorage.getItem(BUDGET_ALERTS_STORAGE_KEY)
  const allAlerts: BudgetAlert[] = alertsStr ? JSON.parse(alertsStr) : []
  return userId ? allAlerts.filter((alert) => alert.userId === userId) : allAlerts
}

export const markAlertAsRead = (alertId: string): boolean => {
  const allAlerts = getBudgetAlerts("")
  const alertIndex = allAlerts.findIndex((alert) => alert.id === alertId)

  if (alertIndex === -1) return false

  allAlerts[alertIndex].isRead = true
  saveBudgetAlerts(allAlerts)
  return true
}

export const clearReadAlerts = (userId: string): void => {
  const allAlerts = getBudgetAlerts("")
  const filteredAlerts = allAlerts.filter((alert) => alert.userId !== userId || !alert.isRead)
  saveBudgetAlerts(filteredAlerts)
}

export const generateBudgetReport = (
  budget: Budget,
  expenses: Expense[],
): {
  budget: Budget
  progress: ReturnType<typeof getBudgetProgress>
  categoryBreakdown: Array<{ category: ExpenseCategory; spent: number; percentage: number }>
  weeklyTrend: Array<{ week: string; spent: number }>
  recommendations: string[]
} => {
  const progress = getBudgetProgress(budget, expenses)

  // Category breakdown
  const categorySpending: Record<ExpenseCategory, number> = {} as Record<ExpenseCategory, number>
  const relevantExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const budgetStart = new Date(budget.startDate)
    let budgetEnd: Date

    switch (budget.period) {
      case "weekly":
        budgetEnd = new Date(budgetStart)
        budgetEnd.setDate(budgetEnd.getDate() + 7)
        break
      case "monthly":
        budgetEnd = new Date(budgetStart)
        budgetEnd.setMonth(budgetEnd.getMonth() + 1)
        break
      case "yearly":
        budgetEnd = new Date(budgetStart)
        budgetEnd.setFullYear(budgetEnd.getFullYear() + 1)
        break
      default:
        budgetEnd = budget.endDate || new Date()
    }

    const isInPeriod = expenseDate >= budgetStart && expenseDate <= budgetEnd
    const isInCategory = budget.categories.length === 0 || budget.categories.includes(expense.category)
    return isInPeriod && isInCategory
  })

  relevantExpenses.forEach((expense) => {
    categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount
  })

  const categoryBreakdown = Object.entries(categorySpending).map(([category, spent]) => ({
    category: category as ExpenseCategory,
    spent,
    percentage: (spent / progress.spent) * 100,
  }))

  // Weekly trend (simplified)
  const weeklyTrend = Array.from({ length: 4 }, (_, i) => ({
    week: `Week ${i + 1}`,
    spent: Math.random() * (progress.spent / 4), // Simplified for demo
  }))

  // Generate recommendations
  const recommendations: string[] = []
  if (progress.percentage > 90) {
    recommendations.push("Bạn đang chi tiêu gần hết ngân sách. Hãy xem xét giảm chi tiêu không cần thiết.")
  }
  if (progress.projectedSpending > budget.amount) {
    recommendations.push("Theo xu hướng hiện tại, bạn có thể vượt ngân sách. Hãy điều chỉnh chi tiêu.")
  }
  if (progress.daysRemaining > 0 && progress.remaining > 0) {
    const suggestedDailySpending = progress.remaining / progress.daysRemaining
    recommendations.push(
      `Bạn có thể chi tối đa ${suggestedDailySpending.toLocaleString("vi-VN")}₫ mỗi ngày trong ${progress.daysRemaining} ngày còn lại.`,
    )
  }

  return {
    budget,
    progress,
    categoryBreakdown,
    weeklyTrend,
    recommendations,
  }
}

const saveBudgets = (budgets: Budget[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets))
}

const saveBudgetAlerts = (alerts: BudgetAlert[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(BUDGET_ALERTS_STORAGE_KEY, JSON.stringify(alerts))
}
