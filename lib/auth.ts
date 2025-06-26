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

export const mockUsers: User[] = [
  {
    id: "admin",
    email: "admin@vicuatui.com",
    name: "Quản trị viên",
    role: "admin",
    createdAt: new Date(),
  },
  {
    id: "1",
    email: "demo@example.com",
    name: "Người dùng Demo",
    role: "user",
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
    const userToLogin: User = {
      id: registeredUser.id,
      email: registeredUser.email,
      name: registeredUser.name,
      role: "user",
      createdAt: new Date(registeredUser.createdAt),
    }
    setCurrentUser(userToLogin)
    return userToLogin
  }

  throw new Error("Email hoặc mật khẩu không đúng")
}

export const register = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Prevent admin email registration
  if (email === "admin@vicuatui.com") {
    throw new Error("Email này không thể đăng ký")
  }

  const allUsers = getAllUsers()
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const existingUser = registeredUsers.find((u: any) => u.email === email)

  if (existingUser) {
    throw new Error("Email đã được sử dụng")
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    role: "user",
    createdAt: new Date(),
  }

  // Save to registered users with encrypted password
  registeredUsers.push({
    ...newUser,
    password: encryptPassword(password),
    createdAt: newUser.createdAt.toISOString(),
  })
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

  // Save to all users
  allUsers.push(newUser)
  saveAllUsers(allUsers)

  setCurrentUser(newUser)
  return newUser
}

export const resetPassword = async (email: string): Promise<string> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const userIndex = registeredUsers.findIndex((u: any) => u.email === email)

  if (userIndex === -1 && email !== "demo@example.com") {
    throw new Error("Email không tồn tại trong hệ thống")
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
  const today = new Date()
  const thisMonth = today.getMonth()
  const thisYear = today.getFullYear()

  const thisMonthUsers = registeredUsers.filter((user: any) => {
    const userDate = new Date(user.createdAt)
    return userDate.getMonth() === thisMonth && userDate.getFullYear() === thisYear
  })

  return {
    totalUsers: registeredUsers.length + 1, // +1 for demo user (not admin)
    newUsersThisMonth: thisMonthUsers.length,
    allUsers: registeredUsers,
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
