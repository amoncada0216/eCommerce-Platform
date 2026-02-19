"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();

  const { items, subtotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (items.length === 0) {
      setError("Cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shipping: {
          name: form.fullName,
          email: form.email,
          address: form.addressLine1,
          city: form.city,
          state: form.state,
          postal: form.postalCode,
          country: form.country,
        },
      };

      const res = await api.post("/api/v1/orders", payload, {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      });

      clearCart();
      
      setIdempotencyKey(crypto.randomUUID());
      router.push(`/checkout/success?orderId=${res.data.orderId}`);
    } catch {
      setError("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <br />
      <h2>Order Summary</h2>

      {items.length === 0 && <p>Your cart is empty.</p>}

      {items.map((item) => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>
            {item.quantity} x ${item.price}
          </span>
        </div>
      ))}

      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <br />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <br />
        <input
          name="addressLine1"
          value={form.addressLine1}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <br />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
        <br />
        <input
          name="state"
          value={form.state}
          placeholder="State"
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          placeholder="Postal Code"
          required
        />
        <br />
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />
        <br />
        <br />

        <button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? "Processing..." : "Place Order"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
