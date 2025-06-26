export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  isVerified: boolean
  createdAt: Date
}

export interface Expense {
  id: string
  userId: string
  amount: number
  category: ExpenseCategory
  description: string
  date: Date
  createdAt: Date
}

export type ExpenseCategory =
  | "food"
  | "transportation"
  | "entertainment"
  | "shopping"
  | "healthcare"
  | "education"
  | "savings"
  | "other"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface Budget {
  id: string
  userId: string
  name: string
  amount: number
  period: "monthly" | "weekly" | "yearly"
  categories: ExpenseCategory[]
  startDate: Date
  endDate?: Date
  isActive: boolean
  createdAt: Date
}

export interface BudgetAlert {
  id: string
  budgetId: string
  userId: string
  type: "warning" | "exceeded" | "approaching"
  threshold: number
  message: string
  isRead: boolean
  createdAt: Date
}
