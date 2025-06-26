"use client"

import type { User } from "./types"

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
  const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password)

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
  const existingUser = allUsers.find((u) => u.email === email)

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

  // Save to registered users with password
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  registeredUsers.push({
    ...newUser,
    password,
    createdAt: newUser.createdAt.toISOString(),
  })
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

  // Save to all users
  allUsers.push(newUser)
  saveAllUsers(allUsers)

  setCurrentUser(newUser)
  return newUser
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

export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin"
}

export const isUser = (user: User | null): boolean => {
  return user?.role === "user"
}
