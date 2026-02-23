"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  position: { x: number; y: number };   // 🔥 shelf location
};

type CartContextType = {
  cart: Product[];
  addToCart: (
    product: Omit<Product, "quantity"> & { position: { x: number; y: number } }
  ) => void;
  removeFromCart: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);

  // 🔥 LOAD CART FROM LOCALSTORAGE ON START
  useEffect(() => {
    const stored = localStorage.getItem("navcart-cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // 🔥 SAVE CART TO LOCALSTORAGE WHENEVER IT CHANGES
  useEffect(() => {
    localStorage.setItem("navcart-cart", JSON.stringify(cart));
  }, [cart]);

  // ---------------- ADD TO CART ----------------
  const addToCart = (
    product: Omit<Product, "quantity"> & { position: { x: number; y: number } }
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ---------------- REMOVE COMPLETELY ----------------
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ---------------- INCREASE QTY ----------------
  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ---------------- DECREASE QTY ----------------
  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 🔥 CLEAR CART AFTER ORDER SUCCESS
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("navcart-cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
