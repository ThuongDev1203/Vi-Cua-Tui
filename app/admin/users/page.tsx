"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getCurrentUser, isAdmin, getAllUsersWithCredentials } from "@/lib/auth"
import type { User } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Users, Search, Eye, EyeOff, Shield, Mail, Key, Calendar } from "lucide-react"

export default function AdminUsersPage() {
  const [user, setUser] = useState<User | null>(null)
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [showEmails, setShowEmails] = useState<{ [key: string]: boolean }>({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    if (!isAdmin(currentUser)) {
      router.push("/dashboard")
      return
    }

    setUser(currentUser)

    // Get all users with credentials
    const usersWithCredentials = getAllUsersWithCredentials()
    setAllUsers(usersWithCredentials)
    setFilteredUsers(usersWithCredentials)

    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (searchTerm) {
      const filtered = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(allUsers)
    }
  }, [searchTerm, allUsers])

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const toggleEmailVisibility = (userId: string) => {
    setShowEmails((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user || !isAdmin(user)) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Quản lý người dùng</h1>
          </div>
          <p className="text-black/70 text-sm sm:text-base">
            Xem và quản lý tất cả tài khoản người dùng trong hệ thống
          </p>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-red-400 focus:ring-red-400"
              />
            </div>
          </div>
          <Card className="bg-gradient-to-r from-red-100 to-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{filteredUsers.length}</div>
                <p className="text-xs text-black/70">Người dùng</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((userData) => (
            <Card key={userData.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* User Avatar & Basic Info */}
                  <div className="lg:col-span-3 flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-lg">{userData.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{userData.name}</h3>
                      <Badge variant={userData.role === "admin" ? "destructive" : "secondary"} className="text-xs">
                        {userData.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-black font-mono">
                          {showEmails[userData.id] ? userData.email : userData.encryptedEmail}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEmailVisibility(userData.id)}
                          className="h-6 w-6 p-0"
                        >
                          {showEmails[userData.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-gray-500" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-black font-mono">
                          {showPasswords[userData.id] ? userData.decryptedPassword || userData.password : "••••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(userData.id)}
                          className="h-6 w-6 p-0"
                        >
                          {showPasswords[userData.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-black/70">
                        {new Date(userData.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-black/60">
                    <div>
                      <span className="font-medium">ID:</span> {userData.id}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span> <span className="text-green-600">Hoạt động</span>
                    </div>
                    <div>
                      <span className="font-medium">Loại:</span> {userData.id === "1" ? "Demo User" : "Registered User"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredUsers.length === 0 && (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-black mb-2">Không tìm thấy người dùng</h3>
                <p className="text-black/60">
                  {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Chưa có người dùng nào trong hệ thống"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Security Notice */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              Lưu ý bảo mật
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-black/80 space-y-2">
              <p>• Mật khẩu được mã hóa và chỉ admin mới có thể xem</p>
              <p>• Email được ẩn một phần để bảo vệ quyền riêng tư</p>
              <p>• Thông tin này chỉ dành cho mục đích quản trị hệ thống</p>
              <p>• Vui lòng không chia sẻ thông tin này với bên thứ ba</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
