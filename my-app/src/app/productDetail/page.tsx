'use client';

import type React from "react"
import {Suspense, useCallback, useEffect, useState } from 'react';
import axios from "axios"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "../components/header"
import { useUser } from "../context/authContext"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useCart } from "../context/cartContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"
import Image from "next/image"

interface Nut {
  variety: string
}

interface Chocolate {
  type: string
}

interface CartItem {
  id: string
  productId: number
  quantity: number
}

interface Product {
  id: number
  name: string
  price: number
  image: string
  nut: Nut
  chocolate: Chocolate
  categoryId: number
}

interface Feedback {
  id: number
  comment: string
  UserId: number
  ProductId: number
  user?: {
    name: string
  }
}

const ProductDetail = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get("productId")
  const { user } = useUser()
  const { addCartItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [feedback, setFeedback] = useState<Feedback[] | null>(null)
  const [newComment, setNewComment] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [quantity, setQuantity] = useState<number>(1)
  const [addedToCart, setAddedToCart] = useState<boolean>(false)

  const fetchProduct = useCallback(async () => {
    try {
      const res = await axios.get(`https://douluxme-backend.onrender.com/api/products/get/${id}`);
      setProduct(res.data);

      const relatedRes = await axios.get(
        `https://douluxme-backend.onrender.com/api/products/get/products/category/${res.data.categoryId}`,
      );
      setRelatedProducts(relatedRes.data);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

 /*  const fetchFeedback = async () => {
    try {
      const res = await axios.get(`https://douluxme-backend.onrender.com/api/feedbacks/product/${id}`)
      setFeedback(res.data)
    } catch (err) {
      console.error("Error fetching feedback:", err)
    }
  } */
    const fetchFeedback = useCallback(async () => {
      try {
        const res = await axios.get(`https://douluxme-backend.onrender.com/api/feedbacks/product/${id}`);
        setFeedback(res.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      }
    }, [id]);
  

  const handleSubmitFeedback = async () => {
    if (!newComment.trim() || !user) return

    try {
      await axios.post("https://douluxme-backend.onrender.com/api/feedbacks/create", {
        comment: newComment,
        ProductId: Number(id),
        UserId: user.id,
      })

      setNewComment("")
      fetchFeedback()
    } catch (err) {
      console.error("Error submitting feedback:", err)
    }
  }


  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchFeedback();
    }
  }, [id, fetchProduct, fetchFeedback]);

 
  // Check for redirect after login
  useEffect(() => {
    // If user just logged in and there's a stored redirect URL, clear it
    if (user && typeof window !== "undefined") {
      const redirectUrl = sessionStorage.getItem("redirectUrl")
      if (redirectUrl && redirectUrl.includes(`productId=${id}`)) {
        sessionStorage.removeItem("redirectUrl")
        // Show a welcome back message
        toast.success("Welcome back! You can now add items to your cart.")
      }
    }
  }, [user, id])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value))
    setQuantity(value)
  }

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!user) {
      // Store current URL for redirect after login
      if (typeof window !== "undefined") {
        const currentUrl = window.location.pathname + window.location.search
        sessionStorage.setItem("redirectUrl", currentUrl)
      }

      // Show message and redirect to login
      toast.info("Please log in to add items to your cart")
      setTimeout(() => {
        router.push("/login")
      }, 1500)
      return
    }

    if (!product) return // Make sure the product exists

    // Create a cart item with the structure expected by the context
    const cartItem: CartItem = {
      id: Date.now().toString(), // Generate a temporary ID
      productId: product.id,
      quantity: quantity,
    }

    // Call addCartItem to add the item to the cart
    addCartItem(cartItem);

    // Show a success message
    toast.success("Added to cart!")

    // Set addedToCart state to true for UI purposes
    setAddedToCart(true)
  }

  const totalPrice = product ? product.price * quantity : 0
  const description = product
    ? `This product features ${product.chocolate?.type} chocolate with ${product.nut?.variety} nuts.`
    : ""

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!product) return <div className="p-8 text-center">No product found.</div>

  // Settings for the feedback slider
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <div style={{ marginTop: "30px" }}>
        <ul className="flex justify-center gap-6">{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        className={`w-6 h-6 rounded-full border-2 border-[#A9471F] transition-colors duration-300`}
        style={{
          backgroundColor: i === 0 ? "#FFC589" : "transparent",
        }}
      />
    ),
  }

  // Group feedback into pairs for the carousel
  const feedbackGroups = feedback
    ? Array.from({ length: Math.ceil(feedback.length / 2) }, (_, i) => feedback.slice(i * 2, i * 2 + 2))
    : []

  return (
  
    <div className="mt-20">
         <Suspense fallback={<div>Loading reviews...</div>}> 
      <Header />

      <div className="flex md:flex-row gap-8 p-8 mx-[30px] justify-center">
        <div className="flex-1">
          <Image
            src={`https://douluxme-backend.onrender.com/uploads/${product.image}`}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {/* Name and Price row with space between */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-[#A9471F]">{product.name}</h2>
            <p className="text-lg text-[#FF7F00]">${totalPrice}</p>
          </div>

          {/* Horizontal line */}
          <hr />

          {/* Description */}
          <p className="text-gray-700 my-4">{description}</p>

          {/* Horizontal line */}
          <hr />

          {/* Chocolate Type */}
          <div className="my-4">
            <label htmlFor="chocolate" className="font-semibold text-[#A9471F]">
              Chocolate Type:
            </label>
            <p className="text-gray-700">{product.chocolate?.type}</p>
          </div>

          {/* Horizontal line */}
          <hr />

          {/* Quantity and Add to Cart row with space between */}
          <div className="flex justify-between items-center my-6">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="font-semibold text-[#A9471F]">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 p-2 border border-gray-300 rounded"
                min="1"
              />
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className={`px-6 py-2 rounded-md font-semibold ${
                user ? "bg-green-500 text-white hover:bg-[#E67300]" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              {user ? "Add to Cart" : "Login to Purchase"}
            </button>
          </div>

          {!user && (
            <p className="mt-1 text-sm text-gray-500 italic">
              Please{" "}
              <Link href="/login" className="text-[#FF7F00] hover:underline">
                login
              </Link>{" "}
              to add items to your cart
            </p>
          )}

          {addedToCart && (
            <p className="mt-3 text-green-700 font-medium">
              ✅{" "}
              <Link href="/cart" className="underline hover:text-[#FF7F00] transition-colors">
                View cart
              </Link>
            </p>
          )}

          <div className="border-b-2 mt-6 mb-6"></div>

          <h3 className="text-2xl font-bold mb-4 text-[#A9471F]">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <div key={item.id} className="product-card">
                <Image
                  src={`https://douluxme-backend.onrender.com/uploads/${item.image}`}
                  alt={item.name}
                  className="w-full h-auto object-cover"
                />
                <h4 className="mt-2 text-lg font-semibold">{item.name}</h4>
                <p className="text-lg text-[#FF7F00]">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
   
      {/* Feedback Section - Updated to match the image exactly */}
      <div className="p-8 bg-[#fdf7f2] text-center">
        <h3 className="text-3xl font-bold text-black mb-8">REVIEWS AND RATING</h3>

        {feedback && feedback.length > 0 ? (
          <div className="max-w-6xl mx-auto">
            <Slider {...sliderSettings}>
              {feedbackGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <div className="flex flex-col md:flex-row justify-center gap-8">
                    {group.map((fb, idx) => (
                      <div
                        key={fb.id}
                        className={`w-full max-w-md aspect-[4/3] flex flex-col justify-center p-6 ${
                          idx % 2 === 0
                            ? "border border-green-400 bg-transparent" // Left card: green border, transparent background
                            : "bg-[#A6CC9A] border-0" // Right card: green background, no border
                        }`}
                      >
                        <p
                          className={`text-lg font-semibold mb-2 ${
                            idx % 2 === 0 ? "text-[#A9471F]" : "text-[#333333]"
                          }`}
                        >
                          {fb.user?.name || "Anonymous"}
                        </p>
                        <p className={idx % 2 === 0 ? "text-gray-700" : "text-[#333333]"}>{fb.comment}</p>
                      </div>
                    ))}
                    {group.length === 1 && (
                      // If there's only one feedback in the group, add an empty div to maintain layout
                      <div className="w-full max-w-md aspect-[4/3]" />
                    )}
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <p className="text-gray-500">No feedback yet.</p>
        )}

        {user ? (
          <div className="mt-8 flex flex-col items-center">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full max-w-xl h-32 p-3 border border-gray-300 rounded mb-4"
              placeholder="Leave your feedback here..."
            />
            <button
              onClick={handleSubmitFeedback}
              className="bg-[#FF7F00] text-white px-6 py-2 rounded-md font-semibold"
            >
              Submit Feedback
            </button>
          </div>
        ) : (
          <p className="text-gray-500 mt-6">Please log in to leave feedback.</p>
        )}
      </div>
      </Suspense>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  
  )
}

export default ProductDetail
