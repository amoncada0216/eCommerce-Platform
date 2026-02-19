"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/products");
  }

  return (
    <nav className="w-full border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg">
          eCommerce
        </Link>

        <div className="flex items-center gap-6">
          {user?.role === "ADMIN" && <Link href="/admin">Admin Panel</Link>}

          <Link href="/products">Products</Link>

          <Link href="/cart" className="relative">
            Cart
            {totalItems > 0 && <span className="ml-2">{totalItems}</span>}
          </Link>

          {user ? (
            <button onClick={handleLogout} className="cursor-pointer">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
