"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/auth"
import { getExpenses } from "@/lib/expenses"
import { analyzeExpenses } from "@/lib/ai-analysis"
import type { User, Expense } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain, Lightbulb } from "lucide-react"

export default function AnalysisPage() {
  const [user, setUser] = useState<User | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    const userExpenses = getExpenses(currentUser.id)
    setExpenses(userExpenses)
    setIsLoading(false)
  }, [router])

  const handleAnalyze = async () => {
    if (expenses.length === 0) return

    setIsAnalyzing(true)
    try {
      const result = await analyzeExpenses(expenses)
      setAnalysis(result)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black flex items-center gap-3">
            <Brain className="h-8 w-8 text-[#FFD6BA]" />
            Phân tích AI chi tiêu
          </h1>
          <p className="text-gray-700 text-sm sm:text-base mt-2">
            Sử dụng AI để phân tích thói quen chi tiêu và đưa ra lời khuyên cá nhân hóa
          </p>
        </div>

        {expenses.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardContent className="text-center py-12">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">Chưa có dữ liệu chi tiêu</h3>
              <p className="text-gray-600 mb-6">
                Bạn cần thêm ít nhất một khoản chi tiêu để sử dụng tính năng phân tích AI
              </p>
              <Button
                onClick={() => router.push("/expenses/add")}
                className="bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black font-semibold"
              >
                Thêm chi tiêu đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* AI Analysis Trigger */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[#FFD6BA]" />
                  Phân tích thông minh
                </CardTitle>
                <CardDescription className="text-gray-700">
                  Nhấn nút bên dưới để AI phân tích {expenses.length} khoản chi tiêu của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Đang phân tích...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Phân tích với AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysis && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Insights */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-black flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Thông tin chi tiêu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.insights.map((insight: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#FFF2EB] to-[#FFE8CD] rounded-lg"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-black text-sm">{insight}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-black flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-[#FFD6BA]" />
                      Lời khuyên cá nhân
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-[#FFDCDC] to-[#FFF2EB] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              rec.priority === "high"
                                ? "destructive"
                                : rec.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {rec.priority === "high"
                              ? "Ưu tiên cao"
                              : rec.priority === "medium"
                                ? "Ưu tiên trung bình"
                                : "Ưu tiên thấp"}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-black mb-1">{rec.title}</h4>
                        <p className="text-black text-sm">{rec.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Spending Trends */}
                <Card className="shadow-lg border-0 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-black flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-blue-600" />
                      Xu hướng chi tiêu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-r from-[#FFE8CD] to-[#FFD6BA] rounded-lg">
                        <div className="text-2xl font-bold text-black mb-1">
                          {analysis.trends.averageDaily.toLocaleString("vi-VN")} ₫
                        </div>
                        <div className="text-sm text-black opacity-80">Chi tiêu trung bình/ngày</div>
                      </div>

                      <div className="text-center p-4 bg-gradient-to-r from-[#FFD6BA] to-[#FFDCDC] rounded-lg">
                        <div className="text-2xl font-bold text-black mb-1">{analysis.trends.topCategory}</div>
                        <div className="text-sm text-black opacity-80">Danh mục chi nhiều nhất</div>
                      </div>

                      <div className="text-center p-4 bg-gradient-to-r from-[#FFDCDC] to-[#FFF2EB] rounded-lg">
                        <div className="text-2xl font-bold text-black mb-1">
                          {analysis.trends.savingsPotential.toLocaleString("vi-VN")} ₫
                        </div>
                        <div className="text-sm text-black opacity-80">Tiềm năng tiết kiệm</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
