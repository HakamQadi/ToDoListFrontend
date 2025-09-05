"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getStoredUser, clearStoredUser } from "../utils/storage"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    clearStoredUser()
  }

  const isAuthenticated = !!user?.token

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
