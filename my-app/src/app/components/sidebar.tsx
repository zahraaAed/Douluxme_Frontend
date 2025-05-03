"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"

interface SidebarProps {
  onFilterChange: (filter: { category: string; value: string }) => void
  selectedFilter: { category: string; value: string }
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange, selectedFilter }) => {
  const [categories, setCategories] = useState<any[]>([])
  const [nuts, setNuts] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
    /*   try {
        const [nutsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/nuts/get"),
          axios.get("http://localhost:5000/api/categories/get"),
          console.log("Fetching data",response.data),
        ])
        setNuts(nutsResponse.data.map((nut: { variety: string }) => nut.variety))
        setCategories(categoriesResponse.data)
      } catch (error) {
        console.error("Failed to fetch data", error)
      } finally {
        setLoading(false)
      }
    } */
      try {
        const [nutsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/nuts/get"),
          axios.get("http://localhost:5000/api/categories/get"),
        ])
      
        console.log("Fetched nuts:", nutsResponse.data)
        console.log("Fetched categories:", categoriesResponse.data)
      
        setNuts(nutsResponse.data.map((nut: { variety: string }) => nut.variety))
        setCategories(categoriesResponse.data)
      } catch (error) {
        console.error("Failed to fetch data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterClick = (category: string, value: string) => {
    onFilterChange({ category, value })
  }

  // Determine options based on category name
  const getOptionsForCategory = (categoryName: string): string[] => {
    const lowerName = categoryName.toLowerCase()
  
    if (lowerName.includes("bar")) {
      return nuts
    }
    if (lowerName.includes("box")) {
      return ["6", "12", "24"]
    }
    if (lowerName.includes("gift")) {
      return ["Ramadan", "Prophet Muhammad", "Eid Mubarak"]
    }
  
    // Default: if no special options, just return the category itself as one option
    return [categoryName]
  }
  

  return (
    <aside className="md:w-[200px] w-full text-2xl flex flex-col gap-4 text-[#FFA76B] font-bold mt-20 ml-30 md:mb-0">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden mb-4 bg-[#FFA76B] text-white px-4 py-2 rounded"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        {isSidebarOpen ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Sidebar Content */}
      {isSidebarOpen && (
        <div className="flex flex-col gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            categories.map((category) => {
              const options = getOptionsForCategory(category.name)

              if (options.length === 0) return null // If no options, skip rendering this category

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
                          selectedFilter.category === category.name && selectedFilter.value === option
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
