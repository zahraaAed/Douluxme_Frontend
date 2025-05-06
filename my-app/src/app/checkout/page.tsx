"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/authContext';
import { useCart } from '../context/cartContext';
import Header from '../components/header';
const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const { user } = useUser(); // Fetch user data from UserContext
    const { carts, fetchCartData } = useCart(); // Fetch cart data from CartContext

    // Auto-fill the cart data and calculate total price when the component mounts
    useEffect(() => {
        if (user) {
            // If the user is logged in, fetch their cart items
            fetchCartData();
        }
    }, [user, fetchCartData]);

    useEffect(() => {
        // Calculate the total price after cart items are fetched
        const calculateTotalPrice = (items: any[]) => {
            const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
            setTotalPrice(total);
        };
        
        if (carts) {
            setCartItems(carts);
            calculateTotalPrice(carts);
        }
    }, [carts]);

    return (
        <div className="min-h-screen bg-[#FFFBF1]">
            <Header />
            {/* Main Container */}
            <div className="mb-6 mt-30 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between">
                
                {/* Left Side: User Info */}
                <div className="lg:w-2/3 bg-white shadow-md rounded-lg p-6 mb-6 lg:mb-0">
                    <h3 className="text-2xl font-semibold text-[#B65F50] mb-4">Your Information</h3>
                    <form className="flex flex-col space-y-4">
                        <label className="text-sm font-medium text-[#B65F50]" htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            className="p-2 border rounded text-[#B65F50]"
                            value={user?.name || ''} // Autofill name
                            readOnly
                        />

                        <label className="text-sm font-medium text-[#B65F50]" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="p-2 border rounded text-[#B65F50]"
                            value={user?.email || ''} // Autofill email
                            readOnly
                        />

                        <label className="text-sm font-medium text-[#B65F50]" htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="text"
                            className="p-2 border rounded text-[#B65F50]"
                            value={user?.address?.phone || ''} // Autofill phone number
                            readOnly
                        />

                        {/* Address fields */}
                        <label className="text-sm font-medium text-[#B65F50]" htmlFor="region">Region</label>
                        <input
                            id="region"
                            type="text"
                            className="p-2 border rounded text-[#B65F50]"
                            value={user?.address?.region || ''} // Autofill region
                            readOnly
                        />

                        <label className="text-sm font-medium text-[#B65F50]" htmlFor="address_direction">Address</label>
                        <input
                            id="address_direction"
                            type="text"
                            className="p-2 border rounded text-[#B65F50]"
                            value={user?.address?.address_direction || ''} // Autofill address direction
                            readOnly
                        />

                        <label className="text-sm font-medium text-[#B65F50]" htmlFor="building">Building</label>
                        <input
                            id="building"
                            type="text"
                            className="p-2 border rounded text-[#B65F50]"
                            value={user?.address?.building || ''} // Autofill building
                            readOnly
                        />

                        <label className="text-sm font-medium text-[#B65F50]" htmlFor="floor">Floor</label>
                        <input
                            id="floor"
                            type="text"
                            className="p-2 border rounded text-[#B65F50]"
                            value={user?.address?.floor || ''} // Autofill floor
                            readOnly
                        />
                    </form>
                </div>

                {/* Right Side: Cart Summary */}
                <div className="lg:w-1/3 bg-white  h-fit shadow-md rounded-lg p-6 ml-10">
                    <h3 className="text-2xl font-semibold text-[#B65F50] mb-4">Your Cart Items</h3>
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center mb-4 text-[#B65F50]">
                            <div>
                                <h4 className="text-lg">{item.product.name}</h4>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                            <p>${item.product.price * item.quantity}</p>
                        </div>
                    ))}
                    <hr className="my-4" />
                    <div className="flex justify-between font-bold text-[#B65F50]">
                        <span>Total Price:</span>
                        <span>${totalPrice}</span>
                    </div>

                    {/* Checkout Button */}
                    <button
                        onClick={() => console.log('Proceeding to payment...')}
                        className="w-full py-2 bg-[#B65F50] text-white rounded-lg mt-4"
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
