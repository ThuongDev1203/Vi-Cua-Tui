"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { register } from "@/lib/auth"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      setIsLoading(false)
      return
    }

    try {
      await register(email, password, name)
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
            <CardTitle className="text-2xl font-bold text-black">Đăng ký</CardTitle>
            <CardDescription className="text-black/70">Tạo tài khoản Ví Của Tui mới</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-black">
                  Họ và tên
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ và tên"
                  required
                  className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA] text-black"
                />
              </div>

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

              <div>
                <Label htmlFor="confirmPassword" className="text-black">
                  Xác nhận mật khẩu
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
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
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-black/70">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-black hover:underline font-medium">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
