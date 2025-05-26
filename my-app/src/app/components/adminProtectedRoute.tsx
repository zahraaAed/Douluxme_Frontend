"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "../context/authContext"

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User is not logged in, save current path and redirect to login
        if (pathname !== "/login") {
          sessionStorage.setItem("redirectUrl", pathname)
        }
        router.push("/login")
      } else if (user.role !== "admin") {
        // User is logged in but not an admin, redirect to home
        router.push("/")
      }
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A03321]"></div>
        <p className="ml-2">Loading...</p>
      </div>
    )
  }

  // Only render children if user is admin
  if (user?.role === "admin") {
    return <>{children}</>
  }

  // Return null while redirecting
  return null
}
