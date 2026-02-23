"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
const placeOrder = async () => {
  if (cart.length === 0) return;

  setLoading(true);

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, total }),
    });

    if (!res.ok) throw new Error("Order failed");

    const order = await res.json();   // 🔥 get created order

    clearCart();

    // 🔥 Send order id to success page
    router.push(`/success?orderId=${order.id}`);
  } catch (error) {
    alert("Something went wrong while placing order");
    setLoading(false);
  }
};


  // 🔒 Protect page
  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty 🛒</h1>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Go Back Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 pt-28 pb-16">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">Checkout 💳</h1>

        {/* Order Summary */}
        <div className="bg-[#020617] border border-gray-800 rounded-2xl p-8 space-y-6">

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-gray-800 pb-4"
            >
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-400">
                  ₹ {item.price} × {item.quantity}
                </p>
              </div>

              <p className="font-bold">
                ₹ {item.price * item.quantity}
              </p>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between text-2xl font-bold pt-6">
            <span>Total</span>
            <span className="text-blue-400">₹ {total}</span>
          </div>

          {/* Place Order */}
          <button
            disabled={loading}
            onClick={placeOrder}
            className={`w-full mt-6 py-4 rounded-xl transition text-lg font-semibold shadow-lg
              ${loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"}
            `}
          >
            {loading ? "Placing Order..." : "Place Order 🚀"}
          </button>
        </div>
      </div>
    </main>
  );
}
