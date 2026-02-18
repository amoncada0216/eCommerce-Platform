"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/v1/auth/login", { email, password });
      setUser(res.data);
      router.push("/");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? "Logging in..." : "Login"}
        </button>
        <br />
        <br />
        <div>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
