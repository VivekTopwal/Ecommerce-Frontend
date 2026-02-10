/* eslint-disable */
"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, isAuthenticated, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

  }, []);

  useEffect(() => {
    if (loading || !mounted) return;

    if (pathname === "/admin/login") return;

    if (!isAuthenticated()) {
      console.log("Not authenticated, redirecting to login");
      router.push("/admin/login");
      return;
    }

    if (!isAdmin()) {
      console.log("Not admin, redirecting to home");
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, router, pathname, loading, mounted]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated() || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
          <button
            onClick={() => router.push("/admin/login")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: FolderTree, label: "Categories", href: "/admin/categories" },
    { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 bg-gray-900 text-white`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="mb-8 px-4 py-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-sm text-gray-400 mt-1">
              Welcome, {user?.firstName}
            </p>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="absolute bottom-4 left-0 right-0 px-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                {menuItems.find((item) => item.href === pathname)?.label ||
                  "Admin"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
                target="_blank"
              >
                View Store
              </Link>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-0">
          {children}
   <Toaster
  position="top-center"
  reverseOrder={false}
  toastOptions={{
    duration: 3500,
    style: {
      background: "rgba(15, 23, 42, 0.95)", 
      color: "#f8fafc",
      padding: "12px 16px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow:
        "0 10px 25px rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.15)",
      backdropFilter: "blur(8px)",
    },

    success: {
      iconTheme: {
        primary: "#22c55e",
        secondary: "#f8fafc",
      },
    },

    error: {
      duration: 4500,
      iconTheme: {
        primary: "#ef4444", 
        secondary: "#f8fafc",
      },
    },

    loading: {
      iconTheme: {
        primary: "#38bdf8", 
        secondary: "#0f172a",
      },
    },
  }}
/>

          </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}