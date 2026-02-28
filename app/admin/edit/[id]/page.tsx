"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setFormData({
        name: data.name,
        price: data.price,
      });
    }

    if (id) fetchProduct();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        price: parseFloat(formData.price as string),
      }),
    });

    router.push("/admin/products");
  }

  return (
    <div>
      <h1>Edit Product</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Product Name"
        />

        <input
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          placeholder="Price"
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}
