"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post("/api/v1/auth/forgot-password", { email });

      setMessage("A reset link has been sent.");
    } catch {
      // Do not reveal errors
      setMessage("A reset link has been sent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Forgot Password</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
