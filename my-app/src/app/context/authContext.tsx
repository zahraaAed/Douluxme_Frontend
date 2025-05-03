"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface User {
  id: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
      
        { email, password },
        { withCredentials: true }
      );
      console.log(response.data)
      const { token, user } = response.data;

      // Save token to cookies
      document.cookie = `token=${token}; path=/;`;

      // Save token and role to session storage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", user.role);

      setUser(user); // ✅ directly setting user from login response

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
      await axios.post("http://localhost:5000/api/users/logout", {}, {
        withCredentials: true, // important to send cookies
      });
  
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  return (
    <UserContext.Provider value={{ user, login, logout }}>
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

