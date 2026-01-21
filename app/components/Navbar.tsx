"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cart }=useCart();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="relative">
  <Link href="/cart" className="hover:text-white transition">
    Cart
  </Link>

  {cart.length > 0 && (
    <span className="
      absolute 
      -top-2 
      -right-3 
      bg-red-600 
      text-white 
      text-xs 
      font-bold 
      w-5 
      h-5 
      flex 
      items-center 
      justify-center 
      rounded-full
      animate-pulse
    ">
      {cart.length}
    </span>
  )}
</div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/products" className="hover:text-white transition">Products</Link>
          <Link href="/cart" className="hover:text-white transition">Cart</Link>
          <Link
            href="/login"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-gray-800 px-6 py-6 flex flex-col gap-6 text-gray-300">
          <Link onClick={() => setOpen(false)} href="/">Home</Link>
          <Link onClick={() => setOpen(false)} href="/products">Products</Link>
          <div className="relative w-fit">
  <Link onClick={() => setOpen(false)} href="/cart">
    Cart
  </Link>

  {cart.length > 0 && (
    <span className="
      absolute 
      -top-2 
      -right-3 
      bg-red-600 
      text-white 
      text-xs 
      font-bold 
      w-5 
      h-5 
      flex 
      items-center 
      justify-center 
      rounded-full
    ">
      {cart.reduce((sum, item) => sum + item.quantity, 0)}

    </span>
  )}
</div>

          <Link
            onClick={() => setOpen(false)}
            href="/login"
            className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-center"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
