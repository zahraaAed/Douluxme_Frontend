"use client";

import { useEffect, useState} from 'react';
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import { FiEdit, FiTrash } from "react-icons/fi";

const OrderItemsPage = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [orderItems, setOrderItems] = useState([]);
    const [error, setError] = useState('');
    const [products, setProducts] = useState({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editItemData, setEditItemData] = useState({ id: "", quantity: "", productId: null, price: 0 });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        if (!orderId) return;

        const getOrderItems = async () => {
            try {
                const response = await axios.get(`${API_URL}/orderDetails/order/${orderId}`, { withCredentials: true });
                if (response.status === 200) {
                    setOrderItems(response.data);
                } else {
                    setError(`Unexpected response status: ${response.status}`);
                }
            } catch (err) {
                console.error("Error fetching order items:", err);
                setError("Unable to get order items");
            }
        };

        const getProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/products/get`);
                if (response.status === 200) {
                    const productsMap = response.data.reduce((acc, product) => {
                        acc[product.id] = product;
                        return acc;
                    }, {});
                    setProducts(productsMap);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        getOrderItems();
        getProducts();
    }, [orderId, API_URL]);

    const handleEditClick = (item) => {
        const productPrice = products[item.productId]?.price || 0;
        setEditItemData({
            id: item.id,
            quantity: item.quantity,
            productId: item.productId,
            price: item.quantity * productPrice,
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        const updatedQuantity = name === "quantity" ? parseInt(value, 10) || 1 : editItemData.quantity;
        const updatedPrice = updatedQuantity * (products[editItemData.productId]?.price || 0);

        setEditItemData((prev) => ({
            ...prev,
            [name]: value,
            price: updatedPrice,
        }));
    };

    const submitEditOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                `${API_URL}/orderDetails/update/${editItemData.id}`,
                { quantity: parseInt(editItemData.quantity, 10) },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setIsEditModalOpen(false);
                setOrderItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === editItemData.id ? { ...item, quantity: editItemData.quantity } : item
                    )
                );
            }
        } catch (err) {
            console.error("Error updating order item:", err);
            setError("Unable to update order item");
        }
    };

    const deleteOrderItem = async (orderItemId) => {
        try {
            const response = await axios.delete(
                `${API_URL}/orderDetails/delete/${orderItemId}`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                setOrderItems((prevItems) => prevItems.filter((item) => item.id !== orderItemId));
            }
        } catch (err) {
            console.error("Error deleting order item:", err);
            setError("Unable to delete order item");
        }
    };

    return (
        <div className="flex flex-col items-left p-4">
            <h1 className="text-2xl font-bold my-8">Order Items for Order {orderId}</h1>
            {error && <p className="text-red-500">{error}</p>}

            {orderItems.length === 0 ? (
                <p>No items found for this order.</p>
            ) : (
                <table className="min-w-full border border-gray-300 shadow-md rounded-md">
                    <thead>
                        <tr className="bg-[#A03321] text-white">
                            <th className="py-2 px-4 border">Order ID</th>
                            <th className="py-2 px-4 border">Item ID</th>
                            <th className="py-2 px-4 border">Product</th>
                            <th className="py-2 px-4 border">Quantity</th>
                            <th className="py-2 px-4 border">Price</th>
                            <th className="py-2 px-4 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50 text-[#A03321]">
                                <td className="py-2 px-4 border text-center">{item.orderId}</td>
                                <td className="py-2 px-4 border text-center">{item.id}</td>
                                <td className="py-2 px-4 border text-center">{products[item.productId]?.name || "Loading..."}</td>
                                <td className="py-2 px-4 border text-center">{item.quantity}</td>
                                <td className="py-2 px-4 border text-center">${products[item.productId]?.price || "-"}</td>
                                <td className="py-2 px-4 border text-center">
                                    <button className="text-[#A68F7B] mx-2 hover:scale-105" onClick={() => handleEditClick(item)}><FiEdit /></button>
                                    <button className="text-red-700 hover:text-red-500 hover:scale-105" onClick={() => deleteOrderItem(item.id)}><FiTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
                    <div className="bg-white p-6 rounded-lg w-1/3 border border-gray-300">
                        <h2 className="text-xl font-semibold mb-4">Edit Order Item</h2>
                        <form onSubmit={submitEditOrder}>
                            <label className="block mb-2">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={editItemData.quantity}
                                onChange={handleEditChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                            <p className="mt-2 text-gray-700">
                                Updated Price: <strong>${editItemData.price}</strong>
                            </p>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderItemsPage;
