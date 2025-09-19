"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { api, type User } from "@/lib/api"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  register: (userData: {
    username: string
    email: string
    password: string
    first_name?: string
    last_name?: string
  }) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = api.getCurrentUser()
    if (currentUser && api.isAuthenticated()) {
      setUser(currentUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const { user } = await api.login(username, password)
      setUser(user)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: {
    username: string
    email: string
    password: string
    first_name?: string
    last_name?: string
  }) => {
    try {
      const { user } = await api.register(userData)
      setUser(user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
