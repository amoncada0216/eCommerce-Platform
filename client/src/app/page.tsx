"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

function HomeContent() {
  const { user, logout } = useAuth();

  return (
    <main>
      <p>Welcome {user?.email}</p>
      <button onClick={logout} className="cursor-pointer">Logout</button>
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
