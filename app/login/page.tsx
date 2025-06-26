"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { login, resetPassword } from "@/lib/auth"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Mail, Lock, Key } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Forgot password states
  const [resetEmail, setResetEmail] = useState("")
  const [isResetting, setIsResetting] = useState(false)
  const [resetSuccess, setResetSuccess] = useState("")
  const [resetError, setResetError] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showResetDialog, setShowResetDialog] = useState(false)

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetting(true)
    setResetError("")
    setResetSuccess("")

    try {
      const newPass = await resetPassword(resetEmail)
      setNewPassword(newPass)
      setResetSuccess(`Mật khẩu mới đã được tạo: ${newPass}`)
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Đã có lỗi xảy ra")
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF2EB] via-[#FFE8CD] to-[#FFD6BA]">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-black flex items-center justify-center gap-2">
              <Lock className="h-6 w-6 text-[#FFD6BA]" />
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-black/70">Đăng nhập vào tài khoản Ví Của Tui của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-black flex items-center gap-2">
                  <Mail className="h-4 w-4" />
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
                <Label htmlFor="password" className="text-black flex items-center gap-2">
                  <Key className="h-4 w-4" />
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

            <div className="mt-6 text-center space-y-3">
              <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-black hover:underline text-sm">
                    Quên mật khẩu?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-black">Đặt lại mật khẩu</DialogTitle>
                    <DialogDescription className="text-black/70">
                      Nhập email của bạn để nhận mật khẩu mới
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="resetEmail" className="text-black">
                        Email
                      </Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        required
                        className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA] text-black"
                      />
                    </div>

                    {resetError && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{resetError}</div>}

                    {resetSuccess && (
                      <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                        <p className="font-semibold">Thành công!</p>
                        <p>{resetSuccess}</p>
                        <p className="mt-2 text-xs">Vui lòng lưu lại mật khẩu mới này</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowResetDialog(false)
                          setResetEmail("")
                          setResetError("")
                          setResetSuccess("")
                          setNewPassword("")
                        }}
                        className="flex-1"
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        disabled={isResetting}
                        className="flex-1 bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black"
                      >
                        {isResetting ? "Đang xử lý..." : "Đặt lại"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <p className="text-sm text-black/70">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-black hover:underline font-medium">
                  Đăng ký ngay
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
