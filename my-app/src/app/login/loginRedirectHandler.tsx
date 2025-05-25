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
      if (redirectUrl) {
        sessionStorage.removeItem("redirectUrl")
        router.replace(redirectUrl)
      } else {
        router.replace("/")
      }
    }
  }, [user, router])

  return null
}
