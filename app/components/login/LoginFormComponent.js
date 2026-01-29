"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";


export default function LoginFormComponent() {
  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mt-26.25">
      <div className="text-center">
        <Image
          className="h-17.5 w-[60%] mx-auto"
          width={100}
          height={100}
          src="/images/store-logo.png"
          alt="Store Logo"
        />

        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h2>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"
          >
            Sign Up →
          </Link>
        </p>
      </div>

      <form className="space-y-6 mt-8">

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            required
            autoFocus
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm
              border-gray-300 placeholder-gray-400
              dark:bg-gray-800 dark:border-gray-600 dark:text-white
              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            type="password"
            placeholder="••••••••"
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm
              border-gray-300 placeholder-gray-400
              dark:bg-gray-800 dark:border-gray-600 dark:text-white
              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember_me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember_me"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"
          >
            Forgot your password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full inline-flex justify-center items-center rounded-md
            bg-black px-4 py-2 text-base font-medium text-white
            hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
