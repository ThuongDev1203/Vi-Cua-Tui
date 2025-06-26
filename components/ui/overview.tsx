"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface OverviewProps {
  data?: Array<{
    name: string
    total: number
  }>
}

export function Overview({ data = [] }: OverviewProps) {
  // Default data if none provided
  const defaultData = [
    { name: "Jan", total: 2400000 },
    { name: "Feb", total: 1800000 },
    { name: "Mar", total: 3200000 },
    { name: "Apr", total: 2800000 },
    { name: "May", total: 1900000 },
    { name: "Jun", total: 2600000 },
    { name: "Jul", total: 3100000 },
    { name: "Aug", total: 2200000 },
    { name: "Sep", total: 2900000 },
    { name: "Oct", total: 2500000 },
    { name: "Nov", total: 2700000 },
    { name: "Dec", total: 3000000 },
  ]

  const chartData = data.length > 0 ? data : defaultData

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip
          formatter={(value: number) => [
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value),
            "Chi tiêu",
          ]}
        />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
