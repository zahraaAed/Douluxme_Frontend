"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  address?: {
    phone: string;
    region: string;
    address_direction: string;
    building: string;
    floor: string;
  } | null;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getMe: () => Promise<void>;  // Add getMe method to fetch user data
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Function to fetch user data
  const getMe = async () => {
    try {
      const response = await axios.get("https://douluxme-backend.onrender.com/api/users/me", {
        withCredentials: true, // Important to send cookies (token)
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };
  

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "https://douluxme-backend.onrender.com/api/users/login",
        { email, password },
        { withCredentials: true }
      );
      const { token, user } = response.data;
      console.log("Login response:", response.data);
      console.log("User data:", user);
      console.log("Token:", token);

      // Save token to cookies and session storage
      document.cookie = `token=${token}; path=/;`;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", user.role);

      setUser(user); // Set user from login response
      toast.success("You have successfully logged in!");

      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/admin/user");
        } else {
          const lastVisitedPage = sessionStorage.getItem("lastVisitedPage") || "/";
          router.push(lastVisitedPage);
        }
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await axios.post("https://douluxme-backend.onrender.com/api/users/logout", {}, {
        withCredentials: true, // important to send cookies
      });

      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Fetch user data on initial load
  useEffect(() => {
    getMe();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, getMe }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
