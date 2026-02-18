"use client";

import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      {children}
    </CartProvider>
  );
}
