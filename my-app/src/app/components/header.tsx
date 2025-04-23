"use client";



import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="top-0 z-50 w-full flex justify-between items-center px-4 md:px-10 py-4 md:py-6 bg-white shadow-md fixed ">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <span className="font-bold text-xl cursor-pointer">Douluxme</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-lg font-semibold">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/totes">Shop</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Auth/Login Placeholder */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/login" className="text-sm font-medium text-[#4A8C8C] hover:underline">
            Login
          </Link>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white shadow-md z-50">
          <nav className="flex flex-col space-y-4 p-4 text-center">
            <Link href="/" className="block py-2">Home</Link>
            <Link href="/about" className="block py-2">About</Link>
            <Link href="/totes" className="block py-2">Shop</Link>
            <Link href="/contact" className="block py-2">Contact</Link>
            <Link href="/login" className="block py-2 text-[#4A8C8C] font-medium">Login</Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
