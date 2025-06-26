import type { Expense } from "./types"
import { EXPENSE_CATEGORIES } from "./constants"

export async function analyzeExpenses(expenses: Expense[]) {
  // Simulate AI analysis with realistic insights
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategory = Object.entries(categoryTotals).reduce((a, b) =>
    categoryTotals[a[0]] > categoryTotals[b[0]] ? a : b,
  )[0]

  const averageDaily = totalAmount / 30 // Assuming 30 days
  const topCategoryLabel = EXPENSE_CATEGORIES[topCategory as keyof typeof EXPENSE_CATEGORIES]?.label || topCategory

  // Generate insights based on spending patterns
  const insights = [
    `Bạn đã chi tiêu tổng cộng ${totalAmount.toLocaleString("vi-VN")} ₫ trong ${expenses.length} giao dịch`,
    `Danh mục "${topCategoryLabel}" chiếm ${((categoryTotals[topCategory] / totalAmount) * 100).toFixed(1)}% tổng chi tiêu`,
    `Chi tiêu trung bình mỗi ngày là ${averageDaily.toLocaleString("vi-VN")} ₫`,
    expenses.length > 10
      ? "Bạn có thói quen ghi chép chi tiêu khá tốt"
      : "Nên ghi chép chi tiêu thường xuyên hơn để theo dõi tốt hơn",
  ]

  // Generate personalized recommendations
  const recommendations = []

  if (categoryTotals.food && categoryTotals.food > totalAmount * 0.4) {
    recommendations.push({
      priority: "high",
      title: "Tối ưu chi phí ăn uống",
      description: "Chi phí ăn uống chiếm tỷ lệ cao. Hãy thử nấu ăn tại nhà nhiều hơn để tiết kiệm.",
    })
  }

  if (categoryTotals.entertainment && categoryTotals.entertainment > totalAmount * 0.3) {
    recommendations.push({
      priority: "medium",
      title: "Cân bằng chi phí giải trí",
      description: "Chi phí giải trí khá cao. Hãy tìm các hoạt động giải trí miễn phí hoặc chi phí thấp.",
    })
  }

  if (categoryTotals.savings && categoryTotals.savings > 0) {
    recommendations.push({
      priority: "low",
      title: "Tuyệt vời! Bạn đã tiết kiệm",
      description: "Bạn đã có ý thức tiết kiệm. Hãy duy trì và tăng dần số tiền tiết kiệm mỗi tháng.",
    })
  } else {
    recommendations.push({
      priority: "high",
      title: "Bắt đầu tiết kiệm",
      description: "Hãy dành ít nhất 10-20% thu nhập để tiết kiệm cho tương lai.",
    })
  }

  const savingsPotential = Math.max(0, totalAmount * 0.15) // Assume 15% savings potential

  return {
    insights,
    recommendations,
    trends: {
      averageDaily: Math.round(averageDaily),
      topCategory: topCategoryLabel,
      savingsPotential: Math.round(savingsPotential),
    },
  }
}
