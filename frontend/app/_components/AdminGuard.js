"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_context/AuthContext";

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login");
      else if (user.role !== "admin") router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "admin")
    return <p className="text-center mt-10">Loading…</p>;

  return children;
}
