"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "../context/authContext"

export default function LoginRedirectHandler() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      const redirectUrl = sessionStorage.getItem("redirectUrl")

      // Clear the redirect URL from session storage
      if (redirectUrl) {
        sessionStorage.removeItem("redirectUrl")
      }

      // Check user role and redirect accordingly
      if (user.role === "admin") {
        // Redirect admin to admin dashboard
        router.replace("/admin")
      } else if (redirectUrl) {
        // Redirect regular user to saved URL
        router.replace(redirectUrl)
      } else {
        // Redirect regular user to home page
        router.replace("/")
      }
    }
  }, [user, router])

  return null
}
