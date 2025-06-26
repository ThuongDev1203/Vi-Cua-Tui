"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCurrentUser, logout } from "@/lib/auth"
import type { User } from "@/lib/types"
import { Menu, X } from "lucide-react"

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

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-lg">💰</span>
            </div>
            <span className="text-xl font-bold text-black">Ví Của Tui</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {user ? (
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
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-black/70 hidden lg:block">Xin chào, {user.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-gray-300 text-black hover:bg-[#FFF2EB]"
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
          <div className="md:hidden py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col space-y-2">
              {user ? (
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
                  <div className="px-3 py-2">
                    <span className="text-sm text-black/70">Xin chào, {user.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full justify-start border-gray-300 text-black hover:bg-[#FFF2EB]"
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
