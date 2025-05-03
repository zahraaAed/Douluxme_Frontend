"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/cartContext';
import Header from '../components/header';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  id: string;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

const CartList: React.FC = () => {
  const { carts, loading, error, updateCartItem, removeCartItem } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  useEffect(() => {
    const initialQuantities: { [key: string]: number } = {};
    carts.forEach(cart => {
      initialQuantities[cart.id] = cart.quantity;
    });
    setQuantities(initialQuantities);
  }, [carts]);

  const handleQuantityChange = (id: string, value: number) => {
    const newQuantity = Math.max(1, value);
    setQuantities(prev => ({ ...prev, [id]: newQuantity }));
    updateCartItem(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeCartItem(id);
  };

  const cartTotal = carts.reduce((sum, cart) => {
    const price = cart.product?.price || 0;
    const qty = quantities[cart.id] || 1;
    return sum + price * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-[#FFFBF1]">
      <Header />
      <div className="mb-6 mt-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="flex flex-col md:flex-row md:justify-between w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-[#B65F50] mb-4 md:mb-0">Your Cart</h2>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-2 bg-[#A6CC9A] text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Loading cart...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && carts.length === 0 && (
        <p className="text-center text-gray-500">No items in your cart.</p>
      )}

      {!loading && !error && carts.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6 overflow-y-auto">
            {carts.map(cart => {
              const quantity = quantities[cart.id] || 1;
              const price = cart.product?.price || 0;
              const total = price * quantity;

              return (
                <div
                  key={cart.id}
                  className="flex flex-col sm:flex-row items-center sm:justify-between p-4 bg-white rounded-lg shadow"
                >
                  <div className="flex items-center w-full sm:w-auto space-x-4">
                    <img
                      src={`http://localhost:5000/uploads/${cart.product?.image}`}
                      alt={cart.product?.name || "Product"}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="mt-3 sm:mt-0">
                      <h3 className="text-lg font-semibold">{cart.product?.name}</h3>
                      <p className="text-gray-600">Price: ${price.toFixed(2)}</p>
                      <p className="text-gray-600 font-medium">Total: ${total.toFixed(2)}</p>
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
              );
            })}
          </div>

          {/* Summary Section */}
          <div className="lg:w-1/3 w-full h-fit sticky top-24 bg-white rounded-lg shadow p-6">
            <h3 className="text-2xl font-bold mb-4 text-[#B65F50]">Summary</h3>
            <div className="flex justify-between text-lg font-medium mb-2">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-medium mb-4">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${(cartTotal + 5).toFixed(2)}</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full mt-6 py-3 bg-[#A6CC9A] text-white font-semibold rounded-lg hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartList;
