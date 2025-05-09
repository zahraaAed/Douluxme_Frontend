"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import { useUser } from "../context/authContext";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string[];
};

type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: Product;
};

type Order = {
  id: number;
  status: string;
  createdAt: string;
  userId: number;
  paymentMethod: string;
  orderDetails: OrderItem[];
};

const OrdersHistory: React.FC = () => {
  const { user, getMe } = useUser(); // Use user from context
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch orders when the user is available
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await axios.get(
          `https://douluxme-backend.onrender.com/api/orders/user/${user.id}`,
          { withCredentials: true }
        );
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      getMe(); // Fetch user data if not available
    }
  }, [user, getMe]);

  const handleSearch = () => {
    if (!startDate && !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      if (startDate && endDate) return orderDate >= startDate && orderDate <= endDate;
      if (startDate) return orderDate >= startDate;
      if (endDate) return orderDate <= endDate;
      return true;
    });

    setFilteredOrders(filtered);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setFilteredOrders(orders);
  };

  if (loading) return <div className="text-center text-xl py-10">Loading...</div>;

  return (
    <div className="py-12">
      <Header />

      <div className="h-[20vh] flex items-center justify-center">
        <h1 className="text-[#B65F50] text-5xl sm:text-6xl font-bold text-center">
          Orders History
        </h1>
      </div>

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      {/* Date Filters */}
      <div className="flex justify-center items-center flex-wrap gap-4 mt-10 mb-6">
        <label className="flex flex-col text-sm text-gray-700">
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md mt-1"
          />
        </label>

        <label className="flex flex-col text-sm text-gray-700">
          End Date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md mt-1"
          />
        </label>

        <button
          onClick={handleSearch}
          disabled={!startDate && !endDate}
          className={`px-4 py-2 rounded-md text-white mt-6 ${
            startDate || endDate ? "bg-[#4A8C8C] hover:bg-[#357474]" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Search
        </button>

        {(startDate || endDate) && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded-md mt-6"
          >
            Clear
          </button>
        )}
      </div>

      {/* Orders Display */}
      <div className="max-w-4xl mx-auto space-y-6">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found</p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Order ID: {order.id} - {order.status}
              </h2>

              <div className="space-y-4">
                {order.orderDetails.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <img
                      src={item.product.image?.[0] || "https://via.placeholder.com/100"}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 ml-4">
                      <div className="text-lg font-medium text-gray-900">{item.product.name}</div>
                      <div className="text-sm text-gray-500">Price: ${item.product.price}</div>
                      <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      Total: ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-gray-500">
                Ordered On: {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrdersHistory;
