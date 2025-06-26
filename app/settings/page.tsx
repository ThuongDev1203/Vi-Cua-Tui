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
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  getCurrentUser,
  updateUserProfile,
  changePassword,
  deleteAccount,
  generateStrongPassword,
  exportUserData,
  importUserData,
  getLoginHistory,
  clearLoginHistory,
  deactivateAccount,
  reactivateAccount,
} from "@/lib/auth"
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
  Download,
  Upload,
  Shield,
  History,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  Zap,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Database,
  FileText,
  Key,
  Smartphone,
  Clock,
  LogOut,
  Power,
  PowerOff,
} from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("profile")
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
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh")

  // Password states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [monthlyReport, setMonthlyReport] = useState(true)
  const [expenseAlerts, setExpenseAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationVolume, setNotificationVolume] = useState([70])

  // Appearance states
  const [theme, setTheme] = useState("light")
  const [colorScheme, setColorScheme] = useState("peach")
  const [fontSize, setFontSize] = useState([16])
  const [compactMode, setCompactMode] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [language, setLanguage] = useState("vi")
  const [currency, setCurrency] = useState("VND")

  // Privacy & Security states
  const [profileVisibility, setProfileVisibility] = useState("private")
  const [dataSharing, setDataSharing] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [loginHistory, setLoginHistory] = useState<any[]>([])
  const [activeSessions, setActiveSessions] = useState<any[]>([])

  // Backup states
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("weekly")
  const [lastBackup, setLastBackup] = useState<Date | null>(null)

  // Account states
  const [accountStatus, setAccountStatus] = useState("active")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadUserSettings(currentUser.id)
    loadLoginHistory(currentUser.id)
    setIsLoading(false)
  }, [router])

  const loadUserSettings = (userId: string) => {
    // Load profile data
    const savedProfile = localStorage.getItem(`profile_${userId}`)
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setName(profile.name || user?.name || "")
      setEmail(profile.email || user?.email || "")
      setPhone(profile.phone || "")
      setBio(profile.bio || "")
      setLocation(profile.location || "")
      setWebsite(profile.website || "")
      setBirthDate(profile.birthDate || "")
      setAvatar(profile.avatar || "")
      setTimezone(profile.timezone || "Asia/Ho_Chi_Minh")
    } else if (user) {
      setName(user.name)
      setEmail(user.email)
    }

    // Load settings
    const savedSettings = localStorage.getItem(`settings_${userId}`)
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)

      // Notifications
      setEmailNotifications(settings.emailNotifications ?? true)
      setPushNotifications(settings.pushNotifications ?? true)
      setWeeklyReport(settings.weeklyReport ?? false)
      setMonthlyReport(settings.monthlyReport ?? true)
      setExpenseAlerts(settings.expenseAlerts ?? true)
      setMarketingEmails(settings.marketingEmails ?? false)
      setSoundEnabled(settings.soundEnabled ?? true)
      setNotificationVolume(settings.notificationVolume || [70])

      // Appearance
      setTheme(settings.theme || "light")
      setColorScheme(settings.colorScheme || "peach")
      setFontSize(settings.fontSize || [16])
      setCompactMode(settings.compactMode ?? false)
      setAnimationsEnabled(settings.animationsEnabled ?? true)
      setLanguage(settings.language || "vi")
      setCurrency(settings.currency || "VND")

      // Privacy & Security
      setProfileVisibility(settings.profileVisibility || "private")
      setDataSharing(settings.dataSharing ?? false)
      setAnalyticsEnabled(settings.analyticsEnabled ?? true)
      setTwoFactorEnabled(settings.twoFactorEnabled ?? false)

      // Backup
      setAutoBackup(settings.autoBackup ?? true)
      setBackupFrequency(settings.backupFrequency || "weekly")
      setLastBackup(settings.lastBackup ? new Date(settings.lastBackup) : null)

      // Account
      setAccountStatus(settings.accountStatus || "active")
    }

    // Apply theme immediately
    applyTheme(savedSettings ? JSON.parse(savedSettings).theme || "light" : "light")
    applyFontSize(savedSettings ? JSON.parse(savedSettings).fontSize?.[0] || 16 : 16)
  }

  const loadLoginHistory = (userId: string) => {
    const history = getLoginHistory(userId)
    setLoginHistory(history)

    // Mock active sessions
    setActiveSessions([
      {
        id: "current",
        device: "Chrome on Windows",
        location: "Ho Chi Minh City, Vietnam",
        lastActive: new Date(),
        current: true,
      },
      {
        id: "mobile",
        device: "Safari on iPhone",
        location: "Ho Chi Minh City, Vietnam",
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        current: false,
      },
    ])
  }

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement

    if (newTheme === "dark") {
      root.classList.add("dark")
    } else if (newTheme === "light") {
      root.classList.remove("dark")
    } else if (newTheme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}px`
  }

  const applyColorScheme = (scheme: string) => {
    const root = document.documentElement
    root.setAttribute("data-color-scheme", scheme)

    // Update CSS variables based on color scheme
    const schemes = {
      peach: {
        primary: "#FFD6BA",
        secondary: "#FFDCDC",
        accent: "#FFE8CD",
      },
      blue: {
        primary: "#3B82F6",
        secondary: "#60A5FA",
        accent: "#93C5FD",
      },
      green: {
        primary: "#10B981",
        secondary: "#34D399",
        accent: "#6EE7B7",
      },
      purple: {
        primary: "#8B5CF6",
        secondary: "#A78BFA",
        accent: "#C4B5FD",
      },
    }

    const colors = schemes[scheme as keyof typeof schemes] || schemes.peach
    root.style.setProperty("--color-primary", colors.primary)
    root.style.setProperty("--color-secondary", colors.secondary)
    root.style.setProperty("--color-accent", colors.accent)
  }

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/)) strength += 25
    if (password.match(/[A-Z]/)) strength += 25
    if (password.match(/[0-9]/)) strength += 25
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25
    return Math.min(strength, 100)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước file không được vượt quá 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatar(result)

        // Auto-save avatar
        if (user) {
          const profileData = JSON.parse(localStorage.getItem(`profile_${user.id}`) || "{}")
          profileData.avatar = result
          localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData))
          setMessage("Avatar đã được cập nhật!")
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatar("")
    if (user) {
      const profileData = JSON.parse(localStorage.getItem(`profile_${user.id}`) || "{}")
      profileData.avatar = ""
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData))
      setMessage("Avatar đã được xóa!")
    }
  }

  const handleGeneratePassword = () => {
    const newPass = generateStrongPassword()
    setNewPassword(newPass)
    setPasswordStrength(calculatePasswordStrength(newPass))
    setMessage("Mật khẩu mạnh đã được tạo!")
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
        timezone,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData))
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
      setPasswordStrength(0)
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
        // Notifications
        emailNotifications,
        pushNotifications,
        weeklyReport,
        monthlyReport,
        expenseAlerts,
        marketingEmails,
        soundEnabled,
        notificationVolume,

        // Appearance
        theme,
        colorScheme,
        fontSize,
        compactMode,
        animationsEnabled,
        language,
        currency,

        // Privacy & Security
        profileVisibility,
        dataSharing,
        analyticsEnabled,
        twoFactorEnabled,

        // Backup
        autoBackup,
        backupFrequency,
        lastBackup: lastBackup?.toISOString(),

        // Account
        accountStatus,

        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings))

      // Apply settings immediately
      applyTheme(theme)
      applyFontSize(fontSize[0])
      applyColorScheme(colorScheme)

      setMessage("Cài đặt đã được lưu và áp dụng thành công!")
    } catch (err) {
      setError("Có lỗi xảy ra khi lưu cài đặt")
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    if (!user) return

    try {
      const data = await exportUserData(user.id)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `vicuatui-data-${user.id}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessage("Dữ liệu đã được xuất thành công!")
    } catch (err) {
      setError("Có lỗi xảy ra khi xuất dữ liệu")
    }
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        await importUserData(user.id, data)
        setMessage("Dữ liệu đã được nhập thành công!")
        loadUserSettings(user.id)
      } catch (err) {
        setError("File không hợp lệ hoặc có lỗi khi nhập dữ liệu")
      }
    }
    reader.readAsText(file)
  }

  const handleBackupNow = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const data = await exportUserData(user.id)
      localStorage.setItem(`backup_${user.id}_${Date.now()}`, JSON.stringify(data))
      setLastBackup(new Date())

      // Update settings
      const settings = JSON.parse(localStorage.getItem(`settings_${user.id}`) || "{}")
      settings.lastBackup = new Date().toISOString()
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings))

      setMessage("Sao lưu dữ liệu thành công!")
    } catch (err) {
      setError("Có lỗi xảy ra khi sao lưu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetSettings = () => {
    if (!user) return

    const confirmed = window.confirm("Bạn có chắc chắn muốn khôi phục tất cả cài đặt về mặc định?")
    if (confirmed) {
      localStorage.removeItem(`settings_${user.id}`)
      loadUserSettings(user.id)
      setMessage("Đã khôi phục cài đặt về mặc định!")
    }
  }

  const handleDeactivateAccount = async () => {
    if (!user) return

    const confirmed = window.confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản? Bạn có thể kích hoạt lại sau.")
    if (confirmed) {
      try {
        await deactivateAccount(user.id)
        setAccountStatus("deactivated")
        setMessage("Tài khoản đã được vô hiệu hóa!")
      } catch (err) {
        setError("Có lỗi xảy ra khi vô hiệu hóa tài khoản")
      }
    }
  }

  const handleReactivateAccount = async () => {
    if (!user) return

    try {
      await reactivateAccount(user.id)
      setAccountStatus("active")
      setMessage("Tài khoản đã được kích hoạt lại!")
    } catch (err) {
      setError("Có lỗi xảy ra khi kích hoạt lại tài khoản")
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    if (deleteConfirmation !== "XÓA TÀI KHOẢN") {
      setError("Vui lòng nhập chính xác 'XÓA TÀI KHOẢN' để xác nhận")
      return
    }

    const confirmed = window.confirm("CẢNH BÁO: Hành động này không thể hoàn tác! Tất cả dữ liệu sẽ bị xóa vĩnh viễn.")
    if (confirmed) {
      try {
        await deleteAccount(user.id)
        router.push("/")
      } catch (err) {
        setError("Có lỗi xảy ra khi xóa tài khoản")
      }
    }
  }

  const handleClearLoginHistory = () => {
    if (!user) return

    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa lịch sử đăng nhập?")
    if (confirmed) {
      clearLoginHistory(user.id)
      setLoginHistory([])
      setMessage("Lịch sử đăng nhập đã được xóa!")
    }
  }

  const handleLogoutSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId))
    setMessage("Đã đăng xuất phiên làm việc!")
  }

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    if (!twoFactorEnabled) {
      setMessage("Xác thực 2 bước đã được bật! (Mô phỏng)")
    } else {
      setMessage("Xác thực 2 bước đã được tắt!")
    }
  }

  // Real-time password strength calculation
  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword))
    } else {
      setPasswordStrength(0)
    }
  }, [newPassword])

  // Real-time theme application
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Real-time font size application
  useEffect(() => {
    applyFontSize(fontSize[0])
  }, [fontSize])

  // Real-time color scheme application
  useEffect(() => {
    applyColorScheme(colorScheme)
  }, [colorScheme])

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

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 25) return "bg-red-500"
    if (strength < 50) return "bg-orange-500"
    if (strength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return "Yếu"
    if (strength < 50) return "Trung bình"
    if (strength < 75) return "Mạnh"
    return "Rất mạnh"
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
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
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Giao diện</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Riêng tư</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Sao lưu</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid gap-6">
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
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
                      <AvatarFallback className="bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] text-black text-2xl">
                        {name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA] text-black rounded-lg hover:from-[#FFE8CD] hover:to-[#FFF2EB] transition-colors">
                            <Camera className="h-4 w-4" />
                            Thay đổi ảnh
                          </div>
                        </Label>
                        {avatar && (
                          <Button variant="outline" size="sm" onClick={handleRemoveAvatar}>
                            <X className="h-4 w-4 mr-2" />
                            Xóa ảnh
                          </Button>
                        )}
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500">JPG, PNG tối đa 5MB</p>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div>
                      <Label htmlFor="timezone" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Múi giờ
                      </Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</SelectItem>
                          <SelectItem value="Asia/Bangkok">Bangkok (GMT+7)</SelectItem>
                          <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                          <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
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
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Password Change */}
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
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="newPassword">Mật khẩu mới *</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleGeneratePassword}>
                        <Zap className="h-4 w-4 mr-2" />
                        Tạo mật khẩu mạnh
                      </Button>
                    </div>
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
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength)}`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{getPasswordStrengthText(passwordStrength)}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Mật khẩu mạnh nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                        </p>
                      </div>
                    )}
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

              {/* Two-Factor Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Xác thực hai bước (2FA)
                  </CardTitle>
                  <CardDescription>Tăng cường bảo mật với xác thực hai bước</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Xác thực hai bước</Label>
                      <p className="text-sm text-gray-500">
                        {twoFactorEnabled
                          ? "Đã bật - Tài khoản được bảo vệ tốt hơn"
                          : "Chưa bật - Khuyến nghị bật để bảo mật"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                        {twoFactorEnabled ? "Đã bật" : "Chưa bật"}
                      </Badge>
                      <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
                    </div>
                  </div>
                  {twoFactorEnabled && (
                    <Alert>
                      <Key className="h-4 w-4" />
                      <AlertDescription>
                        Xác thực hai bước đã được bật. Bạn sẽ cần nhập mã từ ứng dụng xác thực khi đăng nhập.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Login History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Lịch sử đăng nhập
                  </CardTitle>
                  <CardDescription>Xem các lần đăng nhập gần đây</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {loginHistory.length > 0 ? (
                      loginHistory.slice(0, 5).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{entry.device || "Thiết bị không xác định"}</p>
                            <p className="text-sm text-gray-500">
                              {entry.location || "Vị trí không xác định"} •{" "}
                              {new Date(entry.timestamp).toLocaleString("vi-VN")}
                            </p>
                          </div>
                          <Badge variant={entry.success ? "default" : "destructive"}>
                            {entry.success ? "Thành công" : "Thất bại"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Chưa có lịch sử đăng nhập</p>
                    )}
                  </div>
                  {loginHistory.length > 0 && (
                    <Button variant="outline" onClick={handleClearLoginHistory}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa lịch sử
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Phiên đăng nhập đang hoạt động
                  </CardTitle>
                  <CardDescription>Quản lý các thiết bị đang đăng nhập</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {activeSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{session.device}</p>
                            {session.current && <Badge variant="default">Hiện tại</Badge>}
                          </div>
                          <p className="text-sm text-gray-500">
                            {session.location} • Hoạt động {session.lastActive.toLocaleString("vi-VN")}
                          </p>
                        </div>
                        {!session.current && (
                          <Button variant="outline" size="sm" onClick={() => handleLogoutSession(session.id)}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Đăng xuất
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
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
                      <p className="text-sm text-gray-500">Nhận thông báo quan trọng qua email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Thông báo đẩy</Label>
                      <p className="text-sm text-gray-500">Nhận thông báo trên trình duyệt</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Cảnh báo chi tiêu</Label>
                      <p className="text-sm text-gray-500">Thông báo khi vượt ngân sách</p>
                    </div>
                    <Switch checked={expenseAlerts} onCheckedChange={setExpenseAlerts} />
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

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Email marketing</Label>
                      <p className="text-sm text-gray-500">Nhận tin tức và ưu đãi</p>
                    </div>
                    <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Âm thanh thông báo</Label>
                        <p className="text-sm text-gray-500">Phát âm thanh khi có thông báo</p>
                      </div>
                      <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>

                    {soundEnabled && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <VolumeX className="h-4 w-4" />
                          <Slider
                            value={notificationVolume}
                            onValueChange={setNotificationVolume}
                            max={100}
                            step={10}
                            className="flex-1"
                          />
                          <Volume2 className="h-4 w-4" />
                          <span className="text-sm font-medium w-8">{notificationVolume[0]}%</span>
                        </div>
                      </div>
                    )}
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

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Tùy chỉnh giao diện
                </CardTitle>
                <CardDescription>Cá nhân hóa trải nghiệm sử dụng ứng dụng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="theme">Chế độ hiển thị</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        onClick={() => setTheme("light")}
                        className="flex flex-col items-center gap-2 h-auto py-3"
                      >
                        <Sun className="h-4 w-4" />
                        <span className="text-xs">Sáng</span>
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        onClick={() => setTheme("dark")}
                        className="flex flex-col items-center gap-2 h-auto py-3"
                      >
                        <Moon className="h-4 w-4" />
                        <span className="text-xs">Tối</span>
                      </Button>
                      <Button
                        variant={theme === "auto" ? "default" : "outline"}
                        onClick={() => setTheme("auto")}
                        className="flex flex-col items-center gap-2 h-auto py-3"
                      >
                        <Monitor className="h-4 w-4" />
                        <span className="text-xs">Tự động</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="colorScheme">Bảng màu</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={colorScheme === "peach" ? "default" : "outline"}
                        onClick={() => setColorScheme("peach")}
                        className="flex items-center gap-2 justify-start"
                      >
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#FFDCDC] to-[#FFD6BA]" />
                        Đào
                      </Button>
                      <Button
                        variant={colorScheme === "blue" ? "default" : "outline"}
                        onClick={() => setColorScheme("blue")}
                        className="flex items-center gap-2 justify-start"
                      >
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
                        Xanh dương
                      </Button>
                      <Button
                        variant={colorScheme === "green" ? "default" : "outline"}
                        onClick={() => setColorScheme("green")}
                        className="flex items-center gap-2 justify-start"
                      >
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-600" />
                        Xanh lá
                      </Button>
                      <Button
                        variant={colorScheme === "purple" ? "default" : "outline"}
                        onClick={() => setColorScheme("purple")}
                        className="flex items-center gap-2 justify-start"
                      >
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
                        Tím
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Kích thước chữ: {fontSize[0]}px</Label>
                  <Slider value={fontSize} onValueChange={setFontSize} min={12} max={20} step={1} className="w-full" />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Nhỏ (12px)</span>
                    <span>Trung bình (16px)</span>
                    <span>Lớn (20px)</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Chế độ thu gọn</Label>
                      <p className="text-sm text-gray-500">Giảm khoảng cách giữa các phần tử</p>
                    </div>
                    <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Hiệu ứng động</Label>
                      <p className="text-sm text-gray-500">Bật/tắt các hiệu ứng chuyển động</p>
                    </div>
                    <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Ngôn ngữ</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                        <SelectItem value="ko">🇰🇷 한국어</SelectItem>
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
                        <SelectItem value="VND">🇻🇳 VND (₫)</SelectItem>
                        <SelectItem value="USD">🇺🇸 USD ($)</SelectItem>
                        <SelectItem value="EUR">🇪🇺 EUR (€)</SelectItem>
                        <SelectItem value="JPY">🇯🇵 JPY (¥)</SelectItem>
                        <SelectItem value="KRW">🇰🇷 KRW (₩)</SelectItem>
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
                  {isSaving ? "Đang áp dụng..." : "Áp dụng thay đổi"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Quyền riêng tư & Bảo mật
                  </CardTitle>
                  <CardDescription>Kiểm soát cách dữ liệu của bạn được sử dụng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profileVisibility">Hiển thị hồ sơ</Label>
                      <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                        <SelectTrigger className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Công khai</SelectItem>
                          <SelectItem value="friends">Chỉ bạn bè</SelectItem>
                          <SelectItem value="private">Riêng tư</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Chia sẻ dữ liệu</Label>
                        <p className="text-sm text-gray-500">Cho phép chia sẻ dữ liệu ẩn danh để cải thiện dịch vụ</p>
                      </div>
                      <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Phân tích sử dụng</Label>
                        <p className="text-sm text-gray-500">Thu thập dữ liệu sử dụng để cải thiện trải nghiệm</p>
                      </div>
                      <Switch checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Xuất dữ liệu cá nhân
                  </CardTitle>
                  <CardDescription>Tải về bản sao dữ liệu của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Bạn có thể tải về tất cả dữ liệu cá nhân bao gồm hồ sơ, chi tiêu, cài đặt và lịch sử hoạt động.
                  </p>
                  <Button onClick={handleExportData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Xuất dữ liệu
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Backup Tab */}
          <TabsContent value="backup">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Sao lưu & Khôi phục
                  </CardTitle>
                  <CardDescription>Quản lý sao lưu dữ liệu của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Tự động sao lưu</Label>
                        <p className="text-sm text-gray-500">Tự động sao lưu dữ liệu theo lịch trình</p>
                      </div>
                      <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                    </div>

                    {autoBackup && (
                      <div>
                        <Label htmlFor="backupFrequency">Tần suất sao lưu</Label>
                        <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                          <SelectTrigger className="border-gray-300 focus:border-[#FFD6BA] focus:ring-[#FFD6BA]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Hàng ngày</SelectItem>
                            <SelectItem value="weekly">Hàng tuần</SelectItem>
                            <SelectItem value="monthly">Hàng tháng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Lần sao lưu cuối:</span>
                        <span className="text-sm text-gray-600">
                          {lastBackup ? lastBackup.toLocaleString("vi-VN") : "Chưa có"}
                        </span>
                      </div>
                      <Button onClick={handleBackupNow} disabled={isSaving} size="sm">
                        <Database className="h-4 w-4 mr-2" />
                        {isSaving ? "Đang sao lưu..." : "Sao lưu ngay"}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Nhập dữ liệu</Label>
                      <p className="text-sm text-gray-500 mb-2">Khôi phục dữ liệu từ file sao lưu</p>
                      <Label htmlFor="import-data" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-fit">
                          <Upload className="h-4 w-4" />
                          Chọn file sao lưu
                        </div>
                      </Label>
                      <input
                        id="import-data"
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium">Khôi phục cài đặt mặc định</Label>
                      <p className="text-sm text-gray-500 mb-2">Đặt lại tất cả cài đặt về trạng thái ban đầu</p>
                      <Button onClick={handleResetSettings} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Khôi phục mặc định
                      </Button>
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

              {/* Account Management */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Quản lý tài khoản
                  </CardTitle>
                  <CardDescription>Các hành động quan trọng với tài khoản của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Trạng thái tài khoản:</span>
                        <Badge variant={accountStatus === "active" ? "default" : "secondary"}>
                          {accountStatus === "active" ? "Đang hoạt động" : "Đã vô hiệu hóa"}
                        </Badge>
                      </div>
                      {accountStatus === "active" ? (
                        <Button onClick={handleDeactivateAccount} variant="outline" size="sm">
                          <PowerOff className="h-4 w-4 mr-2" />
                          Vô hiệu hóa tài khoản
                        </Button>
                      ) : (
                        <Button onClick={handleReactivateAccount} size="sm">
                          <Power className="h-4 w-4 mr-2" />
                          Kích hoạt lại tài khoản
                        </Button>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <Label className="text-base font-medium text-red-600">Xóa tài khoản vĩnh viễn</Label>
                        <p className="text-sm text-gray-600 mb-3">
                          Hành động này không thể hoàn tác. Tất cả dữ liệu chi tiêu, thống kê và cài đặt sẽ bị xóa vĩnh
                          viễn.
                        </p>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="deleteConfirmation">Nhập "XÓA TÀI KHOẢN" để xác nhận:</Label>
                            <Input
                              id="deleteConfirmation"
                              value={deleteConfirmation}
                              onChange={(e) => setDeleteConfirmation(e.target.value)}
                              placeholder="XÓA TÀI KHOẢN"
                              className="border-red-300 focus:border-red-500 focus:ring-red-500"
                            />
                          </div>
                          <Button
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmation !== "XÓA TÀI KHOẢN"}
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa tài khoản vĩnh viễn
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
