"use client";

import { Truck, Star, ShieldCheck } from "lucide-react";
import { Shippori_Mincho } from "next/font/google";

const mincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Features() {
  return (
    <section className="w-full bg-[#f7f1ec] border-t border-b border-black mt-3">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-orange-500 text-orange-500">
              <Truck className="w-5 h-5" />
            </span>
             <p className={`text-[25px] text-black ${mincho.className}`}> Fast shipping</p>
         
          </div>

          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-orange-500 text-orange-500">
              <Star className="w-5 h-5" />
            </span>
            <p className={`text-[25px] text-black ${mincho.className}`}>Highly-rated</p>
          
          </div>

          <div className="flex items-center justify-center md:justify-end gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-orange-500 text-orange-500">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <p className={`text-[25px] text-black ${mincho.className}`}>Secure payments</p>
        
          </div>

        </div>
      </div>
    </section>
  );
}
