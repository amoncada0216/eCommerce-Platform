"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid reset link.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await api.post("/api/v1/auth/reset-password", {
        token,
        newPassword: password,
      });

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setMessage("Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
