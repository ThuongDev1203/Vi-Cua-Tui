export interface User {
  id: string
  email: string
  name: string
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
