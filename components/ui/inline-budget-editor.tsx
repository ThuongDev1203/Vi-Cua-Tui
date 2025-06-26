"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useSettings } from "@/lib/settings-context"
import { Check, X, Edit3, Plus, Minus } from "lucide-react"

interface InlineBudgetEditorProps {
  label: string
  value: number
  onSave: (newValue: number) => void
  onCancel?: () => void
  placeholder?: string
  min?: number
  max?: number
  step?: number
  showQuickActions?: boolean
  quickActionAmounts?: number[]
}

export function InlineBudgetEditor({
  label,
  value,
  onSave,
  onCancel,
  placeholder = "0",
  min = 0,
  max,
  step = 100000,
  showQuickActions = true,
  quickActionAmounts = [500000, 1000000, 2000000, 5000000],
}: InlineBudgetEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString())
  const [isLoading, setIsLoading] = useState(false)
  const { formatCurrency } = useSettings()

  const handleStartEdit = () => {
    setIsEditing(true)
    setEditValue(value.toString())
  }

  const handleSave = async () => {
    const newValue = Number.parseFloat(editValue)
    if (isNaN(newValue) || newValue < (min || 0)) {
      alert(`Vui lòng nhập số tiền hợp lệ (tối thiểu ${formatCurrency(min || 0)})`)
      return
    }

    if (max && newValue > max) {
      alert(`Số tiền không được vượt quá ${formatCurrency(max)}`)
      return
    }

    setIsLoading(true)
    try {
      await onSave(newValue)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving budget:", error)
      alert("Có lỗi xảy ra khi lưu ngân sách")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(value.toString())
    onCancel?.()
  }

  const handleQuickAction = (amount: number, action: "add" | "subtract") => {
    const currentValue = Number.parseFloat(editValue) || 0
    const newValue = action === "add" ? currentValue + amount : Math.max(0, currentValue - amount)
    setEditValue(newValue.toString())
  }

  const handleQuickSet = (amount: number) => {
    setEditValue(amount.toString())
  }

  if (!isEditing) {
    return (
      <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div>
          <div className="text-sm text-gray-600">{label}</div>
          <div className="text-lg font-semibold text-black">{formatCurrency(value)}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStartEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-2 border-[var(--color-primary)] shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              className="flex-1 border-gray-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              autoFocus
            />
            <Button
              onClick={handleSave}
              disabled={isLoading}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button onClick={handleCancel} disabled={isLoading} variant="outline" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {editValue && (
            <div className="text-sm text-gray-600 mt-1">≈ {formatCurrency(Number.parseFloat(editValue) || 0)}</div>
          )}
        </div>

        {showQuickActions && (
          <div className="space-y-3">
            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">Điều chỉnh nhanh</div>

            {/* Quick Add/Subtract */}
            <div className="flex flex-wrap gap-2">
              {quickActionAmounts.map((amount) => (
                <div key={amount} className="flex">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(amount, "subtract")}
                    className="rounded-r-none border-r-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Minus className="h-3 w-3 mr-1" />
                    {formatCurrency(amount)}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(amount, "add")}
                    className="rounded-l-none text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {formatCurrency(amount)}
                  </Button>
                </div>
              ))}
            </div>

            {/* Quick Set Amounts */}
            <div>
              <div className="text-xs text-gray-500 mb-2">Đặt nhanh:</div>
              <div className="flex flex-wrap gap-2">
                {[1000000, 3000000, 5000000, 10000000, 15000000, 20000000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSet(amount)}
                    className="text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
