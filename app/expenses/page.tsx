"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { getExpenses, deleteExpense } from "@/lib/expenses"
import { EXPENSE_CATEGORIES } from "@/lib/constants"
import type { User, Expense } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Trash2, Edit, Plus } from "lucide-react"

export default function ExpensesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadExpenses(currentUser.id)
  }, [router])

  const loadExpenses = (userId: string) => {
    setExpenses(getExpenses(userId))
    setIsLoading(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
      deleteExpense(id)
      if (user) {
        loadExpenses(user.id)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD6BA]"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  const sortedExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Danh sách chi tiêu</h1>
            <p className="text-gray-700 text-sm sm:text-base">Quản lý tất cả giao dịch của bạn</p>
          </div>
          <Link href="/expenses/add">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFD0D0] hover:to-[#FFCAA0] text-black shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Thêm chi tiêu
            </Button>
          </Link>
        </div>

        {sortedExpenses.length > 0 ? (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-black">Tất cả giao dịch ({sortedExpenses.length})</CardTitle>
              <CardDescription className="text-gray-700">
                Danh sách chi tiêu được sắp xếp theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-[#FFF2EB] to-[#FFE8CD] border rounded-lg hover:shadow-md transition-shadow gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: EXPENSE_CATEGORIES[expense.category].color + "80" }}
                      >
                        <span className="text-lg sm:text-xl">{EXPENSE_CATEGORIES[expense.category].icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-base sm:text-lg text-black truncate">{expense.description}</p>
                        <p className="text-xs sm:text-sm text-gray-700">
                          {EXPENSE_CATEGORIES[expense.category].label} •{" "}
                          {new Date(expense.date).toLocaleDateString("vi-VN", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <div className="text-right">
                        <p className="font-bold text-lg sm:text-xl text-red-600">
                          -{expense.amount.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>

                      <div className="flex space-x-2 flex-shrink-0">
                        <Link href={`/expenses/edit/${expense.id}`}>
                          <Button variant="outline" size="sm" className="border-gray-300 hover:bg-[#FFF2EB]">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-0">
            <CardContent className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4">💸</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-black">Chưa có giao dịch nào</h3>
              <p className="text-gray-700 mb-6 text-sm sm:text-base">
                Bắt đầu theo dõi chi tiêu của bạn bằng cách thêm giao dịch đầu tiên
              </p>
              <Link href="/expenses/add">
                <Button className="bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFD0D0] hover:to-[#FFCAA0] text-black shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm giao dịch đầu tiên
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
