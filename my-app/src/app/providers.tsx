"use client";

import type React from "react";
import { UserProvider } from "./context/authContext";
import { CartProvider } from "./context/cartContext"; // ✅ Import your CartProvider


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      
      <CartProvider>
        {children}
      </CartProvider>
    </UserProvider>
  );
}
