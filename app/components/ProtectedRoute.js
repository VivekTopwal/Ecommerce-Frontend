"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated()) {
      router.push(adminOnly ? "/admin/login" : "/login");
      return;
    }

    if (adminOnly && !isAdmin()) {
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, router, adminOnly, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  if (adminOnly && !isAdmin()) {
    return null;
  }

  return <>{children}</>;
}