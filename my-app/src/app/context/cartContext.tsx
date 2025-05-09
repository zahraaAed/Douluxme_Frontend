// context/CartContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import { toast } from "react-toastify";

export interface CartItem {
    id: string
    productId: number
    quantity: number
  }
  
  export interface NewCartItem {
    productId: number
    quantity: number
  }
  
  interface CartContextType {
    carts: CartItem[]
    loading: boolean
    error: string | null
    addCartItem: (item: NewCartItem) => void
    updateCartItem: (id: string, quantity: number) => void
    removeCartItem: (id: string) => void
    fetchCartData: () => void
  }
  
const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [carts, setCarts] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

  /*   const getCartItemCount = () => {
        return carts.length;  
    };
 */
    // Fetch cart data from API
    const fetchCartData = async () => {
        setLoading(true); // Set loading to true at the start
        try {
            const response = await axios.get('https://douluxme-backend.onrender.com/api/carts/get',    { withCredentials: true });
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
            const response = await axios.post('https://douluxme-backend.onrender.com/api/carts/create', item, { withCredentials: true });
            setCarts((prevCarts) => [...prevCarts, response.data]);
        } catch (err) {
          // First, ensure that the error is an AxiosError
          if (err instanceof AxiosError) {
            const message =
              err.response?.data?.message ||  // Check if the response has a message
              err.message ||                  // Fallback to the error message from AxiosError
              'Unknown error';                // Default message if no message is found
        
            console.error("Add Cart Error:", err);
        
            // Show the error message in the toast
            toast.error(message);
          } else {
            // If the error is not an instance of AxiosError, handle it as a generic error
            console.error("Non-Axios error:", err);
            toast.error('An unknown error occurred');
          }
        }
    };
    

    // Update a cart item (Patch)
    const updateCartItem = async (id: string, quantity: number) => {
        console.log("Updating cart item with ID:", id); // Debug line
      
        try {
          const response = await axios.patch(
            `https://douluxme-backend.onrender.com/api/carts/update/${id}`,
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
        }
        catch (err) {
          // First, ensure that the error is an AxiosError
          if (err instanceof AxiosError) {
            const message =
              err.response?.data?.message ||  // Check if the response has a message
              err.message ||                  // Fallback to the error message from AxiosError
              'Unknown error';                // Default message if no message is found
        
            console.error("Add Cart Error:", err);
        
            // Show the error message in the toast
            toast.error(message);
          } else {
            // If the error is not an instance of AxiosError, handle it as a generic error
            console.error("Non-Axios error:", err);
            toast.error('An unknown error occurred');
          }
        }
      };
      
      

    // Remove a cart item (Delete)
    const removeCartItem = async (id: string) => {
        try {
            await axios.delete(`https://douluxme-backend.onrender.com/api/carts/delete/${id}`,   { withCredentials: true }); // Replace with your actual API
            setCarts((prevCarts) => prevCarts.filter((item) => item.id !== id));
        } catch (err) {
          console.error('Failed to remove item from cart:', err);
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
