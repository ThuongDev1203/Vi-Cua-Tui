"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, TrendingUp, PieChart, Settings, Download, Target } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Thêm chi tiêu",
      description: "Ghi lại chi tiêu mới",
      icon: Plus,
      href: "/expenses/add",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Xem thống kê",
      description: "Phân tích chi tiêu",
      icon: TrendingUp,
      href: "/statistics",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Quản lý ngân sách",
      description: "Thiết lập ngân sách",
      icon: Target,
      href: "/budgets",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Phân tích AI",
      description: "Insights thông minh",
      icon: PieChart,
      href: "/analysis",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Cài đặt",
      description: "Tùy chỉnh ứng dụng",
      icon: Settings,
      href: "/settings",
      color: "bg-gray-500 hover:bg-gray-600",
    },
    {
      title: "Xuất dữ liệu",
      description: "Tải về báo cáo",
      icon: Download,
      href: "#",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
        <CardDescription>Các tính năng thường dùng để quản lý chi tiêu</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all"
                >
                  <div className={`p-2 rounded-full text-white ${action.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
