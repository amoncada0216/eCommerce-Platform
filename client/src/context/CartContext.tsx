"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Stable in-memory cache
let cartCache: CartItem[] = [];

function readCart(): CartItem[] {
  if (typeof window === "undefined") return cartCache;

  const stored = localStorage.getItem("cart");
  const parsed = stored ? JSON.parse(stored) : [];

  // Only update cache if changed
  if (JSON.stringify(parsed) !== JSON.stringify(cartCache)) {
    cartCache = parsed;
  }

  return cartCache;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function writeCart(updated: CartItem[]) {
  cartCache = updated;
  localStorage.setItem("cart", JSON.stringify(updated));
  window.dispatchEvent(new Event("storage"));
}

const EMPTY_CART: CartItem[] = [];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, readCart, () => EMPTY_CART);

  function addToCart(product: Omit<CartItem, "quantity">) {
    const existing = items.find((i) => i.id === product.id);

    let updated;

    if (existing) {
      if (existing.quantity >= existing.stock) return;
      updated = items.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
      );
    } else {
      updated = [...items, { ...product, quantity: 1 }];
    }

    writeCart(updated);
  }

  function removeFromCart(id: string) {
    writeCart(items.filter((i) => i.id !== id));
  }

  function clearCart() {
    writeCart([]);
  }

  function increaseQuantity(id: string) {
    writeCart(
      items.map((i) =>
        i.id === id && i.quantity < i.stock ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  }

  function decreaseQuantity(id: string) {
    writeCart(
      items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );
  }

  const totalItems = items.reduce((a, i) => a + i.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);

  const value = {
    items,
    totalItems,
    subtotal,
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
