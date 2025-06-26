"use client"

import type { Expense } from "./types"

const STORAGE_KEY = "expenses"

export const getExpenses = (userId: string): Expense[] => {
  if (typeof window === "undefined") return []
  const expensesStr = localStorage.getItem(STORAGE_KEY)
  const allExpenses: Expense[] = expensesStr ? JSON.parse(expensesStr) : []
  return allExpenses.filter((expense) => expense.userId === userId)
}

export const addExpense = (expense: Omit<Expense, "id" | "createdAt">): Expense => {
  const newExpense: Expense = {
    ...expense,
    id: Date.now().toString(),
    createdAt: new Date(),
    date: new Date(expense.date),
  }

  const allExpenses = getAllExpenses()
  allExpenses.push(newExpense)
  saveExpenses(allExpenses)

  return newExpense
}

export const updateExpense = (id: string, updates: Partial<Expense>): Expense | null => {
  const allExpenses = getAllExpenses()
  const index = allExpenses.findIndex((expense) => expense.id === id)

  if (index === -1) return null

  allExpenses[index] = { ...allExpenses[index], ...updates }
  saveExpenses(allExpenses)

  return allExpenses[index]
}

export const deleteExpense = (id: string): boolean => {
  const allExpenses = getAllExpenses()
  const filteredExpenses = allExpenses.filter((expense) => expense.id !== id)

  if (filteredExpenses.length === allExpenses.length) return false

  saveExpenses(filteredExpenses)
  return true
}

const getAllExpenses = (): Expense[] => {
  if (typeof window === "undefined") return []
  const expensesStr = localStorage.getItem(STORAGE_KEY)
  return expensesStr ? JSON.parse(expensesStr) : []
}

const saveExpenses = (expenses: Expense[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}
