"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div style={{ padding: 40 }}>
      <h1>Order Successful</h1>

      <p>Your order has been placed successfully.</p>

      {orderId && (
        <p>
          Order ID: <strong>{orderId}</strong>
        </p>
      )}

      <br />

      <Link href="/">Continue Shopping</Link>
    </div>
  );
}
