"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = () => {
    // Fake order placement
    router.push("/success");
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold">Your cart is empty 🛒</h1>
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
            onClick={placeOrder}
            className="w-full mt-6 py-4 bg-green-600 rounded-xl hover:bg-green-700 transition text-lg font-semibold shadow-lg"
          >
            Place Order 🚀
          </button>
        </div>
      </div>
    </main>
  );
}
