"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

function HomeContent() {
  const { user, logout } = useAuth();

  return (
    <main>
      <h1>Ecommerce v1</h1>
      <p>Welcome {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </main>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
