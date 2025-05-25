"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"

interface SidebarProps {
  onFilterChange: (filter: { category: string; value: string }) => void
  selectedFilter: { category: string; value: string }
}

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  boxSize: string[]
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange, selectedFilter }) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [nuts, setNuts] = useState<string[]>([])
  const [, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  const [boxSizes, setBoxSizes] = useState<string[]>([])

  const fetchData = async () => {
    try {
      const [nutsRes, categoriesRes, productsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/nuts/get"),
        axios.get("http://localhost:5000/api/categories/get"),
        axios.get("http://localhost:5000/api/products/get")
      ]);
  
      setNuts(nutsRes.data.map((nut: { variety: string }) => nut.variety));
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
  
      // <-- SAFETY CHECK: if productsRes.data is missing, default to empty array
      const products = productsRes.data || [];
  
      const sizes = [
        ...new Set(products.flatMap((product: Product) => product.boxSize as string[]))
      ].filter(Boolean) as string[];
  
      setBoxSizes(sizes);
    } catch (error) {
      console.error("Failed to fetch sidebar data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData()
  }, [])
  

  const handleFilterClick = (category: string, value: string) => {
    onFilterChange({ category, value })
  }

  const getOptionsForCategory = (categoryName: string): string[] => {
    const lower = categoryName.toLowerCase()
    if (lower.includes("bar")) return nuts
    if (lower.includes("box")) return boxSizes
    if (lower.includes("gift")) return ["Ramadan", "Prophet Muhammad", "Eid Mubarak"]
    return [categoryName]
  }

  return (
    <aside className="md:w-[200px] w-full text-2xl flex flex-col gap-4 text-[#FFA76B] font-bold mt-20">
      <button
        className="md:hidden mb-4 bg-[#FFA76B] text-white px-4 py-2 rounded"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "Hide Filters" : "Show Filters"}
      </button>

      {isSidebarOpen && (
        <div className="flex flex-col gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            categories.map((category) => {
              const options = getOptionsForCategory(category.name)
              if (options.length === 0) return null

              return (
                <details
                  key={category.id}
                  className="cursor-pointer"
                  open={selectedFilter.category === category.name}
                >
                  <summary className="text-lg">{category.name.toUpperCase()}</summary>
                  <div className="pl-4 mt-1 text-sm text-black flex flex-col gap-1">
                    {options.map((option) => (
                      <div
                        key={option}
                        className={`cursor-pointer hover:text-[#FF7F00] ${
                          selectedFilter.category === category.name &&
                          selectedFilter.value === option
                            ? "text-[#FF7F00] font-semibold"
                            : ""
                        }`}
                        onClick={() => handleFilterClick(category.name, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </details>
              )
            })
          )}
        </div>
      )}
    </aside>
  )
}

export default Sidebar
