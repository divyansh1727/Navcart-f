"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-2xl">Loading orders...</h1>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">No Orders Yet 📦</h1>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            Start Shopping 🛍️
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 pt-28 pb-16">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">My Orders 📦</h1>

        <div className="space-y-8">

          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#020617] border border-gray-800 rounded-2xl p-6 shadow-lg"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="font-mono">{order.id}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">Date</p>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* ITEMS */}
              <div className="space-y-3 border-t border-gray-700 pt-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-400">
                        ₹ {item.price} × {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold">
                      ₹ {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-700 mt-4">
                <p className="text-xl font-bold">Total</p>
                <p className="text-xl font-bold text-blue-400">
                  ₹ {order.total}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </main>
  );
}
