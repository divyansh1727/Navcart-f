"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const updated = await fetch("/api/orders").then((res) => res.json());
    setOrders(updated);
  }

  return (
    <div>
      <h1>Manage Orders</h1>

      {orders.map((order: any) => (
        <div key={order.id} style={{ border: "1px solid gray", margin: 10 }}>
          <p>Order ID: {order.id}</p>
          <p>User: {order.user?.email}</p>
          <p>Total: ${order.total}</p>
          <p>Status: {order.status}</p>

          <select
            defaultValue={order.status}
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
