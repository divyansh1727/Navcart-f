"use client";

import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const data = await fetch("/api/products").then((res) => res.json());
    setProducts(data);
  }

  async function createProduct() {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: parseFloat(price) }),
    });

    setName("");
    setPrice("");
    fetchProducts();
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  }

  return (
    <div>
      <h1>Manage Products</h1>

      <div>
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={createProduct}>Add Product</button>
      </div>

      {products.map((product: any) => (
        <div key={product.id} style={{ border: "1px solid gray", margin: 10 }}>
          <p>{product.name}</p>
          <p>${product.price}</p>
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
