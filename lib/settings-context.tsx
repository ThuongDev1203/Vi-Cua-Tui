"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getCurrentUser } from "./auth"

interface UserSettings {
  // Profile
  avatar: string
  name: string
  email: string
  phone: string
  bio: string
  location: string
  website: string
  birthDate: string
  timezone: string

  // Appearance
  theme: string
  colorScheme: string
  fontSize: number[]
  compactMode: boolean
  animationsEnabled: boolean
  language: string
  currency: string

  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyReport: boolean
  monthlyReport: boolean
  expenseAlerts: boolean
  marketingEmails: boolean
  soundEnabled: boolean
  notificationVolume: number[]

  // Privacy
  profileVisibility: string
  dataSharing: boolean
  analyticsEnabled: boolean
  twoFactorEnabled: boolean

  // Backup
  autoBackup: boolean
  backupFrequency: string
  lastBackup: Date | null
  accountStatus: string
}

interface SettingsContextType {
  settings: UserSettings
  updateSettings: (newSettings: Partial<UserSettings>) => void
  applyTheme: (theme: string) => void
  applyFontSize: (size: number) => void
  applyColorScheme: (scheme: string) => void
  getTranslation: (key: string) => string
  formatCurrency: (amount: number) => string
}

const defaultSettings: UserSettings = {
  // Profile
  avatar: "",
  name: "",
  email: "",
  phone: "",
  bio: "",
  location: "",
  website: "",
  birthDate: "",
  timezone: "Asia/Ho_Chi_Minh",

  // Appearance
  theme: "light",
  colorScheme: "peach",
  fontSize: [16],
  compactMode: false,
  animationsEnabled: true,
  language: "vi",
  currency: "VND",

  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  weeklyReport: false,
  monthlyReport: true,
  expenseAlerts: true,
  marketingEmails: false,
  soundEnabled: true,
  notificationVolume: [70],

  // Privacy
  profileVisibility: "private",
  dataSharing: false,
  analyticsEnabled: true,
  twoFactorEnabled: false,

  // Backup
  autoBackup: true,
  backupFrequency: "weekly",
  lastBackup: null,
  accountStatus: "active",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Translations
const translations = {
  vi: {
    // Navigation
    dashboard: "Dashboard",
    expenses: "Chi tiêu",
    statistics: "Thống kê",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    login: "Đăng nhập",
    register: "Đăng ký",

    // Dashboard
    welcome: "Chào mừng",
    totalExpenses: "Tổng chi tiêu",
    thisMonth: "Tháng này",
    lastMonth: "Tháng trước",
    addExpense: "Thêm chi tiêu",
    recentExpenses: "Chi tiêu gần đây",
    quickStats: "Thống kê nhanh",
    monthlyBudget: "Ngân sách tháng",
    remaining: "Còn lại",
    spent: "Đã chi",

    // Expenses
    addNewExpense: "Thêm chi tiêu mới",
    amount: "Số tiền",
    description: "Mô tả",
    category: "Danh mục",
    date: "Ngày",
    save: "Lưu",
    cancel: "Hủy",
    edit: "Sửa",
    delete: "Xóa",

    // Categories
    food: "Ăn uống",
    transport: "Di chuyển",
    entertainment: "Giải trí",
    shopping: "Mua sắm",
    health: "Sức khỏe",
    education: "Giáo dục",
    bills: "Hóa đơn",
    other: "Khác",

    // Common
    loading: "Đang tải...",
    error: "Lỗi",
    success: "Thành công",
    confirm: "Xác nhận",
    close: "Đóng",
    search: "Tìm kiếm",
    filter: "Lọc",
    export: "Xuất",
    import: "Nhập",
  },
  en: {
    // Navigation
    dashboard: "Dashboard",
    expenses: "Expenses",
    statistics: "Statistics",
    settings: "Settings",
    logout: "Logout",
    login: "Login",
    register: "Register",

    // Dashboard
    welcome: "Welcome",
    totalExpenses: "Total Expenses",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    addExpense: "Add Expense",
    recentExpenses: "Recent Expenses",
    quickStats: "Quick Stats",
    monthlyBudget: "Monthly Budget",
    remaining: "Remaining",
    spent: "Spent",

    // Expenses
    addNewExpense: "Add New Expense",
    amount: "Amount",
    description: "Description",
    category: "Category",
    date: "Date",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",

    // Categories
    food: "Food & Dining",
    transport: "Transportation",
    entertainment: "Entertainment",
    shopping: "Shopping",
    health: "Healthcare",
    education: "Education",
    bills: "Bills & Utilities",
    other: "Other",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    confirm: "Confirm",
    close: "Close",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
  },
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      loadUserSettings(user.id)
    }
  }, [])

  const loadUserSettings = (userId: string) => {
    // Load profile data
    const savedProfile = localStorage.getItem(`profile_${userId}`)
    const savedSettings = localStorage.getItem(`settings_${userId}`)

    let newSettings = { ...defaultSettings }

    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      newSettings = {
        ...newSettings,
        avatar: profile.avatar || "",
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        birthDate: profile.birthDate || "",
        timezone: profile.timezone || "Asia/Ho_Chi_Minh",
      }
    }

    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      newSettings = {
        ...newSettings,
        ...settings,
        fontSize: settings.fontSize || [16],
        notificationVolume: settings.notificationVolume || [70],
        lastBackup: settings.lastBackup ? new Date(settings.lastBackup) : null,
      }
    }

    setSettings(newSettings)

    // Apply settings immediately
    applyTheme(newSettings.theme)
    applyFontSize(newSettings.fontSize[0])
    applyColorScheme(newSettings.colorScheme)
    applyAnimations(newSettings.animationsEnabled)
    applyCompactMode(newSettings.compactMode)
  }

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const user = getCurrentUser()
    if (!user) return

    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    // Save to localStorage
    const profile = {
      avatar: updatedSettings.avatar,
      name: updatedSettings.name,
      email: updatedSettings.email,
      phone: updatedSettings.phone,
      bio: updatedSettings.bio,
      location: updatedSettings.location,
      website: updatedSettings.website,
      birthDate: updatedSettings.birthDate,
      timezone: updatedSettings.timezone,
    }

    const settingsData = {
      theme: updatedSettings.theme,
      colorScheme: updatedSettings.colorScheme,
      fontSize: updatedSettings.fontSize,
      compactMode: updatedSettings.compactMode,
      animationsEnabled: updatedSettings.animationsEnabled,
      language: updatedSettings.language,
      currency: updatedSettings.currency,
      emailNotifications: updatedSettings.emailNotifications,
      pushNotifications: updatedSettings.pushNotifications,
      weeklyReport: updatedSettings.weeklyReport,
      monthlyReport: updatedSettings.monthlyReport,
      expenseAlerts: updatedSettings.expenseAlerts,
      marketingEmails: updatedSettings.marketingEmails,
      soundEnabled: updatedSettings.soundEnabled,
      notificationVolume: updatedSettings.notificationVolume,
      profileVisibility: updatedSettings.profileVisibility,
      dataSharing: updatedSettings.dataSharing,
      analyticsEnabled: updatedSettings.analyticsEnabled,
      twoFactorEnabled: updatedSettings.twoFactorEnabled,
      autoBackup: updatedSettings.autoBackup,
      backupFrequency: updatedSettings.backupFrequency,
      lastBackup: updatedSettings.lastBackup?.toISOString(),
      accountStatus: updatedSettings.accountStatus,
    }

    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile))
    localStorage.setItem(`settings_${user.id}`, JSON.stringify(settingsData))

    // Apply changes immediately
    if (newSettings.theme) applyTheme(newSettings.theme)
    if (newSettings.fontSize) applyFontSize(newSettings.fontSize[0])
    if (newSettings.colorScheme) applyColorScheme(newSettings.colorScheme)
    if (newSettings.animationsEnabled !== undefined) applyAnimations(newSettings.animationsEnabled)
    if (newSettings.compactMode !== undefined) applyCompactMode(newSettings.compactMode)
  }

  const applyTheme = (theme: string) => {
    const root = document.documentElement

    if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme === "light") {
      root.classList.remove("dark")
    } else if (theme === "auto") {
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

    const schemes = {
      peach: {
        primary: "#FFD6BA",
        secondary: "#FFDCDC",
        accent: "#FFE8CD",
        background: "#FFF2EB",
      },
      blue: {
        primary: "#3B82F6",
        secondary: "#60A5FA",
        accent: "#93C5FD",
        background: "#EFF6FF",
      },
      green: {
        primary: "#10B981",
        secondary: "#34D399",
        accent: "#6EE7B7",
        background: "#ECFDF5",
      },
      purple: {
        primary: "#8B5CF6",
        secondary: "#A78BFA",
        accent: "#C4B5FD",
        background: "#F3E8FF",
      },
    }

    const colors = schemes[scheme as keyof typeof schemes] || schemes.peach
    root.style.setProperty("--color-primary", colors.primary)
    root.style.setProperty("--color-secondary", colors.secondary)
    root.style.setProperty("--color-accent", colors.accent)
    root.style.setProperty("--color-background", colors.background)
  }

  const applyAnimations = (enabled: boolean) => {
    const root = document.documentElement
    if (enabled) {
      root.classList.remove("no-animations")
    } else {
      root.classList.add("no-animations")
    }
  }

  const applyCompactMode = (enabled: boolean) => {
    const root = document.documentElement
    if (enabled) {
      root.classList.add("compact-mode")
    } else {
      root.classList.remove("compact-mode")
    }
  }

  const getTranslation = (key: string): string => {
    const lang = settings.language as keyof typeof translations
    const langTranslations = translations[lang] || translations.vi
    return langTranslations[key as keyof typeof langTranslations] || key
  }

  const formatCurrency = (amount: number): string => {
    const currencyFormats = {
      VND: { symbol: "₫", locale: "vi-VN" },
      USD: { symbol: "$", locale: "en-US" },
      EUR: { symbol: "€", locale: "de-DE" },
      JPY: { symbol: "¥", locale: "ja-JP" },
      KRW: { symbol: "₩", locale: "ko-KR" },
    }

    const format = currencyFormats[settings.currency as keyof typeof currencyFormats] || currencyFormats.VND

    if (settings.currency === "VND") {
      return new Intl.NumberFormat(format.locale).format(amount) + format.symbol
    } else {
      return format.symbol + new Intl.NumberFormat(format.locale).format(amount)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        applyTheme,
        applyFontSize,
        applyColorScheme,
        getTranslation,
        formatCurrency,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
