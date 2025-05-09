"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";

type Address = {
  phone: string;
  region: string;
  address_direction: string;
  building: string;
  floor: string;
};

type SignUpData = {
  email: string;
  password: string;
  name?: string;
  address: Address;
};

const SignUp = () => {
  const [signUp, setSignUp] = useState<SignUpData>({
    email: "",
    password: "",
    name: "",
    address: {
      phone: "",
      region: "",
      address_direction: "",
      building: "",
      floor: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useRouter();


// Updated `handleInputChange` function
const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  // If the field is part of the address object
  if (name.startsWith("address.")) {
    const addressKey = name.split(".")[1] as keyof Address;  // Type `addressKey` as keyof Address
    setSignUp((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [addressKey]: value, // Properly updating the address field
      },
    }));
  } else {
    // Otherwise update the normal fields (email, password, etc.)
    setSignUp({ ...signUp, [name]: value });
  }
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://douluxme-backend.onrender.com/api/users/register",
        signUp,
        { withCredentials: true } 
      );
      console.log(response.data);
      toast.success("Registration successful! Redirecting...");

      setTimeout(() => {
        navigate.push("/login");
      }, 3000);
    }   catch (err) {
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

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFAF4] px-4 py-8">
      <div className="w-full max-w-1/2 bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center text-[#A03321] mb-8">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#A03321]">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={signUp.name || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A03321] focus:border-[#A03321] sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#A03321]">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={signUp.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A03321] focus:border-[#A03321] sm:text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#A03321]">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={signUp.password}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#A03321] focus:border-[#A03321] sm:text-sm"
              />
              <button
                type="button"
                onClick={handleShowPassword}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

       

          {/* Address Fields */}
          {["phone", "region", "address_direction", "building", "floor"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-[#A03321]">
                {field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <input
                type="text"
                id={field}
                name={`address.${field}`}
                value={signUp.address[field as keyof Address]}  // Properly type `field`
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:ring-[#A03321] focus:border-[#A03321] sm:text-sm"
              />
            </div>
          ))}

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 py-2 px-4 rounded-md shadow-md bg-[#A6CC9A] text-[#A03321] font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A03321]"
          >
            SIGN UP
          </button>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default SignUp;
