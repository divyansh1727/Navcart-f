"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (!res.ok) {
  throw new Error(data.error || "Order not found");
}

        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading || !order) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-2xl">Loading your order...</h1>
    </main>
  );
}

if (!order.items || order.items.length === 0) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-xl text-gray-400">
        This order has no items.
      </h1>
    </main>
  );
}


  return (
    <main className="min-h-screen bg-black text-white px-6 pt-28 pb-16">
      <div className="max-w-3xl mx-auto text-center">

        <div className="mb-10">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-green-400 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-400">
            Thank you for shopping with NavCart 🚀
          </p>
        </div>

        <div className="bg-[#020617] border border-gray-800 rounded-2xl p-8 text-left space-y-6">

          <div className="flex justify-between text-sm text-gray-400">
            <span>Order ID</span>
            <span className="font-mono text-white">{order.id}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <span>Date</span>
            <span className="text-white">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="pt-4 border-t border-gray-700 space-y-4">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-400 text-sm">
                    ₹ {item.price} × {item.quantity}
                  </p>
                </div>

                <p className="font-bold">
                  ₹ {item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-2xl font-bold pt-6 border-t border-gray-700">
            <span>Total Paid</span>
            <span className="text-blue-400">₹ {order.total}</span>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-6">
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            🛍️ Continue Shopping
          </button>

          <button
            onClick={() => router.push("/orders")}
            className="px-8 py-3 bg-purple-600 rounded-xl hover:bg-purple-700"
          >
            📦 View My Orders
          </button>
        </div>
      </div>
    </main>
  );
}
