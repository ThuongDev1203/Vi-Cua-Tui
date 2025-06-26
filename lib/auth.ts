"use client"

import type { User } from "./types"

// Simple encryption/decryption functions (for demo purposes)
const encryptPassword = (password: string): string => {
  return btoa(password.split("").reverse().join(""))
}

const decryptPassword = (encryptedPassword: string): string => {
  return atob(encryptedPassword).split("").reverse().join("")
}

const encryptEmail = (email: string): string => {
  const [username, domain] = email.split("@")
  const encryptedUsername = username.substring(0, 2) + "*".repeat(username.length - 2)
  return `${encryptedUsername}@${domain}`
}

// Generate verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Simulate email sending
const sendVerificationEmail = async (email: string, code: string): Promise<void> => {
  console.log(`📧 Gửi mã xác nhận đến ${email}: ${code}`)
  // In real app, this would send actual email
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

export const mockUsers: User[] = [
  {
    id: "admin",
    email: "admin@vicuatui.com",
    name: "Quản trị viên",
    role: "admin",
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: "1",
    email: "demo@example.com",
    name: "Người dùng Demo",
    role: "user",
    isVerified: true,
    createdAt: new Date(),
  },
]

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("currentUser")
  return userStr ? JSON.parse(userStr) : null
}

export const setCurrentUser = (user: User | null) => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export const getAllUsers = (): User[] => {
  if (typeof window === "undefined") return mockUsers
  const usersStr = localStorage.getItem("allUsers")
  return usersStr ? JSON.parse(usersStr) : mockUsers
}

export const saveAllUsers = (users: User[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("allUsers", JSON.stringify(users))
}

export const updateUserProfile = async (userId: string, updates: { name?: string; email?: string }): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Update in registered users
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const userIndex = registeredUsers.findIndex((u: any) => u.id === userId)

  if (userIndex !== -1) {
    if (updates.name) registeredUsers[userIndex].name = updates.name
    if (updates.email) registeredUsers[userIndex].email = updates.email
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
  }

  // Update in all users
  const allUsers = getAllUsers()
  const allUserIndex = allUsers.findIndex((u) => u.id === userId)

  if (allUserIndex !== -1) {
    if (updates.name) allUsers[allUserIndex].name = updates.name
    if (updates.email) allUsers[allUserIndex].email = updates.email
    saveAllUsers(allUsers)
  }
}

export const changePassword = async (email: string, currentPassword: string, newPassword: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check demo user
  if (email === "demo@example.com") {
    if (currentPassword !== "demo123") {
      throw new Error("Mật khẩu hiện tại không đúng")
    }
    // For demo user, we don't actually change the password
    return
  }

  // Check registered users
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const userIndex = registeredUsers.findIndex((u: any) => u.email === email)

  if (userIndex === -1) {
    throw new Error("Không tìm thấy tài khoản")
  }

  const user = registeredUsers[userIndex]
  if (decryptPassword(user.password) !== currentPassword) {
    throw new Error("Mật khẩu hiện tại không đúng")
  }

  // Update password
  registeredUsers[userIndex].password = encryptPassword(newPassword)
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))
}

export const deleteAccount = async (userId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Remove from registered users
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const filteredUsers = registeredUsers.filter((u: any) => u.id !== userId)
  localStorage.setItem("registeredUsers", JSON.stringify(filteredUsers))

  // Remove from all users
  const allUsers = getAllUsers()
  const filteredAllUsers = allUsers.filter((u) => u.id !== userId)
  saveAllUsers(filteredAllUsers)

  // Remove user data
  localStorage.removeItem(`profile_${userId}`)
  localStorage.removeItem(`settings_${userId}`)
  localStorage.removeItem(`expenses_${userId}`)
  localStorage.removeItem("currentUser")
}

export const login = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Admin login
  if (email === "admin@vicuatui.com" && password === "admin123") {
    const adminUser = mockUsers[0]
    setCurrentUser(adminUser)
    return adminUser
  }

  // Demo user login
  if (email === "demo@example.com" && password === "demo123") {
    const demoUser = mockUsers[1]
    setCurrentUser(demoUser)
    return demoUser
  }

  // Check registered users
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const registeredUser = registeredUsers.find((u: any) => u.email === email && decryptPassword(u.password) === password)

  if (registeredUser) {
    if (!registeredUser.isVerified) {
      throw new Error("Tài khoản chưa được xác nhận email. Vui lòng kiểm tra email và xác nhận tài khoản.")
    }

    const userToLogin: User = {
      id: registeredUser.id,
      email: registeredUser.email,
      name: registeredUser.name,
      role: "user",
      isVerified: registeredUser.isVerified,
      createdAt: new Date(registeredUser.createdAt),
    }
    setCurrentUser(userToLogin)
    return userToLogin
  }

  throw new Error("Email hoặc mật khẩu không đúng")
}

export const register = async (
  email: string,
  password: string,
  name: string,
): Promise<{ needsVerification: boolean; message: string }> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Prevent admin email registration
  if (email === "admin@vicuatui.com") {
    throw new Error("Email này không thể đăng ký")
  }

  // Check rate limiting (max 3 unverified accounts per email domain per day)
  const emailDomain = email.split("@")[1]
  const today = new Date().toDateString()
  const rateLimitKey = `rateLimit_${emailDomain}_${today}`
  const currentCount = Number.parseInt(localStorage.getItem(rateLimitKey) || "0")

  if (currentCount >= 3) {
    throw new Error("Đã vượt quá giới hạn đăng ký cho domain email này trong ngày. Vui lòng thử lại vào ngày mai.")
  }

  const allUsers = getAllUsers()
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const existingUser = registeredUsers.find((u: any) => u.email === email)

  if (existingUser) {
    if (!existingUser.isVerified) {
      // Resend verification code
      const verificationCode = generateVerificationCode()
      const pendingVerifications = JSON.parse(localStorage.getItem("pendingVerifications") || "{}")
      pendingVerifications[email] = {
        code: verificationCode,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        attempts: 0,
      }
      localStorage.setItem("pendingVerifications", JSON.stringify(pendingVerifications))

      await sendVerificationEmail(email, verificationCode)
      return {
        needsVerification: true,
        message: "Tài khoản đã tồn tại nhưng chưa xác nhận. Mã xác nhận mới đã được gửi đến email của bạn.",
      }
    }
    throw new Error("Email đã được sử dụng và đã xác nhận")
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    name,
    role: "user",
    password: encryptPassword(password),
    isVerified: false,
    createdAt: new Date().toISOString(),
  }

  // Save unverified user
  registeredUsers.push(newUser)
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

  // Generate and store verification code
  const verificationCode = generateVerificationCode()
  const pendingVerifications = JSON.parse(localStorage.getItem("pendingVerifications") || "{}")
  pendingVerifications[email] = {
    code: verificationCode,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  }
  localStorage.setItem("pendingVerifications", JSON.stringify(pendingVerifications))

  // Update rate limit
  localStorage.setItem(rateLimitKey, (currentCount + 1).toString())

  // Send verification email
  await sendVerificationEmail(email, verificationCode)

  return {
    needsVerification: true,
    message: `Mã xác nhận đã được gửi đến ${email}. Vui lòng kiểm tra email và nhập mã xác nhận.`,
  }
}

export const verifyEmail = async (email: string, code: string): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const pendingVerifications = JSON.parse(localStorage.getItem("pendingVerifications") || "{}")
  const verification = pendingVerifications[email]

  if (!verification) {
    throw new Error("Không tìm thấy mã xác nhận cho email này")
  }

  if (Date.now() > verification.expiresAt) {
    delete pendingVerifications[email]
    localStorage.setItem("pendingVerifications", JSON.stringify(pendingVerifications))
    throw new Error("Mã xác nhận đã hết hạn. Vui lòng đăng ký lại.")
  }

  if (verification.attempts >= 3) {
    delete pendingVerifications[email]
    localStorage.setItem("pendingVerifications", JSON.stringify(pendingVerifications))
    throw new Error("Đã vượt quá số lần thử. Vui lòng đăng ký lại.")
  }

  if (verification.code !== code) {
    verification.attempts++
    localStorage.setItem("pendingVerifications", JSON.stringify(pendingVerifications))
    throw new Error(`Mã xác nhận không đúng. Còn ${3 - verification.attempts} lần thử.`)
  }

  // Verify user
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const userIndex = registeredUsers.findIndex((u: any) => u.email === email)

  if (userIndex === -1) {
    throw new Error("Không tìm thấy tài khoản")
  }

  registeredUsers[userIndex].isVerified = true
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

  // Clean up verification
  delete pendingVerifications[email]
  localStorage.setItem("pendingVerifications", JSON.stringify(pendingVerifications))

  // Add to all users
  const allUsers = getAllUsers()
  const verifiedUser: User = {
    id: registeredUsers[userIndex].id,
    email: registeredUsers[userIndex].email,
    name: registeredUsers[userIndex].name,
    role: "user",
    isVerified: true,
    createdAt: new Date(registeredUsers[userIndex].createdAt),
  }

  allUsers.push(verifiedUser)
  saveAllUsers(allUsers)

  setCurrentUser(verifiedUser)
  return verifiedUser
}

export const resendVerificationCode = async (email: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const pendingVerifications = JSON.parse(localStorage.getItem("pendingVerifications") || "{}")

  const verificationCode = generateVerificationCode()
  pendingVerifications[email] = {
    code: verificationCode,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
  }
  localStorage.setItem("pendingVerifications", JSON.stringify(pendingVerifications))

  await sendVerificationEmail(email, verificationCode)
}

export const resetPassword = async (email: string): Promise<string> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const userIndex = registeredUsers.findIndex((u: any) => u.email === email && u.isVerified)

  if (userIndex === -1 && email !== "demo@example.com") {
    throw new Error("Email không tồn tại hoặc chưa được xác nhận trong hệ thống")
  }

  // Generate new password
  const newPassword = Math.random().toString(36).slice(-8)

  if (email === "demo@example.com") {
    // For demo user, just return the new password
    return newPassword
  }

  // Update password for registered user
  registeredUsers[userIndex].password = encryptPassword(newPassword)
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

  return newPassword
}

export const logout = () => {
  setCurrentUser(null)
}

export const getUserStats = () => {
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const verifiedUsers = registeredUsers.filter((u: any) => u.isVerified)
  const unverifiedUsers = registeredUsers.filter((u: any) => !u.isVerified)

  const today = new Date()
  const thisMonth = today.getMonth()
  const thisYear = today.getFullYear()

  const thisMonthUsers = verifiedUsers.filter((user: any) => {
    const userDate = new Date(user.createdAt)
    return userDate.getMonth() === thisMonth && userDate.getFullYear() === thisYear
  })

  return {
    totalUsers: verifiedUsers.length + 1, // +1 for demo user (not admin)
    newUsersThisMonth: thisMonthUsers.length,
    unverifiedUsers: unverifiedUsers.length,
    allUsers: registeredUsers,
    verifiedUsers,
    unverifiedUsers,
  }
}

export const getAllUsersWithCredentials = () => {
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

  // Add demo user
  const allUsersWithCredentials = [
    {
      id: "1",
      name: "Người dùng Demo",
      email: "demo@example.com",
      encryptedEmail: encryptEmail("demo@example.com"),
      password: "demo123", // Demo user password is not encrypted for simplicity
      encryptedPassword: encryptPassword("demo123"),
      role: "user",
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    ...registeredUsers.map((user: any) => ({
      ...user,
      encryptedEmail: encryptEmail(user.email),
      decryptedPassword: decryptPassword(user.password),
    })),
  ]

  return allUsersWithCredentials
}

export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin"
}

export const isUser = (user: User | null): boolean => {
  return user?.role === "user"
}
