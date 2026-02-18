"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children: ReactNode;
  allowedRoles: string[];
};

export default function RoleGuard({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !allowedRoles.includes(user.role ?? ""))) {
      router.replace("/");
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) return null;
  if (!user) return null;
  if (!allowedRoles.includes(user.role ?? "")) return null;

  return <>{children}</>;
}
