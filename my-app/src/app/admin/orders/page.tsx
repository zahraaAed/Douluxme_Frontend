"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import axios from "axios"
import { FiEye, FiTrash, FiEdit } from "react-icons/fi"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Interfaces
interface Address {
  phone: string
  region: string
  address_direction: string
  building: string
  floor: string
}

interface User {
  id: number
  name: string
  address?: Address
}

interface Order {
  id: number
  userId: number
  user?: User
  status: "pending" | "processing" | "completed" | "canceled"
  subtotalPrice: number
  price: number
  paymentMethod: string
  createdAt: string
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null)
  const [editOrderData, setEditOrderData] = useState<{
    id: number
    status: "pending" | "processing" | "completed" | "canceled"
  }>({
    id: 0,
    status: "pending",
  })

  const API_URL = "http://localhost:5000/api"

  const getOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/orders/get`, {
        withCredentials: true,
      })

      if (response.status === 200) {
        setOrders(response.data)
        setError(null)
      } else {
        setError(`Unexpected response status: ${response.status}`)
      }
    } catch (err) {
      console.error("Error fetching orders:", err)
     
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (orderId: number) => {
    setOrderToDelete(orderId)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return

    try {
      const orderToDeleteData = orders.find((order) => order.id === orderToDelete)

      if (!orderToDeleteData) {
        setError("Order not found")
        return
      }

      const normalizedStatus = orderToDeleteData.status.toLowerCase()

      if (normalizedStatus !== "pending" && normalizedStatus !== "canceled") {
        setError("Only pending or canceled orders can be deleted.")
        setIsDeleteModalOpen(false)
        return
      }

      const response = await axios.delete(`${API_URL}/orders/delete/${orderToDelete}`, {
        withCredentials: true,
      })

      if (response.status === 200) {
        setOrders((prev) => prev.filter((order) => order.id !== orderToDelete))
        toast.success("Order deleted successfully.")
        setError(null)
      } else {
        setError("Failed to delete order. Unexpected response.")
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Error deleting order:", err.response?.data || err.message)
      } else {
        console.error("Error deleting order:", err)
      }

      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("You don't have permission to delete this order.")
      } else if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("Order not found.")
      } else {
        setError("Unable to delete order. Please try again.")
      }
    } finally {
      setIsDeleteModalOpen(false)
    }
  }

  const handleEditClick = (order: Order) => {
    setEditOrderData({ id: order.id, status: order.status })
    setIsEditModalOpen(true)
  }

  const handleEditChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEditOrderData({
      ...editOrderData,
      [e.target.name]: e.target.value as "pending" | "processing" | "completed" | "canceled",
    })
  }

  const submitEditOrder = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.patch(
        `${API_URL}/orders/update/${editOrderData.id}`,
        { status: editOrderData.status },
        { withCredentials: true },
      )

      if (response.status === 200) {
        setIsEditModalOpen(false)
        // Update the order in the local state
        setOrders((prev) =>
          prev.map((order) => (order.id === editOrderData.id ? { ...order, status: editOrderData.status } : order)),
        )
        toast.success("Order updated successfully.")
      }
    } catch (err: any) {
      console.error("Error updating order:", err)
      setError(err.response?.data?.message || "Unable to update order")
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-600"
      case "processing":
        return "text-blue-600"
      case "completed":
        return "text-green-600"
      case "canceled":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex flex-col p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#A03321]">Manage Orders</h1>
        <button onClick={getOrders} className="px-4 py-2 bg-[#A03321] text-white rounded hover:bg-[#8A2B1C] transition">
          Refresh Orders
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A03321]"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No orders found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-[#A03321] text-white">
                <th className="px-6 py-3 text-center text-sm font-semibold border">Order ID</th>
                <th className="px-6 py-3 text-center text-sm font-semibold border">Date</th>
                <th className="px-6 py-3 text-center text-sm font-semibold border">Customer</th>
                <th className="px-6 py-3 text-center text-sm font-semibold border">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold border">Payment</th>
                <th className="px-6 py-3 text-center text-sm font-semibold border">Subtotal</th>
                <th className="px-6 py-3 text-center text-sm font-semibold border">Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold border">Address</th>
                <th className="px-6 py-3 text-center text-sm font-semibold border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700 text-center border">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center border">
                    {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-center border">{order.user?.name || "N/A"}</td>
                  <td className={`px-6 py-4 text-sm font-medium text-center border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center border">{order.paymentMethod}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center border">
                    ${order.subtotalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center border">${order.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-xs text-gray-700 text-center border">
                    {order.user?.address
                      ? `${order.user.address.region}, ${order.user.address.address_direction}, Building ${order.user.address.building}, Floor ${order.user.address.floor}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center space-x-3">
                    <Link href={`/admin/orders/item?orderId=${order.id}`}>
                                        <button className="flex items-center text-blue-500 hover:text-blue-700">
                                            <FiEye className="h-5 w-5" />
                                        </button>
                                    </Link>
                      <button
                        className="text-[#A68F7B] hover:text-[#8A7559] transition"
                        onClick={() => handleEditClick(order)}
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        onClick={() => handleDeleteClick(order.id)}
                      >
                        <FiTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-gray-300">
            <h3 className="text-xl font-semibold text-[#A03321] mb-4">Edit Order Status</h3>
            <form onSubmit={submitEditOrder}>
              <label className="block mb-3">
                <span className="text-gray-700">Order Status:</span>
                <select
                  name="status"
                  value={editOrderData.status}
                  onChange={handleEditChange}
                  className="block w-full p-2 border rounded mt-1 focus:ring focus:ring-[#A03321]"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </label>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#A03321] text-white hover:bg-[#8A2B1C] transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-gray-300">
            <h3 className="text-xl font-semibold text-[#A03321] mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this order? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage
