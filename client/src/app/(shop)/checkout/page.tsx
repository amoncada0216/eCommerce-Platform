"use client";

import { useState } from "react";

import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

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

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          name="addressLine1"
          value={form.addressLine1}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
        <input
          name="state"
          value={form.state}
          placeholder="State"
          onChange={handleChange}
          required
        />
        <input
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          placeholder="Postal Code"
          required
        />
        <input
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />

        <button type="submit">Submit Order</button>
      </form>

      <h2>Order Summary</h2>

      {items.length === 0 && <p>Your cart is empty.</p>}

      {items.map((item) => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>
            {item.quantity} × ${item.price}
          </span>
        </div>
      ))}

      <p>Subtotal: ${subtotal.toFixed(2)}</p>
    </div>
  );
}
