"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser, logout, isAdmin } from "@/lib/auth"
import { useSettings } from "@/lib/settings-context"
import type { User } from "@/lib/types"
import { Menu, X, Shield, UserIcon, Settings } from "lucide-react"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { settings, getTranslation } = useSettings()

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
      className={`shadow-sm border-b border-gray-100 sticky top-0 z-50 transition-colors duration-300 ${
        userIsAdmin ? "bg-gradient-to-r from-red-50 to-red-100" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={user ? (userIsAdmin ? "/admin" : "/dashboard") : "/"} className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
                userIsAdmin
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : `bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]`
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
                      <Button variant="ghost" className="text-black hover:bg-red-100 transition-colors">
                        <Shield className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/admin/users">
                      <Button variant="ghost" className="text-black hover:bg-red-100 transition-colors">
                        <UserIcon className="h-4 w-4 mr-2" />
                        Người dùng
                      </Button>
                    </Link>
                    <Link href="/admin/system">
                      <Button variant="ghost" className="text-black hover:bg-red-100 transition-colors">
                        Hệ thống
                      </Button>
                    </Link>
                  </>
                ) : (
                  // User Navigation
                  <>
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        className="text-black hover:bg-[var(--color-background)] transition-colors"
                      >
                        {getTranslation("dashboard")}
                      </Button>
                    </Link>
                    <Link href="/expenses">
                      <Button
                        variant="ghost"
                        className="text-black hover:bg-[var(--color-background)] transition-colors"
                      >
                        {getTranslation("expenses")}
                      </Button>
                    </Link>
                    <Link href="/statistics">
                      <Button
                        variant="ghost"
                        className="text-black hover:bg-[var(--color-background)] transition-colors"
                      >
                        {getTranslation("statistics")}
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button
                        variant="ghost"
                        className="text-black hover:bg-[var(--color-background)] transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {getTranslation("settings")}
                      </Button>
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={settings.avatar || "/placeholder.svg"} alt={settings.name || user.name} />
                      <AvatarFallback
                        className={`text-xs font-bold ${
                          userIsAdmin
                            ? "bg-red-500 text-white"
                            : "bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-black"
                        }`}
                      >
                        {(settings.name || user.name).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-black/70 hidden lg:block">
                      {settings.name || user.name}
                      {userIsAdmin && <span className="text-red-600 ml-1">(Admin)</span>}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className={`border-gray-300 text-black transition-colors ${
                      userIsAdmin ? "hover:bg-red-100" : "hover:bg-[var(--color-background)]"
                    }`}
                  >
                    {getTranslation("logout")}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-black hover:bg-[var(--color-background)] transition-colors">
                    {getTranslation("login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] hover:from-[var(--color-accent)] hover:to-[var(--color-background)] text-black shadow-lg transition-all">
                    {getTranslation("register")}
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
          <div
            className={`md:hidden py-4 border-t border-gray-100 transition-colors ${
              userIsAdmin ? "bg-red-50" : "bg-white"
            }`}
          >
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
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-black hover:bg-[var(--color-background)]"
                        >
                          {getTranslation("dashboard")}
                        </Button>
                      </Link>
                      <Link href="/expenses" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-black hover:bg-[var(--color-background)]"
                        >
                          {getTranslation("expenses")}
                        </Button>
                      </Link>
                      <Link href="/statistics" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-black hover:bg-[var(--color-background)]"
                        >
                          {getTranslation("statistics")}
                        </Button>
                      </Link>
                      <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-black hover:bg-[var(--color-background)]"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          {getTranslation("settings")}
                        </Button>
                      </Link>
                    </>
                  )}

                  <div className="px-3 py-2 flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={settings.avatar || "/placeholder.svg"} alt={settings.name || user.name} />
                      <AvatarFallback
                        className={`text-xs font-bold ${
                          userIsAdmin
                            ? "bg-red-500 text-white"
                            : "bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-black"
                        }`}
                      >
                        {(settings.name || user.name).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-black/70">
                      {settings.name || user.name}
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
                      userIsAdmin ? "hover:bg-red-100" : "hover:bg-[var(--color-background)]"
                    }`}
                  >
                    {getTranslation("logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-black hover:bg-[var(--color-background)]"
                    >
                      {getTranslation("login")}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] hover:from-[var(--color-accent)] hover:to-[var(--color-background)] text-black shadow-lg">
                      {getTranslation("register")}
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
