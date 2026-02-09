"use client";

import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import Nav from "./Nav";
import { User, Heart, ShoppingCart, LogOut } from "lucide-react";
import { useShop } from "@/app/context/ShopContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { cart, wishlist } = useShop();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <header className="py-3 border-b border-[rgba(0,0,0,0.1)] w-[99%]">
        <div className="container flex items-center justify-between">
          <div className="logo">
            <Link href={"/"}>
              <Image
                className="h-20.5 w-full mx-auto"
                width={100}
                height={100}
                src="/images/store-logo.png"
                alt="Store Logo"
              />
            </Link>
          </div>
          <Search />
          <div className="flex items-center gap-5">
            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <span className="font-serif text-[17px]">
                    Hi, {user?.firstName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:text-primary font-serif text-[17px] cursor-pointer"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href={"/login"}
                  className="hover:text-primary font-serif text-[18px]"
                >
                  Login
                </Link>
                <User size={25} />
                <span>|</span>
                <Link
                  href={"/register"}
                  className="hover:text-primary font-serif text-[18px]"
                >
                  Register
                </Link>
              </div>
            )}

            <div className="flex items-center gap-6">
              <Link href="/wishlist">
                <div className="relative w-10 h-10 flex items-center justify-center group">
                  {wishlist?.products?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#DC2626] min-w-5 h-5 px-1 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {wishlist.products.length}
                    </span>
                  )}
                  <Heart
                    size={32}
                    className="text-gray-700 group-hover:text-primary transition-colors"
                    fill={wishlist?.products?.length > 0 ? "#DC2626" : "none"}
                  />
                </div>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <div className="relative w-10 h-10 flex items-center justify-center group">
                  {cart?.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#DC2626] min-w-5 h-5 px-1 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {cart.totalItems}
                    </span>
                  )}
                  <ShoppingCart
                    size={32}
                    className="text-gray-700 group-hover:text-primary transition-colors"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <Nav />
    </>
  );
}