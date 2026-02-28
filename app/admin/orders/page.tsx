"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      // ✅ Update state without refetching everything
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Failed to update status");
    }
  }

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1>Manage Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{ border: "1px solid gray", margin: 10, padding: 10 }}
        >
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>User:</strong> {order.user?.email || "N/A"}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          <p><strong>Status:</strong> {order.status}</p>

          <select
            value={order.status}
            onChange={(e) => updateStatus(order.id, e.target.value)}
          >
            <option value="pending">pending</option>
            <option value="shipped">shipped</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}
