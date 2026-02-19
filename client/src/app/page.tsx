"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function RedirectByRole() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (user.role === "ADMIN") {
      router.replace("/admin");
    } else {
      router.replace("/products");
    }
  }, [user, router]);

  return null;
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <RedirectByRole />
    </ProtectedRoute>
  );
}
