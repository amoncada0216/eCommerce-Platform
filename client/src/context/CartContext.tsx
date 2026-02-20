"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./AuthContext";
import { api } from "@/lib/api";

type CartItem = {
  cartItemId?: string;
  id: string; // product id
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
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  increaseQuantity: (id: string) => Promise<void>;
  decreaseQuantity: (id: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Initial load
  useEffect(() => {
    async function initialize() {
      if (user) {
        // Logged in → fetch DB cart
        const res = await api.get("/api/v1/cart");
        setItems(res.data.items ?? []);
      } else {
        // Logged out → load localStorage
        const raw = localStorage.getItem("cart");
        const local = raw ? JSON.parse(raw) : [];
        setItems(local);
      }
    }

    initialize();
  }, [user]);

  // Persist to localStorage when logged out
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, user]);

  // Merge on login
  useEffect(() => {
    if (!user) return;

    const raw = localStorage.getItem("cart");
    const local: CartItem[] = raw ? JSON.parse(raw) : [];

    if (!local.length) return;

    async function merge() {
      await api.post("/api/v1/cart/merge", {
        items: local.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      localStorage.removeItem("cart");

      const res = await api.get("/api/v1/cart");
      setItems(res.data.items ?? []);
    }

    merge();
  }, [user]);

  async function addToCart(product: Omit<CartItem, "quantity">) {
    if (!user) {
      const existing = items.find((i) => i.id === product.id);

      if (existing) {
        if (existing.quantity >= existing.stock) return;
        setItems(
          items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        );
      } else {
        setItems([...items, { ...product, quantity: 1 }]);
      }
    } else {
      const existing = items.find((i) => i.id === product.id);

      // Prevent exceeding stock
      if (existing && existing.quantity >= existing.stock) return;

      await api.post("/api/v1/cart/add-cart-item", {
        productId: product.id,
      });

      const res = await api.get("/api/v1/cart");
      setItems(res.data.items ?? []);
    }
  }

  async function increaseQuantity(id: string) {
    if (!user) {
      setItems(
        items.map((i) =>
          i.id === id && i.quantity < i.stock ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      const item = items.find((i) => i.id === id);
      if (!item?.cartItemId) return;

      // prevent invalid request
      if (item.quantity >= item.stock) return;

      await api.post(`/api/v1/cart/increase/${item.cartItemId}`);
      const res = await api.get("/api/v1/cart");
      setItems(res.data.items ?? []);
    }
  }

  async function decreaseQuantity(id: string) {
    if (!user) {
      setItems(
        items
          .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      );
    } else {
      const item = items.find((i) => i.id === id);
      if (!item?.cartItemId) return;

      await api.post(`/api/v1/cart/decrease/${item.cartItemId}`);
      const res = await api.get("/api/v1/cart");
      setItems(res.data.items ?? []);
    }
  }

  async function removeFromCart(id: string) {
    if (!user) {
      setItems(items.filter((i) => i.id !== id));
    } else {
      const item = items.find((i) => i.id === id);
      if (!item?.cartItemId) return;

      await api.delete(`/api/v1/cart/remove/${item.cartItemId}`);
      const res = await api.get("/api/v1/cart");
      setItems(res.data.items ?? []);
    }
  }

  async function clearCart() {
    if (!user) {
      setItems([]);
    } else {
      await api.delete("/api/v1/cart/clear");
      setItems([]);
    }
  }

  const totalItems = items.reduce((a, i) => a + i.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
