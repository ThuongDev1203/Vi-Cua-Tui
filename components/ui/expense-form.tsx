"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EXPENSE_CATEGORIES } from "@/lib/constants"
import type { ExpenseCategory, Expense } from "@/lib/types"

interface ExpenseFormProps {
  onSubmit: (expense: {
    amount: number
    category: ExpenseCategory
    description: string
    date: Date
  }) => void
  initialData?: Partial<Expense>
  isLoading?: boolean
}

export default function ExpenseForm({ onSubmit, initialData, isLoading }: ExpenseFormProps) {
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "")
  const [category, setCategory] = useState<ExpenseCategory>(initialData?.category || "food")
  const [description, setDescription] = useState(initialData?.description || "")
  const [date, setDate] = useState(
    initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !category || !description) return

    onSubmit({
      amount: Number.parseFloat(amount),
      category,
      description,
      date: new Date(date),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount" className="text-black">
          Số tiền (VNĐ)
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền"
          required
          className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA] text-black"
        />
      </div>

      <div>
        <Label htmlFor="category" className="text-black">
          Danh mục
        </Label>
        <Select value={category} onValueChange={(value: ExpenseCategory) => setCategory(value)}>
          <SelectTrigger className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center space-x-2">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description" className="text-black">
          Ghi chú
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả chi tiêu..."
          required
          className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA] text-black"
        />
      </div>

      <div>
        <Label htmlFor="date" className="text-black">
          Ngày chi tiêu
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA] text-black"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black shadow-lg font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm chi tiêu"}
      </Button>
    </form>
  )
}
