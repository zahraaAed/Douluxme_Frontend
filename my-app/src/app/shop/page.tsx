"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/header"
import Footer from "../components/footer"
import Sidebar from "../components/sidebar"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: number
  image: string
  nut: {
    variety: string
  }
  chocolate: {
    type: string
  }
  category: {
    name: string
  }
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedFilter, setSelectedFilter] = useState<{ category: string; value: string }>({
    category: "",
    value: "",
  })

  useEffect(() => {
    axios
      .get("https://douluxme-backend.onrender.com/api/products/get")
      .then((res) => {
        console.log("Fetched products:", res.data)
        setProducts(res.data)
        setFilteredProducts(res.data)
      })
      .catch((err) => console.error("Error fetching products:", err))
  }, [])

  // Handle filter changes from sidebar
  const handleFilterChange = (filter: { category: string; value: string }) => {
    setSelectedFilter(filter)

    if (filter.category === "" || filter.value === "") {
      setFilteredProducts(products)
      return
    }

    // Filter products based on selected category and value
    let filtered = [...products]

    switch (filter.category) {
      case "Bars":
        filtered = products.filter((product) => product.nut.variety === filter.value)
        break
      case "Boxes":
        // Assuming box size is stored somewhere in the product data
        // This is a placeholder - adjust according to your actual data structure
        filtered = products.filter(
          (product) =>
            product.name.toLowerCase().includes(`box of ${filter.value}`) ||
            product.name.toLowerCase().includes(`${filter.value} pieces`),
        )
        break
      case "Gifts":
        // Filter by gift type
        filtered = products.filter((product) => product.name.toLowerCase().includes(filter.value.toLowerCase()))
        break
      case "Categories":
        filtered = products.filter((product) => product.category.name.toLowerCase() === filter.value.toLowerCase())
        break
      default:
        filtered = products
    }

    setFilteredProducts(filtered)
  }

  // Clear filters
  const clearFilters = () => {
    setSelectedFilter({ category: "", value: "" })
    setFilteredProducts(products)
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[80vh] md:h-[110vh] bg-[#FFF7F3] overflow-hidden mt-20">
        <div className="absolute inset-0">
          <Image src="/Shop.png" alt="Order Hero" fill className="w-full h-full object-cover" priority />
        </div>
        <div className="relative z-10 flex items-center h-full px-8 text-[#B65F50]">
          <div className="text-left">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-bold leading-snug max-w-4xl ml-30">
              WHAT WOULD YOU <br /> LIKE TO ORDER
            </h2>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row px-6 md:px-12 mt-10">
        {/* Sidebar */}
        <Sidebar onFilterChange={handleFilterChange} selectedFilter={selectedFilter} />

        {/* Product Grid Section */}
        <div className="flex-1">
          {/* Title + Line */}
          <div className="flex items-center gap-4 mb-4 w-full">
            <h1 className="text-4xl font-bold text-black uppercase">Our Product</h1>
            <hr className="flex-grow border-t-4 border-[#A6CC9A]" />
          </div>

          {/* Active Filter Display */}
          {selectedFilter.category && (
            <div className="mb-4 flex items-center">
              <span className="text-sm text-gray-600 mr-2">
                Filtering by: {selectedFilter.category} - {selectedFilter.value}
              </span>
              <button onClick={clearFilters} className="text-sm text-[#FFA76B] hover:underline">
                Clear filter
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6 w-full">
            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mt-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white border rounded-xl p-4 shadow-sm text-center">
                    <Image
                      src={`https://douluxme-backend.onrender.com/uploads/${product.image}`}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="mx-auto mb-2 object-contain h-[150px]"
                    />
                    <h2 className="font-semibold text-sm mb-1">{product.name}</h2>
                    <p className="text-xs text-gray-500 mb-1 capitalize">
                      {product.nut.variety} + {product.chocolate.type} chocolate
                    </p>
                    <p className="text-sm text-gray-600 mb-2">${product.price}</p>
                 
                    <Link href={`/productDetail?productId=${product.id}`}>
                    <button className="w-full bg-[#D3E8A5] text-[#5B5B5B] hover:bg-[#c6e09a] py-1 rounded">
                   View Details
                    </button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No products match your filter criteria.</p>
                  <button onClick={clearFilters} className="mt-2 text-[#FFA76B] hover:underline">
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
