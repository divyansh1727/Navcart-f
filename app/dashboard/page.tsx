"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);     // ✅ If API returns array
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders);  // ✅ If wrapped
        } else {
          setOrders([]);       // fallback
        }
      });
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Your Orders</h1>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginTop: "16px",
          }}
        >
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Total:</b> ₹{order.total}</p>
          <p><b>Date:</b> {new Date(order.createdAt).toDateString()}</p>

          <ul>
            {order.items?.map((item: any) => (
              <li key={item.id}>
                {item.name} × {item.quantity} (₹{item.price})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
