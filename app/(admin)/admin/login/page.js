"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("🔐 Attempting admin login with:", formData.email);

    try {
      const result = await adminLogin(formData.email, formData.password);

      console.log("Login result:", result);

      if (result.success) {
        toast.success("Admin login successful!");
        console.log("Redirecting to admin dashboard...");
        router.push("/admin/dashboard");
      } else {
        const errorMsg = result.message || "Invalid admin credentials";
        console.error("Login failed:", errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Admin login error:", error);
      const errorMsg = "An error occurred during login. Check console for details.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
              <Shield className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Admin Login
          </h2>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Secure access for administrators only
          </p>
        </div>

   
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
       
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Admin Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@store.com"
              required
              autoFocus
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm
                border-gray-300 placeholder-gray-400
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm
                border-gray-300 placeholder-gray-400
                dark:bg-gray-700 dark:border-gray-600 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

    
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center rounded-md
              bg-indigo-600 px-4 py-3 text-base font-semibold text-white
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in as Admin"
            )}
          </button>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-xs text-center text-gray-500">
            Default credentials: admin@store.com / admin123
          </p>
          <Link
            href="/login"
            className="text-sm text-center block text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            ← Back to user login
          </Link>
        </div>
      </div>
    </div>
  );
}