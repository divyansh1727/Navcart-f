"use client";

import { useCart } from "../context/CartContext";
import Grid from "../components/Grid";

export default function NavigationPage() {
  const { cart } = useCart();

  // Convert cart items → grid products
  const navProducts = cart.map(item => ({
    name: item.name,
    position: item.position,
  }));

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center pt-24">
      <h1 className="text-3xl font-bold mb-6">Store Navigation 🧭</h1>

      <Grid
        size={5}
        products={navProducts}
        blocked={[
          { x: 2, y: 2 },
          { x: 1, y: 4 },
        ]}
      />
    </main>
  );
}
