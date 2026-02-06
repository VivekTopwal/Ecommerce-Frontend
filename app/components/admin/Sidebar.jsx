"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ChartBar,
  Settings,
  Flower,
  Users,
  Compass,
  User,
  ChevronRight,
  Box,
  Tags,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const [userToggled, setUserToggled] = useState(false);
  const isCatalogRoute =
    pathname.startsWith("/products") || pathname.startsWith("/categories");

  const open = isCatalogRoute || userToggled;

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center mb-10">
        <Flower className="text-orange-500" />
        <h2 className="text-xl font-bold text-orange-500 font-serif ml-2">
          Mindful Living
        </h2>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin/dashboard"
              onClick={() => setUserToggled(false)}
              className={`flex items-center px-3 py-2 rounded-md font-bold transition
                ${
                  isActive("/admin/dashboard")
                    ? "bg-teal-100 text-teal-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>

          <li>
            <button
              onClick={() => setUserToggled((prev) => !prev)}
              className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 rounded-md font-bold transition
    ${open ? "bg-gray-100 text-gray-700" : "text-gray-600 hover:bg-gray-100 "}`}
            >
              <div className="flex items-center">
                <ChartBar className="h-5 w-5 mr-3" />
                Catalog
              </div>

              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  open ? "rotate-90" : ""
                }`}
              />
            </button>

            {open && (
              <ul className="ml-10 mt-2 space-y-1">
                <li>
                  <Link
                    href="/admin/products"
                     onClick={() => setUserToggled(true)}
                    className={`flex items-center px-3 py-2 text-sm rounded-md font-bold transition
                      ${
                        isActive("/admin/products")
                          ? "bg-teal-100 text-teal-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Box className="h-4 w-4 mr-2" />
                    Products
                  </Link>
                </li>

                <li>
                  <Link
                    href="/categories"
                     onClick={() => setUserToggled(true)}
                    className={`flex items-center px-3 py-2 text-sm rounded-md font-bold transition
                      ${
                        isActive("/categories")
                          ? "bg-teal-100 text-teal-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <Tags className="h-4 w-4 mr-2" />
                    Categories
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {[
            { href: "/customers", label: "Customers", icon: Users },
            { href: "/orders", label: "Orders", icon: Compass },
            { href: "/staff", label: "Our Staff", icon: User },
            { href: "/settings", label: "Settings", icon: Settings },
          ].map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center px-3 py-2 rounded-md font-bold transition
                  ${
                    isActive(href)
                      ? "bg-teal-100 text-teal-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <button className="mt-auto bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
