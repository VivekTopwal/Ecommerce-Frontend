"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Linkedin, Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribing:", email);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 via-white to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/images/store-logo.png"
                alt="Store Logo"
                width={140}
                height={60}
                className="object-contain"
              />
            </Link>

            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs">
              Premium products, trusted quality, and seamless shopping
              experience — crafted for modern lifestyles.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="#"
                aria-label="Instagram"
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                <Instagram size={18} />
              </Link>

              <Link
                href="#"
                aria-label="Facebook"
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                <Facebook size={18} />
              </Link>

              <Link
                href="#"
                aria-label="Twitter"
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                <Twitter size={18} />
              </Link>

              <Link
                href="#"
                aria-label="LinkedIn"
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-5">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              {["About Us", "Careers", "Press & Media", "Blog", "Partners"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-5">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "Help Center",
                "Safety Information",
                "Cancellation Options",
                "Contact Us",
                "Accessibility",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-80">
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-3">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Get product updates, offers & exclusive drops directly in your
              inbox.
            </p>
            <div className="flex items-center mt-4">
              <input
                type="text"
                className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none text-gray-500"
                placeholder="Your email"
              />
              <button className="flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r">
                <svg
                  className="w-4 h-4 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 12H5m14 0-4 4m4-4-4-4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear}{" "}
            <span className="text-gray-900 font-medium">Mindful Living</span>.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">
            {["Privacy Policy", "Terms", "Sitemap"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
