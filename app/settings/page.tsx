"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentUser, updateUserProfile, changePassword, deleteAccount } from "@/lib/auth"
import type { User } from "@/lib/types"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import {
  Settings,
  UserIcon,
  Lock,
  Bell,
  Palette,
  Trash2,
  Camera,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
} from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Profile states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [avatar, setAvatar] = useState("")

  // Password states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [monthlyReport, setMonthlyReport] = useState(true)
  const [theme, setTheme] = useState("light")
  const [language, setLanguage] = useState("vi")
  const [currency, setCurrency] = useState("VND")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Load user profile data
    const savedProfile = localStorage.getItem(`profile_${currentUser.id}`)
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setName(profile.name || currentUser.name)
      setEmail(profile.email || currentUser.email)
      setPhone(profile.phone || "")
      setBio(profile.bio || "")
      setLocation(profile.location || "")
      setWebsite(profile.website || "")
      setBirthDate(profile.birthDate || "")
      setAvatar(profile.avatar || "")
    } else {
      setName(currentUser.name)
      setEmail(currentUser.email)
    }

    // Load settings
    const savedSettings = localStorage.getItem(`settings_${currentUser.id}`)
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setEmailNotifications(settings.emailNotifications ?? true)
      setPushNotifications(settings.pushNotifications ?? true)
      setWeeklyReport(settings.weeklyReport ?? false)
      setMonthlyReport(settings.monthlyReport ?? true)
      setTheme(settings.theme || "light")
      setLanguage(settings.language || "vi")
      setCurrency(settings.currency || "VND")
    }

    setIsLoading(false)
  }, [router])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSave = async () => {
    if (!user) return

    setIsSaving(true)
    setMessage("")
    setError("")

    try {
      const profileData = {
        name,
        email,
        phone,
        bio,
        location,
        website,
        birthDate,
        avatar,
      }

      localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData))

      // Update user in auth system
      await updateUserProfile(user.id, { name, email })

      setMessage("Thông tin cá nhân đã được cập nhật thành công!")

      // Update current user
      const updatedUser = { ...user, name, email }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!user) return

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }

    setIsSaving(true)
    setMessage("")
    setError("")

    try {
      await changePassword(user.email, currentPassword, newPassword)
      setMessage("Mật khẩu đã được thay đổi thành công!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi đổi mật khẩu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSettingsSave = async () => {
    if (!user) return

    setIsSaving(true)
    setMessage("")

    try {
      const settings = {
        emailNotifications,
        pushNotifications,
        weeklyReport,
        monthlyReport,
        theme,
        language,
        currency,
      }

      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings))
      setMessage("Cài đặt đã được lưu thành công!")
    } catch (err) {
      setError("Có lỗi xảy ra khi lưu cài đặt")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!")

    if (confirmed) {
      try {
        await deleteAccount(user.id)
        router.push("/")
      } catch (err) {
        setError("Có lỗi xảy ra khi xóa tài khoản")
      }
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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-[#FFD6BA]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Cài đặt tài khoản</h1>
          </div>
          <p className="text-black/70 text-sm sm:text-base">
            Quản lý thông tin cá nhân và tùy chỉnh trải nghiệm của bạn
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{message}</div>
        )}

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Hồ sơ</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Bảo mật</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Thông báo</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Tùy chỉnh</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Thông tin cá nhân
                </CardTitle>
                <CardDescription>Cập nhật thông tin hồ sơ và ảnh đại diện của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
                    <AvatarFallback className="bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] text-black text-xl">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] text-black rounded-lg hover:from-[#FFE8CD] hover:to-[#FFF2EB] transition-colors">
                        <Camera className="h-4 w-4" />
                        Thay đổi ảnh
                      </div>
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG tối đa 5MB</p>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0123456789"
                      className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày sinh
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]"
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <Label htmlFor="bio">Giới thiệu bản thân</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Viết vài dòng về bản thân..."
                    className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Địa chỉ
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Thành phố, Quốc gia"
                      className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleProfileSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Đổi mật khẩu
                  </CardTitle>
                  <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại *</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA] pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Mật khẩu mới *</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA] pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA] pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handlePasswordChange}
                    disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                    className="bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {isSaving ? "Đang cập nhật..." : "Đổi mật khẩu"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    Xóa tài khoản
                  </CardTitle>
                  <CardDescription>Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Hành động này không thể hoàn tác. Tất cả dữ liệu chi tiêu, thống kê và cài đặt sẽ bị xóa vĩnh viễn.
                  </p>
                  <Button onClick={handleDeleteAccount} variant="destructive" className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa tài khoản
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Cài đặt thông báo
                </CardTitle>
                <CardDescription>Quản lý cách bạn nhận thông báo từ ứng dụng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Thông báo email</Label>
                      <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Thông báo đẩy</Label>
                      <p className="text-sm text-gray-500">Nhận thông báo trên thiết bị</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Báo cáo hàng tuần</Label>
                      <p className="text-sm text-gray-500">Tóm tắt chi tiêu hàng tuần</p>
                    </div>
                    <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Báo cáo hàng tháng</Label>
                      <p className="text-sm text-gray-500">Tóm tắt chi tiêu hàng tháng</p>
                    </div>
                    <Switch checked={monthlyReport} onCheckedChange={setMonthlyReport} />
                  </div>
                </div>

                <Button
                  onClick={handleSettingsSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Đang lưu..." : "Lưu cài đặt"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Tùy chỉnh giao diện
                </CardTitle>
                <CardDescription>Cá nhân hóa trải nghiệm sử dụng ứng dụng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="theme">Giao diện</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Sáng</SelectItem>
                        <SelectItem value="dark">Tối</SelectItem>
                        <SelectItem value="auto">Tự động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Ngôn ngữ</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VND">VND (₫)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleSettingsSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] hover:from-[#FFE8CD] hover:to-[#FFF2EB] text-black"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Đang lưu..." : "Lưu tùy chỉnh"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
