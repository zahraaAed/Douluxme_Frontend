"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useCart } from "../context/cartContext"
import Header from "../components/header"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useUser } from "../context/authContext"

interface Product {
  id: number
  name: string
  price: number
  image: string
}

const CartList: React.FC = () => {
  const { carts, loading, error, updateCartItem, removeCartItem } = useCart()
  const { isLoading: authLoading } = useUser() // Use the auth context
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [cartProducts, setCartProducts] = useState<{ [key: number]: Product }>({})
  const [productsLoading, setProductsLoading] = useState(true)
  const router = useRouter()

  // Fetch product details for cart items
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (carts.length === 0) {
        setProductsLoading(false)
        return
      }

      try {
        setProductsLoading(true)
        const productIds = [...new Set(carts.map((cart) => cart.productId))]
        const productData: { [key: number]: Product } = {}

        // Fetch each product's details
        await Promise.all(
          productIds.map(async (productId) => {
            try {
              const response = await axios.get(`https://douluxme-backend.onrender.com/api/products/get/${productId}`)
              productData[productId] = response.data
            } catch (err) {
              console.error(`Error fetching product ${productId}:`, err)
            }
          }),
        )

        setCartProducts(productData)
      } catch (err) {
        console.error("Error fetching product details:", err)
      } finally {
        setProductsLoading(false)
      }
    }

    if (!loading && carts.length > 0) {
      fetchProductDetails()
    }
  }, [carts, loading])

  useEffect(() => {
    // Initialize quantities when cart items are loaded
    if (!loading && carts.length > 0) {
      const initialQuantities: { [key: string]: number } = {}
      carts.forEach((cart) => {
        initialQuantities[cart.id] = cart.quantity
      })
      setQuantities(initialQuantities)
    }
  }, [carts, loading])

  const handleQuantityChange = (id: string, value: number) => {
    const newQuantity = Math.max(1, value)
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }))
    updateCartItem(id, newQuantity)
  }

  const handleRemoveItem = (id: string) => {
    removeCartItem(id)
  }

  // Get product for a cart item
  const getProduct = (productId: number): Product | undefined => {
    return cartProducts[productId]
  }

  // Format price safely
  const formatPrice = (price: number | undefined): string => {
    if (typeof price !== "number") return "0.00"
    return price.toFixed(2)
  }

  const cartTotal = carts.reduce((sum, cart) => {
    const product = getProduct(cart.productId)
    const price = product?.price || 0
    const qty = quantities[cart.id] || cart.quantity || 1
    return sum + price * qty
  }, 0)

  const isPageLoading = loading || productsLoading || authLoading

  return (
    <div className="min-h-screen bg-[#FFFBF1]">
      <Header />
      <div className="mb-6 mt-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="flex flex-col md:flex-row md:justify-between w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-[#B65F50] mb-4 md:mb-0">Your Cart</h2>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-2 bg-[#808000] text-white font-semibold rounded-lg hover:opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {isPageLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B65F50]"></div>
          <p className="mt-2 text-gray-500">Loading cart...</p>
        </div>
      )}

      {error && <p className="text-center text-red-500 py-8">Error: {error}</p>}

      {!isPageLoading && !error && carts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-6">Your cart is empty</p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-2 bg-[#808000] text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Start Shopping
          </button>
        </div>
      )}

      {!isPageLoading && !error && carts.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6 overflow-y-auto">
            {carts.map((cart) => {
              const product = getProduct(cart.productId)
              if (!product) return null // Skip if product not found

              const quantity = quantities[cart.id] || cart.quantity || 1
              const price = product.price || 0
              const total = price * quantity

              return (
                <div
                  key={cart.id}
                  className="flex flex-col sm:flex-row items-center sm:justify-between p-4 bg-white rounded-lg shadow w-full"
                >
                  <div className="flex items-center w-full sm:w-auto space-x-4">
                    <Image
                      src={`https://douluxme-backend.onrender.com/uploads/${product.image}`}
                      alt={product.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="mt-3 sm:mt-0">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-600">Price: ${formatPrice(price)}</p>
                      <p className="text-gray-600 font-medium">Total: ${formatPrice(total)}</p>
                    </div>
                  </div>

                  <div className="flex items-center mt-4 sm:mt-0 sm:space-x-3">
                    <button
                      onClick={() => handleQuantityChange(cart.id, quantity - 1)}
                      className="px-3 py-1 text-xl font-bold text-gray-600 hover:bg-gray-200 rounded"
                    >
                      –
                    </button>
                    <span className="px-4 py-1 text-gray-800 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(cart.id, quantity + 1)}
                      className="px-3 py-1 text-xl font-bold text-gray-600 hover:bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(cart.id)}
                      className="ml-4 px-4 py-2 bg-[#B65F50] text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Section */}
          <div className="lg:w-1/3 w-full h-fit sticky top-24 bg-white rounded-lg shadow p-6">
            <h3 className="text-2xl font-bold mb-4 text-[#B65F50]">Summary</h3>
            <div className="flex justify-between text-lg font-medium mb-2 text-gray-700">
              <span>Subtotal</span>
              <span>${formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-lg font-medium mb-4 text-gray-700">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-xl font-bold text-[#B65F50]">
              <span>Total</span>
              <span>${formatPrice(cartTotal + 5)}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full mt-6 py-3 bg-[#808000] text-white font-semibold rounded-lg hover:opacity-90"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartList
