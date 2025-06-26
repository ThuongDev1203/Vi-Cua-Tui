"use client"

import type { User } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Người dùng Demo",
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

  const allUsers = getAllUsers()
  const user = allUsers.find((u) => u.email === email)

  if (user && email === "demo@example.com" && password === "demo123") {
    setCurrentUser(user)
    return user
  }

  // Check if user exists in registered users
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password)

  if (registeredUser) {
    const userToLogin: User = {
      id: registeredUser.id,
      email: registeredUser.email,
      name: registeredUser.name,
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

  const allUsers = getAllUsers()
  const existingUser = allUsers.find((u) => u.email === email)

  if (existingUser) {
    throw new Error("Email đã được sử dụng")
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
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
    totalUsers: registeredUsers.length + 1, // +1 for demo user
    newUsersThisMonth: thisMonthUsers.length,
    allUsers: registeredUsers,
  }
}
