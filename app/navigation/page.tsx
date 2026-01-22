"use client";

import { useCart } from "../context/CartContext";
import Grid from "../components/Grid";

export default function NavigationPage() {
  const { cart } = useCart();

  // Convert cart items to navigation products
  const navProducts = cart.map(item => ({
    name: item.name,
    position: item.position,
  }));

  return (
    <main className="min-h-screen bg-black text-white px-10 pt-24">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Smart Store Navigation 🧭
      </h1>

      {navProducts.length === 0 ? (
        <p className="text-center text-gray-400">
          No items in cart to navigate.
        </p>
      ) : (
        <Grid
          size={6}
          products={navProducts}
          blocked={[
            { x: 2, y: 2 },
            { x: 3, y: 3 },
          ]}
        />
      )}
    </main>
  );
}
