"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toast

const Login = () => {
  const [login, setLogin] = useState({ email: "", password: "" }); // changed from username to email
  const [alertMessage, setAlertMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (loginSuccess && isMounted) {
      const role = sessionStorage.getItem("role");
      const lastVisitedPage = sessionStorage.getItem("lastVisitedPage") || "/";

      setAlertMessage("You have successfully logged in!");
      toast.success("You have successfully logged in!"); // Show success toast message

      setTimeout(() => {
        role === "admin" ? router.push("/dashboard") : router.push(lastVisitedPage);
      }, 2000);
    }
  }, [loginSuccess, isMounted, router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", login, {
        withCredentials: true,
      });

      setLoginSuccess(true);
      const token = response.data.token;
      document.cookie = `token=${token}; path=/;`;

      const getCookie = (name: string): string | null => {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
          const [cookieName, cookieValue] = cookie.trim().split("=");
          if (cookieName === name) return cookieValue;
        }
        return null;
      };

      const userRole = getCookie("userrole");
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", userRole || "");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      setAlertMessage(errorMessage);
      toast.error(errorMessage); // Show error toast message
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFAF4] px-4 py-8">
<div className=" bg-white shadow-lg rounded-xl p-6 sm:p-8 lg:w-1/2">


        <h1 className="text-3xl font-bold text-center text-[#A03321] mb-4">
          Welcome Back!
        </h1>
        <h3 className="text-center text-[#A03321] text-lg mb-6">
          Log in to access your account
        </h3>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-[#A03321]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={login.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A03321] focus:border-[#A03321] sm:text-sm"
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
                value={login.password}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A03321] focus:border-[#A03321] sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-[#A6CC9A] text-[#A03321] font-semibold rounded-md shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A03321]"
          >
            LOG IN
          </button>

          <p className="mt-4 text-sm text-center text-[#A03321]">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold underline hover:opacity-90">
              Sign up
            </Link>
          </p>
        </form>

        {alertMessage && (
          <div className="bg-green-200 text-green-800 p-3 rounded-md mt-4 text-center text-sm">
            {alertMessage}
          </div>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} /> {/* Add ToastContainer */}
    </div>
  );
};

export default Login;
