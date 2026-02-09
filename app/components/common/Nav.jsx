import Link from "next/link";
import React from 'react'
import { ChevronDown } from 'lucide-react';

const Nav = () => {
  return (
    <nav className="py-4 border-b border-gray-200">
      <div className='container mx-auto px-4 flex items-center justify-between'>
        <Link href='/' className="text-[15px] text-gray-800 font-medium hover:text-primary transition-colors">
          Home
        </Link>

        <div className="relative group">
          <Link
            href="/"
            className="text-[15px] text-gray-800 font-medium hover:text-primary flex items-center gap-1 transition-colors"
          >
            Hair Care
            <ChevronDown
              size={16}
              className="transition-transform duration-200 group-hover:rotate-180"
            />
          </Link>

          <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
            <div className="py-2">
              <Link href="/" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                All Hair Care Products
              </Link>
              <Link href="/" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                Hair Growth
              </Link>
              <Link href="/" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                Hair Nourishment
              </Link>
              <Link href="/" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                Hair Fall Control
              </Link>
            </div>
          </div>
        </div>

        <div className="relative group">
          <Link href='/' className="text-[15px] text-gray-800 font-medium hover:text-primary flex items-center gap-1 transition-colors">
            Skin Care
            <ChevronDown
              size={16}
              className="transition-transform duration-200 group-hover:rotate-180"
            />
          </Link>
          
          <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
            <div className="py-2">
              <Link href="/" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                All Skin Care Products
              </Link>
              <Link href="/" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                Face Wash
              </Link>
              <Link href="/" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                Skin Serums
              </Link>
              <Link href="/" className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                Face Mists
              </Link>
            </div>
          </div>
        </div>

        <Link href='/' className="text-[15px] text-gray-800 font-medium hover:text-primary transition-colors">
          Crystals
        </Link>
        <Link href='/' className="text-[15px] text-gray-800 font-medium hover:text-primary transition-colors">
          Money Saving Combos
        </Link>
        <Link href='/' className="text-[15px] text-gray-800 font-medium hover:text-primary transition-colors">
          Fragrances
        </Link>
        <Link href='/' className="text-[15px] text-gray-800 font-medium hover:text-primary transition-colors">
          Track Order
        </Link>
        <Link href='/' className="text-[15px] text-gray-800 font-medium hover:text-primary transition-colors">
          Feedback
        </Link>
        <Link href='/' className="text-[15px] text-gray-800 font-medium hover:text-primary transition-colors">
          Contact
        </Link>
      </div>
    </nav>
  )
}

export default Nav;