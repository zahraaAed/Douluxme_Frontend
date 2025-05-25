"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { AxiosError } from "axios"

interface User {
  id: string
  email: string
  role: string
  name?: string
  address?: {
    phone: string
    region: string
    address_direction: string
    building: string
    floor: string
  } | null
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  getMe: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  // Function to fetch user data
  const getMe = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:5000/api/users/me", {
        withCredentials: true,
      })
      setUser(response.data.user)
    } catch (error) {
      console.error("Failed to fetch user data", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password },
        { withCredentials: true },
      )
      const { token, user } = response.data
      console.log("Login response:", response.data)
      console.log("User data:", user)
      console.log("Token:", token)

      // Save token to cookies and session storage
      document.cookie = `token=${token}; path=/;`
      sessionStorage.setItem("token", token)
      sessionStorage.setItem("role", user.role)

      setUser(user) // Set user from login response
      toast.success("You have successfully logged in!")

      // REMOVED THE SETTIMEOUT - Let the Login component handle redirects
      // The Login component will handle the redirect based on the updated user state
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data?.message || err.message || "Unknown error"

        console.error("Login Error:", err)
        toast.error(message)
      } else {
        console.error("Non-Axios error:", err)
        toast.error("An unknown error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        {
          withCredentials: true,
        },
      )

      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("role")
      sessionStorage.removeItem("redirectUrl") // Also clear any saved redirect URL
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch user data on initial load
  useEffect(() => {
    getMe()
  }, [])

  return <UserContext.Provider value={{ user, isLoading, login, logout, getMe }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
