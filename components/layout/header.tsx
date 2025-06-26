"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCurrentUser, logout, isAdmin } from "@/lib/auth"
import type { User } from "@/lib/types"
import { Menu, X, Shield, UserIcon } from "lucide-react"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    router.push("/")
  }

  const userIsAdmin = isAdmin(user)

  return (
    <header
      className={`shadow-sm border-b border-gray-100 sticky top-0 z-50 ${
        userIsAdmin ? "bg-gradient-to-r from-red-50 to-red-100" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${
                userIsAdmin
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : "bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA]"
              }`}
            >
              <span className={`font-bold text-lg ${userIsAdmin ? "text-white" : "text-black"}`}>
                {userIsAdmin ? "🛡️" : "💰"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-black">{userIsAdmin ? "Admin Panel" : "Ví Của Tui"}</span>
              {userIsAdmin && <span className="text-xs text-red-600 font-medium">Quản trị hệ thống</span>}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {userIsAdmin ? (
                  // Admin Navigation
                  <>
                    <Link href="/admin">
                      <Button variant="ghost" className="text-black hover:bg-red-100">
                        <Shield className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/admin/users">
                      <Button variant="ghost" className="text-black hover:bg-red-100">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Người dùng
                      </Button>
                    </Link>
                    <Link href="/admin/system">
                      <Button variant="ghost" className="text-black hover:bg-red-100">
                        Hệ thống
                      </Button>
                    </Link>
                  </>
                ) : (
                  // User Navigation
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="text-black hover:bg-[#FFF2EB]">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/expenses">
                      <Button variant="ghost" className="text-black hover:bg-[#FFF2EB]">
                        Chi tiêu
                      </Button>
                    </Link>
                    <Link href="/statistics">
                      <Button variant="ghost" className="text-black hover:bg-[#FFF2EB]">
                        Thống kê
                      </Button>
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/50">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        userIsAdmin ? "bg-red-500 text-white" : "bg-[#FFD6BA] text-black"
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-black/70 hidden lg:block">
                      {user.name}
                      {userIsAdmin && <span className="text-red-600 ml-1">(Admin)</span>}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className={`border-gray-300 text-black ${userIsAdmin ? "hover:bg-red-100" : "hover:bg-[#FFF2EB]"}`}
                  >
                    Đăng xuất
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-black hover:bg-[#FFF2EB]">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black shadow-lg">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-black">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t border-gray-100 ${userIsAdmin ? "bg-red-50" : "bg-white"}`}>
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  {userIsAdmin ? (
                    // Admin Mobile Navigation
                    <>
                      <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-red-100">
                          <Shield className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/admin/users" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-red-100">
                          <UserIcon className="h-4 w-4 mr-2" />
                          Người dùng
                        </Button>
                      </Link>
                      <Link href="/admin/system" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-red-100">
                          Hệ thống
                        </Button>
                      </Link>
                    </>
                  ) : (
                    // User Mobile Navigation
                    <>
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-[#FFF2EB]">
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/expenses" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-[#FFF2EB]">
                          Chi tiêu
                        </Button>
                      </Link>
                      <Link href="/statistics" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-black hover:bg-[#FFF2EB]">
                          Thống kê
                        </Button>
                      </Link>
                    </>
                  )}

                  <div className="px-3 py-2 flex items-center space-x-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        userIsAdmin ? "bg-red-500 text-white" : "bg-[#FFD6BA] text-black"
                      }`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-black/70">
                      {user.name}
                      {userIsAdmin && <span className="text-red-600 ml-1">(Admin)</span>}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className={`w-full justify-start border-gray-300 text-black ${
                      userIsAdmin ? "hover:bg-red-100" : "hover:bg-[#FFF2EB]"
                    }`}
                  >
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-black hover:bg-[#FFF2EB]">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black shadow-lg">
                      Đăng ký
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
