"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["ADMIN"]}>
        <div>Admin Panel</div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
