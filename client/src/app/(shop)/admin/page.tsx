"use client";

import { useRouter } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";

export default function AdminPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["ADMIN"]}>
        <div>
          <h1>Admin Panel</h1>
          <br />

          <button
            onClick={() => router.push("/admin/manage-products")}
            className="cursor-pointer"
          >
            Manage Products
          </button>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
