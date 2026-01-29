"use client";

import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import Nav from "./Nav";
import { User, Heart, ShoppingCart } from "lucide-react";
export default function Header() {
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
            <div className="flex items-center gap-3">
              <Link href={"/login"} className="hover:text-primary font-serif text-[18px]">
                Login
              </Link>
              <User size={25} />
              <span>|</span>
              <Link href={"/register"} className="hover:text-primary font-serif text-[18px]">
                Register
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/wishlist">
                <div className="relative w-10 h-10 flex items-center justify-center group">
                  <span className="absolute top-0 right-0 bg-[#DC2626] w-5 h-5 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                  <Heart size={32} className="text-gray-700 group-hover:text-primary"/>
                </div>
              </Link>

              <Link href="/cart">
                <div className="relative w-10 h-10 flex items-center justify-center group">
                  <span className="absolute top-0 right-0 bg-[#DC2626] w-5 h-5 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                  <ShoppingCart size={32} className="text-gray-700 group-hover:text-primary" />
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
