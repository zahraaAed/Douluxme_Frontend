"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "../context/authContext"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setHasCheckedAuth(true)
    }
  }, [isLoading])

  useEffect(() => {
    if (!hasCheckedAuth) return

    if (!user) {
      // Save the current path for redirect after login
      if (typeof window !== "undefined" && pathname !== "/login") {
        const fullPath = window.location.pathname + window.location.search
        sessionStorage.setItem("redirectUrl", fullPath)
      }
      router.replace("/login")
    }
  }, [hasCheckedAuth, user, pathname, router])

  // Show loading while checking auth
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A03321]"></div>
      </div>
    )
  }

  // Only render children if user is authenticated
  return user ? <>{children}</> : null
}
