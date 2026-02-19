
"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordComponent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setEmailSent(true);
        toast.success(
          "Password reset link sent! Please check your email."
        );
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-600" size={32} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>

            <p className="text-gray-600 mb-6">
              We&apos;ve sent a password reset link to{" "}
              <strong className="text-gray-900">{email}</strong>
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Check your inbox (and spam folder)</li>
                <li>Click the reset link in the email</li>
                <li>Create your new password</li>
              </ol>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              The link will expire in 30 minutes for security reasons.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Try Another Email
              </button>

              <Link
                href="/login"
                className="block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Login</span>
          </Link>

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-indigo-600" size={24} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>

            <p className="text-gray-600 text-sm">
              No worries! Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-800 text-center">
            <strong>🔒 Security Tip:</strong> For your protection, we won&apos;t
            reveal if an account exists with this email.
          </p>
        </div>
      </div>
    </main>
  );
}