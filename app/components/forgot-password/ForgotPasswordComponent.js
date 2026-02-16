"use client";

import React from "react";
import Link from "next/link";

const ForgotPasswordComponent = () => {
  return (
    <main className="w-full max-w-md mx-auto p-6 mt-25">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="p-4 sm:p-7">
          
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Forgot password?
            </h1>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </div>

  
          <div className="mt-5">
            <form>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 shadow-sm outline-none"
                    />
                  </div>
                </div>

               
                <button
                  type="submit"
                   className="w-full inline-flex justify-center items-center rounded-md
              bg-indigo-600 px-4 py-3 text-base font-semibold text-white
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reset password
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>


    </main>
  );
};

export default ForgotPasswordComponent;
