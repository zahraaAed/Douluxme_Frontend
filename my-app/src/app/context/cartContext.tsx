// context/CartContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface CartItem {
    id: string;       
    productId: number;
    quantity: number;
}

interface CartContextType {
    carts: CartItem[];
    loading: boolean;
    error: string | null;
    addCartItem: (item: CartItem) => void;
    updateCartItem: (id: string, quantity: number) => void;
    removeCartItem: (id: string) => void;
    fetchCartData: () => void;
}
interface NewCartItem {
    productId: number;
    quantity: number;
  }
  
const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [carts, setCarts] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch cart data from API
    const fetchCartData = async () => {
        setLoading(true); // Set loading to true at the start
        try {
            const response = await axios.get('http://localhost:5000/api/carts/get',    { withCredentials: true });
            console.log(response.data); // Log the data to check its structure
            setCarts(response.data); // Set the fetched cart data
        } catch (err) {
            setError('Failed to load cart data');
            console.error(err); // Log the actual error to help diagnose
        } finally {
            setLoading(false); // Finished loading
        }
    };
    
    // Add a cart item (Create)
    const addCartItem = async (item: NewCartItem) => {
        try {
            const response = await axios.post('http://localhost:5000/api/carts/create', item, { withCredentials: true });
            setCarts((prevCarts) => [...prevCarts, response.data]);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Unknown error';
            setError(`Failed to add item to cart: ${message}`);
            console.error("Add Cart Error:", err.response || err);
        }
    };
    

    // Update a cart item (Patch)
    const updateCartItem = async (id: string, quantity: number) => {
        console.log("Updating cart item with ID:", id); // Debug line
      
        try {
          const response = await axios.patch(
            `http://localhost:5000/api/carts/update/${id}`,
            { quantity },
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
      
          console.log('Update response:', response.data);
      
          const updatedQuantity = response.data.quantity ?? quantity;
      
          setCarts((prevCarts) =>
            prevCarts.map((item) =>
              item.id === id ? { ...item, quantity: updatedQuantity } : item
            )
          );
        } catch (err: any) {
          console.error('Error updating item quantity:', err.response?.data || err.message);
          setError('Failed to update item quantity');
        }
      };
      
      

    // Remove a cart item (Delete)
    const removeCartItem = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/carts/delete/${id}`,   { withCredentials: true }); // Replace with your actual API
            setCarts((prevCarts) => prevCarts.filter((item) => item.id !== id));
        } catch (err) {
            setError('Failed to remove item from cart');
        }
    };

    // Fetch cart data when the component mounts
    useEffect(() => {
        fetchCartData();
    }, []); // Runs once when the component mounts
    console.log(carts); // Log to inspect the structure of the data returned
    
    
    return (
        <CartContext.Provider value={{ carts, loading, error, addCartItem, updateCartItem, removeCartItem, fetchCartData }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use CartContext
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
