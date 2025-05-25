"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaHome, FaUsers, FaShoppingCart, FaClipboardList, FaTachometerAlt } from "react-icons/fa";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useUser } from "../context/authContext"; // Make sure this path is correct

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Controls mobile menu
  const {logout } = useUser(); // Correct usage here

  return (
    <div className="flex ">
      {/* Sidebar */}
      <div
        className={`bg-[#892D20] text-white fixed h-screen w-64 z-10 p-6 
                    transition-all duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-64"} 
                    md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center">
          
          <h2 className="text-xl font-bold mt-2 text-white">Douluxme</h2>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col justify-between h-full">

       
        <div className="flex flex-col mt-10 gap-6 text-lg">
          <Link href="/" className="flex items-center gap-3 hover:text-gray-300 transition">
            <FaHome className="text-lg" /> Home
          </Link>
          <Link href="/admin" className="flex items-center gap-3 hover:text-gray-300 transition">
            <FaTachometerAlt className="text-lg" /> Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 hover:text-gray-300 transition">
            <FaUsers className="text-lg" /> Users
          </Link>
          <Link href="/admin/feedbacks" className="flex items-center gap-3 hover:text-gray-300 transition">
            <FaClipboardList className="text-lg" /> Feedbacks
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 hover:text-gray-300 transition">
            <FaShoppingCart className="text-lg" /> Products
          </Link>
          <Link href="/admin/chocolates" className="flex items-center gap-3 hover:text-gray-300 transition">
            <FaShoppingCart className="text-lg" /> Chocolates
          </Link>
          <Link href="/admin/nuts" className="flex items-center gap-3 hover:text-gray-300 transition">
            <FaShoppingCart className="text-lg" /> Nuts
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 hover:text-gray-300 transition">
            <FaShoppingCart className="text-lg" /> Categories
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 hover:text-gray-300 transition">
            <FaClipboardList className="text-lg" /> Orders
          </Link>
          </div>
          <div>
          <button onClick={logout} className="flex items-center gap-3 hover:text-gray-300 transition text-left p-2 mb-30">
            <FiLogOut className="text-lg" /> Logout
          </button>
          </div>
       
      </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="absolute top-5 left-5 md:hidden bg-[#A68F7B] text-white p-2 rounded focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <div className={`flex-1 p-4 transition-all duration-300 ${isOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        {/* Page content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
