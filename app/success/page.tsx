"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();   // 🔥 runs ONCE, no reload, no loop
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-6">
      <h1 className="text-5xl font-bold mb-6 text-green-400">
        Order Placed Successfully 🎉
      </h1>

      <p className="text-gray-400 mb-10 max-w-xl">
        Your order has been placed successfully.  
        Thanks for shopping with NavCart ❤️
      </p>

      <Link
        href="/products"
        className="px-10 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
      >
        Continue Shopping
      </Link>
    </main>
  );
}
