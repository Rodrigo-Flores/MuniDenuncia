"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isInitializing: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem("munidenuncia_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsInitializing(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("munidenuncia_users") || "[]")
    const existingUser = users.find((u: any) => u.email === email && u.password === password)

    if (existingUser) {
      const userData = { id: existingUser.id, email: existingUser.email, name: existingUser.name }
      setUser(userData)
      localStorage.setItem("munidenuncia_user", JSON.stringify(userData))
      localStorage.setItem("munidenuncia_token", "mock-jwt-token")
      return true
    }

    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("munidenuncia_users") || "[]")
    const existingUser = users.find((u: any) => u.email === email)

    if (existingUser) {
      return false
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    }

    users.push(newUser)
    localStorage.setItem("munidenuncia_users", JSON.stringify(users))

    const userData = { id: newUser.id, email: newUser.email, name: newUser.name }
    setUser(userData)
    localStorage.setItem("munidenuncia_user", JSON.stringify(userData))
    localStorage.setItem("munidenuncia_token", "mock-jwt-token")

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("munidenuncia_user")
    localStorage.removeItem("munidenuncia_token")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isInitializing }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
