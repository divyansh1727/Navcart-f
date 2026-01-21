"use client";

import Grid from "../components/Grid";
import { useCart } from "../context/CartContext";

export default function NavigatePage() {
  const { cart } = useCart();

  // Map products to positions in grid (static for now)
  const productPositions = cart.map((item, idx) => ({
    name: item.name,
    position: { x: idx % 5, y: Math.floor(idx / 5) }, // simple mapping
  }));

  // Example blocked cells
  const blocked = [
    { x: 1, y: 2 },
    { x: 3, y: 1 },
  ];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center pt-28 px-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">NavCart Smart Route 🚀</h1>

      {cart.length === 0 ? (
        <p className="text-gray-400 text-lg">Add products to cart to see the optimal path!</p>
      ) : (
        <Grid size={5} products={productPositions} blocked={blocked} />
      )}

      <div className="mt-8 text-gray-400 max-w-xl text-center">
        The yellow cells show the computed path to collect your items and reach the exit efficiently.
      </div>
    </main>
  );
}
