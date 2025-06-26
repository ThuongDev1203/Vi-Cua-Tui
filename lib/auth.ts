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

export const login = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === "demo@example.com" && password === "demo123") {
    const user = mockUsers[0]
    setCurrentUser(user)
    return user
  }

  throw new Error("Email hoặc mật khẩu không đúng")
}

export const register = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    createdAt: new Date(),
  }

  mockUsers.push(newUser)
  setCurrentUser(newUser)
  return newUser
}

export const logout = () => {
  setCurrentUser(null)
}
