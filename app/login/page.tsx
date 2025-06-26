"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/auth"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF2EB] via-[#FFE8CD] to-[#FFD6BA]">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-black">Đăng nhập</CardTitle>
            <CardDescription className="text-black/70">Đăng nhập vào tài khoản Ví Của Tui của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  required
                  className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA] text-black"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-black">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA] text-black"
                />
              </div>

              {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black shadow-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-black/70">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-black hover:underline font-medium">
                  Đăng ký ngay
                </Link>
              </p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">
                  <strong>Demo:</strong> email: demo@example.com, mật khẩu: demo123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
