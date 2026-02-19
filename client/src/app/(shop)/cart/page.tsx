"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    subtotal,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  if (items.length === 0) {
    return <div style={{ padding: 20 }}>Your cart is empty.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Cart</h1>
      <br />
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: 16 }}>
          <h3>{item.name}</h3>
          <div>
            <button onClick={() => decreaseQuantity(item.id)} className="cursor-pointer">
              -
            </button>
            <span style={{ margin: "0 10px" }}>{item.quantity}</span>
            <button onClick={() => increaseQuantity(item.id)} className="cursor-pointer">
              +
            </button>
          </div>

          <p>Total: ${item.price * item.quantity}</p>

          <button onClick={() => removeFromCart(item.id)} className="cursor-pointer">
            Remove
          </button>
        </div>
      ))}
      <h2>Subtotal: ${subtotal}</h2>
      {subtotal > 0 && (
        <div style={{ marginTop: 20 }}>
          <Link href="/checkout">
            <button className="cursor-pointer">Proceed to Checkout</button>
          </Link>
        </div>
      )}
      <br />
      <button onClick={clearCart} className="cursor-pointer">
        Clear Cart
      </button>
    </div>
  );
}
