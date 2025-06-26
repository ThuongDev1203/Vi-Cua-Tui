"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { addExpense } from "@/lib/expenses"
import type { User } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ExpenseForm from "@/components/ui/expense-form"

export default function AddExpensePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleSubmit = async (expenseData: any) => {
    if (!user) return

    setIsLoading(true)
    try {
      addExpense({
        ...expenseData,
        userId: user.id,
      })
      router.push("/expenses")
    } catch (error) {
      console.error("Error adding expense:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-black">Thêm chi tiêu mới</CardTitle>
            <CardDescription className="text-gray-700">Ghi chép giao dịch chi tiêu của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseForm onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
