"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { FaPen, FaTrashAlt, FaPlusCircle } from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface ProductAdmin {
  id: number
  name: string
  price: number
  image: string
  boxSize?: number
  nutId: number
  chocolateId: number
  categoryId: number
  nut: { id: number; variety: string }
  chocolate: { id: number; type: string }
  category: { id: number; name: string }
}

interface NutOption {
  id: number
  variety: string
}

interface ChocolateOption {
  id: number
  type: string
}

interface CategoryOption {
  id: number
  name: string
}

interface FormDataState {
  name: string
  price: number
  image: File | null
  boxSize?: number
  nutId: string
  chocolateId: string
  categoryId: string
}

const ProductAdmin = () => {
  const [products, setProducts] = useState<ProductAdmin[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductAdmin | null>(null)
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    price: 0,
    image: null,
    boxSize: undefined,
    nutId: "",
    chocolateId: "",
    categoryId: "",
  })
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)

  // Options for dropdowns
  const [nuts, setNuts] = useState<NutOption[]>([])
  const [chocolates, setChocolates] = useState<ChocolateOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOptions = async () => {
    try {
      // Fetch nuts, chocolates, and categories
      const [nutsRes, chocolatesRes, categoriesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/nuts/get"),
        axios.get("http://localhost:5000/api/chocolates/get"),
        axios.get("http://localhost:5000/api/categories/get"),
      ])

      setNuts(nutsRes.data)
      setChocolates(chocolatesRes.data)
      setCategories(categoriesRes.data)
    } catch (err) {
      console.error("Error fetching options:", err)
      toast.error("Failed to load form options!")
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:5000/api/products/get")
      setProducts(res.data)
    } catch (err) {
      console.error("Error fetching products:", err)
      toast.error("Failed to load products!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Promise.all([fetchProducts(), fetchOptions()])
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "boxSize" ? Number(value) : value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  const openAddModal = () => {
    setEditProduct(null)
    setFormData({
      name: "",
      price: 0,
      image: null,
      boxSize: undefined,
      nutId: "",
      chocolateId: "",
      categoryId: "",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (product: ProductAdmin) => {
    setEditProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      image: null,
      boxSize: product.boxSize,
      nutId: product.nutId.toString(),
      chocolateId: product.chocolateId.toString(),
      categoryId: product.categoryId.toString(),
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    formDataToSend.append("price", formData.price.toString())
    if (formData.image) formDataToSend.append("image", formData.image)
    if (formData.boxSize) formDataToSend.append("boxSize", formData.boxSize.toString())

    // Send IDs
    formDataToSend.append("nutId", formData.nutId)
    formDataToSend.append("chocolateId", formData.chocolateId)
    formDataToSend.append("categoryId", formData.categoryId)

    try {
      if (editProduct) {
        await axios.patch(`http://localhost:5000/api/products/update/${editProduct.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        })
        toast.success("Product updated successfully!")
      } else {
        await axios.post("http://localhost:5000/api/products/create", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        })
        toast.success("Product added successfully!")
      }

      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error("API error:", err.response.data)
        toast.error(err.response.data.message || "Error from server.")
      } else {
        console.error("Unknown error:", err)
        toast.error("Failed to submit product.")
      }
    }
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    try {
      await axios.delete(`http://localhost:5000/api/products/delete/${productToDelete}`, {
        withCredentials: true,
      })
      toast.success("Product deleted!")
      setIsDeleteConfirmOpen(false)
      setProductToDelete(null)
      fetchProducts()
    } catch (err) {
      console.error("Delete error:", err)
      toast.error("Failed to delete product.")
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#A03321]">Product List</h2>
        <button className="flex items-center gap-1 text-white hover:text-green-800 p-2" onClick={openAddModal}>
          <FaPlusCircle size={20} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <table className="min-w-full border border-[#A03321]">
          <thead className="bg-[#A03321] text-white">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Box Size</th>
              <th className="p-2 border">Nut</th>
              <th className="p-2 border">Chocolate</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-center border text-[#A03321]">
                <td className="p-2 border">
                  <Image
                    src={`http://localhost:5000/api/uploads/${product.image}`}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="object-cover mx-auto rounded"
                  />
                </td>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">${product.price}</td>
                <td className="p-2 border">{product.boxSize ?? "-"}</td>
                <td className="p-2 border">{product.nut.variety}</td>
                <td className="p-2 border">{product.chocolate.type}</td>
                <td className="p-2 border">{product.category.name}</td>
                <td className="p-2 border space-x-2">
                  <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800">
                    <FaPen size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setProductToDelete(product.id)
                      setIsDeleteConfirmOpen(true)
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-gray-300">
            <h3 className="text-lg font-bold mb-4">{editProduct ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Box Size</label>
                <input
                  type="number"
                  name="boxSize"
                  value={formData.boxSize || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Nut</label>
                <select
                  name="nutId"
                  value={formData.nutId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                >
                  <option value="">Select a nut</option>
                  {nuts.map((nut) => (
                    <option key={nut.id} value={nut.id}>
                      {nut.variety}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Chocolate</label>
                <select
                  name="chocolateId"
                  value={formData.chocolateId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                >
                  <option value="">Select a chocolate</option>
                  {chocolates.map((chocolate) => (
                    <option key={chocolate.id} value={chocolate.id}>
                      {chocolate.type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  {editProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this product?</h3>
            <div className="flex justify-between">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

export default ProductAdmin
