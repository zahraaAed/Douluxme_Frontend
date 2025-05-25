"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser } from "../context/authContext";
import { useCart } from "../context/cartContext";
import { FaShoppingCart } from "react-icons/fa";

const Header = () => {
  const { user, logout } = useUser();
  const { cartCount, toggleCart, isCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/shop", label: "Shop" },
    { href: "/contactus", label: "Contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-10 py-4 md:py-6 bg-[#FFFAF4] shadow-md">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <span className="font-bold text-xl cursor-pointer text-[#A9471F]">Douluxme</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-lg font-semibold">
          {navLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="relative overflow-hidden text-[#A9471F] after:absolute after:left-0 after:bottom-0 after:block after:h-[2px] after:w-0 after:bg-[#A9471F] hover:after:w-[75%] transition-all duration-500 ease-in-out"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side: User Auth/Profile & Cart */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {!user ? (
            <Link href="/login" className="text-sm font-medium text-[#A9471F] hover:underline">
              Login
            </Link>
          ) : (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={toggleDropdown}
                className="text-sm font-semibold text-[#A9471F]"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                Profile ▾
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50 text-sm">
                  <Link href="/orderHistory" className="block px-4 py-2 hover:bg-gray-100 text-[#A9471F]">
                    Order History
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="block px-4 py-2 hover:bg-gray-100 text-[#A9471F]">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#A9471F]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cart Icon */}
          <Link href="/cart" className="text-[#A9471F]">
          <button
            onClick={toggleCart}
            className="relative p-2 text-[#A9471F] hover:text-[#833016] transition-colors"
            aria-label="Toggle cart"
          >
            <FaShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#A9471F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
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
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white shadow-md z-50">
          <nav className="flex flex-col space-y-4 p-4 text-center text-[#B65F50]">
            {navLinks.map(({ href, label }) => (
              <Link key={label} href={href} className="text-[#A9471F]">
                {label}
              </Link>
            ))}
            {!user ? (
              <Link href="/login" className="text-[#A9471F] font-medium">
                Login
              </Link>
            ) : (
              <>
                <Link href="/orderHistory" className="text-[#A9471F] font-medium">
                  Order History
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="text-[#A9471F] font-medium">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={logout} className="text-[#A9471F] font-medium">
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Optionally: Cart Popup */}
      {/* {isCartOpen && <CartPopup onClose={toggleCart} />} */}
    </>
  );
};

export default Header;
