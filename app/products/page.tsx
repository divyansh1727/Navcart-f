"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-8 py-24">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Browse Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="bg-[#020617] rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-600 transition shadow-lg"
          >
            <img
              src={product.image || "/placeholder.jpg"}
              alt={product.name}
              className="h-52 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-lg font-semibold">
                {product.name}
              </h3>

              <p className="mt-2 text-blue-400 font-bold">
                ₹{product.price}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="mt-5 w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
