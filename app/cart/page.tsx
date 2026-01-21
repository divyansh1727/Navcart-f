"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const router = useRouter();

  // Total price with quantity
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center bg-black text-white px-6">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty 🛒</h1>
        <p className="text-gray-400 mb-8">
          Looks like you haven’t added anything yet.
        </p>
        <Link
          href="/products"
          className="px-8 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 pt-28 pb-16">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-10">Your Cart 🛒</h1>

        {/* Items */}
        <div className="space-y-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center gap-6 bg-[#020617] border border-gray-800 rounded-2xl p-6"
            >
              {/* Image */}
              <div className="w-28 h-28 rounded-xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{item.name}</h2>
                <p className="text-gray-400 mt-2">₹ {item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-xl"
                >
                  −
                </button>

                <span className="text-xl font-bold">{item.quantity}</span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-xl"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        {/* Summary */}
<div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-gray-800 pt-8">
  <h2 className="text-2xl font-semibold">
    Total: <span className="text-blue-400">₹ {total}</span>
  </h2>

  <div className="flex gap-4">
    {/* Navigate Button */}
    <button
      onClick={() => router.push("/navigate")}
      className="px-10 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg"
    >
      🧭 Navigate My Cart
    </button>

    {/* Checkout Button */}
    <Link
      href="/checkout"
      className="px-10 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition shadow-lg"
    >
      Proceed to Checkout
    </Link>
  </div>
</div>
</div>
    </main>
  );
}
