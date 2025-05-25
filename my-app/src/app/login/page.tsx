"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import Link from "next/link"
import { useUser } from "../context/authContext"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LoginRedirectHandler from "./loginRedirectHandler";

const Login = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { login } = useUser()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    try {
      await login(loginInput.email, loginInput.password)
    } catch (error) {
      console.error("Login failed:", error)
      setIsLoggingIn(false)
    }
  }

  if (!isMounted) return null

  return (
    <>
      <LoginRedirectHandler />
      <div className="flex items-center justify-center min-h-screen bg-[#FFFAF4] px-4 py-8">
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 lg:w-1/2">
          <h1 className="text-3xl font-bold text-center text-[#A03321] mb-4">Welcome Back!</h1>
          <h3 className="text-center text-[#A03321] text-lg mb-6">Log in to access your account</h3>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-[#A03321]">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginInput.email}
                onChange={handleInputChange}
                required
                disabled={isLoggingIn}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A03321] focus:border-[#A03321] sm:text-sm disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-[#A03321]">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={loginInput.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoggingIn}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A03321] focus:border-[#A03321] sm:text-sm disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoggingIn}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 disabled:opacity-50"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-4 py-2 px-4 bg-[#A03321] text-white font-semibold rounded-md shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A03321] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoggingIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                "LOG IN"
              )}
            </button>

            <p className="mt-4 text-sm text-center text-[#A03321]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold underline hover:opacity-90">
                Sign up
              </Link>
            </p>
          </form>
        </div>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </>
  )
}

export default Login
