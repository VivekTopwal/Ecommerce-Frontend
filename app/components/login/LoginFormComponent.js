"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginFormComponent() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success("Login successful!");
        
        if (result.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center">
          <Link href="/">
            <Image
              className="h-20 w-auto mx-auto cursor-pointer"
              width={120}
              height={80}
              src="/images/store-logo.png"
              alt="Store Logo"
            />
          </Link>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Sign Up →
            </Link>
          </p>
        </div>

        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
       
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="your@email.com"
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

       
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center rounded-md
              bg-indigo-600 px-4 py-3 text-base font-semibold text-white
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
              "Sign in"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}