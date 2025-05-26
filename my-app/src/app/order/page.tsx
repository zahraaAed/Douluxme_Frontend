"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { useUser } from "../context/authContext"
import { useCart } from "../context/cartContext"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Header from "../components/header"
import { AxiosError } from "axios"

interface Product {
  id: number
  name: string
  price: number
  imageUrl: string
}

interface ExtendedCartItem {
  id: string
  productId: number
  quantity: number
  product?: Product
}

const OrderPage: React.FC = () => {
  const { user, isLoading: userLoading } = useUser()
  const { carts, loading: cartLoading, clearCart } = useCart()
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "wishmoney">("cash")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (userLoading || cartLoading) {
    return <p className="text-center mt-8 text-gray-600">Loading...</p>
  }

  if (!user) {
    return <p className="text-center mt-8 text-red-600">Please login to place an order.</p>
  }

  if (carts.length === 0) {
    return <p className="text-center mt-8 text-gray-500">Your cart is empty.</p>
  }

  const extendedCarts = carts as ExtendedCartItem[]

  const subtotalPrice = extendedCarts.reduce((acc, item) => {
    if (!item.product) {
      console.warn(`Missing product info for cart item ${item.id}`)
      return acc
    }
    return acc + item.quantity * item.product.price
  }, 0)

  const price = subtotalPrice

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        userId: Number(user.id),
        subtotalPrice,
        price,
        status: "pending",
        paymentMethod,
      }

      await axios.post("https://douluxme-backend.onrender.com/api/orders/create", payload, { withCredentials: true })

      toast.success("Order placed successfully!")

      // Clear cart after successful order
      await clearCart()

      router.push("/orderSuccess")
    } catch (err) {
                  // First, ensure that the error is an AxiosError
                  if (err instanceof AxiosError) {
                    const message =
                      err.response?.data?.message ||  // Check if the response has a message
                      err.message ||                  // Fallback to the error message from AxiosError
                      'Unknown error';                // Default message if no message is found
                
                    console.error("category Error:", err);
                
                    // Show the error message in the toast
                    toast.error(message);
                  } else {
                    // If the error is not an instance of AxiosError, handle it as a generic error
                    console.error("Non-Axios error:", err);
                    toast.error('An unknown error occurred');
                  }
                
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Header />
    <div className="max-w-4xl mx-auto px-4 py-8">
        
      <h1 className="text-3xl font-bold mb-6 text-center">Place Your Order</h1>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Info</h2>
        <p className="text-gray-700">{user.name || user.email}</p>
      </section>

      <section className="bg-white shadow-md rounded p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <ul className="divide-y divide-gray-200">
          {extendedCarts.map((item) => (
            <li key={item.id} className="flex justify-between py-3">
              <div>
                <p className="font-medium">{item.product ? item.product.name : "Item info missing"}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <div className="font-semibold">
                ${item.product ? (item.quantity * item.product.price).toFixed(2) : "0.00"}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end text-lg font-semibold">Subtotal: ${subtotalPrice.toFixed(2)}</div>
      </section>

      <section className="bg-white text-gray-500 shadow-md rounded p-6 mb-8">
        <label htmlFor="paymentMethod" className="block mb-2 font-semibold">
          Select Payment Method:
        </label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as "cash" | "wishmoney")}
          disabled={isSubmitting}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="cash">Cash</option>
          <option value="wishmoney">Wishmoney</option>
        </select>
      </section>

      <button
        onClick={handlePlaceOrder}
        disabled={isSubmitting}
        className="w-full bg-[#889008] text-white py-3 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? "Placing order..." : "Place Order"}
      </button>
    </div>
    </div>
  )
}

export default OrderPage
