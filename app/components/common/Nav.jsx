import Link from "next/link";
import React from 'react'
import { ChevronDown } from 'lucide-react';

const Nav = () => {
  return (
    <nav className="py-3">
    <div className='container flex items-center justify-center gap-9'>
      <Link href='/' className="text-[17px] text-gray-800 font[600] hover:text-primary">Home</Link>


<div className="relative group z-50">
  <Link
    href="/"
    className="text-[17px] text-gray-800 hover:text-primary flex items-center gap-1"
  >
    Hair Care
    <ChevronDown
      size={18}
      className="transition-transform duration-200 group-hover:rotate-180"
    />
  </Link>

  <div
    className="
      absolute top-full left-0 mt-2 w-56
      bg-white rounded-md shadow-lg border
      opacity-0 invisible translate-y-2
      group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
      transition-all duration-200
      z-50
    "
  >
    <Link href="/" className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100 hover:text-primary">
     All Hair Care Products
    </Link>
    <Link href="/" className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100 hover:text-primary">
      Hair Growth
    </Link>
    <Link href="/" className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100 hover:text-primary">
      Hair Nourishment
    </Link>
    <Link href="/" className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100 hover:text-primary">
     Hair Fall Control
    </Link>
   
  </div>
</div>

<div className="relative group z-50"> 
       <Link href='/' className="text-[17px] text-gray-800 hover:text-primary flex items-center gap-1">Skin Care
        <ChevronDown
      size={18}
      className="transition-transform duration-200 group-hover:rotate-180"
    />
      </Link>
       <div
    className="
      absolute top-full left-0 mt-2 w-56
      bg-white rounded-md shadow-lg border
      opacity-0 invisible translate-y-2
      group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
      transition-all duration-200
      z-50
    "
  >
    <Link href="/" className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100 hover:text-primary">
     All Skin Care Products
    </Link>
    <Link href="/" className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100 hover:text-primary">
      Face Wash
    </Link>
    <Link href="/" className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100 hover:text-primary">
      Skin Serums
    </Link>
    <Link href="/" className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-100 hover:text-primary">
     Face Mists
    </Link>
   
  </div>
      </div>

      <Link href='/' className="text-[17px] text-gray-800 font[600] hover:text-primary">Crystals</Link>
      <Link href='/' className="text-[17px] text-gray-800 font[600] hover:text-primary">Crystal Home Decor</Link>
      <Link href='/' className="text-[17px] text-gray-800 font[600] hover:text-primary">Gifting Collection</Link>
      <Link href='/' className="text-[17px] text-gray-800 font[600] hover:text-primary">Money saving Combos</Link>
      <Link href='/' className="text-[17px] text-gray-800 font[600] hover:text-primary">Fragrances</Link>
      <Link href='/' className="text-[17px] text-gray-800 font[600] hover:text-primary">Track Order</Link>
      <Link href='/' className="text-[17px] text-gray-800 font[600] hover:text-primary">Feedback</Link>
      <Link href='/' className="text-[17px] text-gray-800 font[600] hover:text-primary">Contact</Link>

    </div>
    </nav>
  )
}

export default Nav;
