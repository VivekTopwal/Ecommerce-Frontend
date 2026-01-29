import Image from "next/image";
import React from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from 'lucide-react';
import { Shippori_Mincho } from "next/font/google";

const mincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const ProductCard = () => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className={`text-center text-[30px] mb-8 ${mincho.className}`}>
          Pyrite Decor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          <div className="bg-white overflow-hidden shadow-sm rounded">
            <div className="relative">
              <Image
                src="/images/g1.webp"
                alt="Lapiz Peacock"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                47% off
              </span>
            </div>

            <div className="p-4 text-center space-y-2">
              <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
              <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                Lapiz Peacock
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
                Majestic | Intuitive | Empowering
              </p>
              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(3141)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                <span className="text-black">MRP: </span>
                <span className="line-through text-gray-600 mr-0.5">
                  ₹1,499.00
                </span>
                <span className="text-red-600">₹799.00</span>
              </div>

 <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>


          <div className="bg-white overflow-hidden shadow-sm rounded">
            <div className="relative">
              <Image
                src="/images/g2.webp"
                alt="Pyrite Baby Buddha"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                9% off
              </span>
            </div>

            <div className="p-4 text-center space-y-2">
              <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
              <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                Pyrite Baby Buddha
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
              Tranquility | Prosperity | Abundance
              </p>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(3141)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                <span className="text-black">MRP: </span>
                <span className="line-through text-gray-600 mr-0.5">
                  ₹1,099.00
                </span>
                <span className="text-red-600">₹999</span>
              </div>

 <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>


          <div className="bg-white overflow-hidden shadow-sm rounded">
            <div className="relative">
              <Image
                src="/images/g3.webp"
                alt="Hanumana Pyrite"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                32% off
              </span>
            </div>
          
            <div className="p-4 text-center space-y-2">
               <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
                <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
               Hanumana Pyrite
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
               Powerful | Prosperous | Divine
              </p>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(3141)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                  <span className="text-black">MRP: </span>
                <span className="line-through text-gray-800 mr-0.5">
                  ₹2,499.00
                </span>
                <span className="text-red-600">₹1699.00</span>
              </div>

  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded">
          
            <div className="relative">
              <Image
                src="/images/g4.webp"
                alt="Panchmukhi Pyrite Hanuman"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                31% off
              </span>
            </div>
           
            <div className="p-4 text-center space-y-2">
             <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
              <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                Panchmukhi Pyrite Hanuman
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
               Powerful | Prosperous | Divine
              </p>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(3141)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                 <span className="text-black">MRP: </span>
                <span className="line-through text-gray-800 mr-0.5">
                  ₹1,999.00
                </span>
                <span className="text-red-600">₹1,599.00</span>
              </div>

 <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded mt-4">
          
            <div className="relative">
              <Image
                src="/images/g5.webp"
                alt="Goddess Lakshmi Pyrite"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                5% off
              </span>
            </div>

            
              <div className="p-4 text-center space-y-2">
             <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
              <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
             Goddess Lakshmi Pyrite
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
                Money Attract | Magnetize Money
              </p>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(3141)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                <span className="text-black">MRP: </span>
                <span className="line-through text-gray-800 mr-0.5">
                  ₹1,999.00
                </span>
                <span className="text-red-600">₹1,899.00</span>
              </div>

 <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded mt-4">
          
            <div className="relative">
              <Image
                src="/images/g6.webp"
                alt="Lord Ganesha Pyrite"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                35% off
              </span>
            </div>

            
              <div className="p-4 text-center space-y-2">
             <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
              <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
             Lord Ganesha Pyrite
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
            Tranquility | Prosperity | Abundance
              </p>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(3141)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                <span className="text-black">MRP: </span>
                <span className="line-through text-gray-800 mr-0.5">
                  ₹1,999.00
                </span>
                <span className="text-red-600">₹799.00</span>
              </div>

                 <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>

         <div className="bg-white overflow-hidden shadow-sm rounded mt-4">
          
            <div className="relative">
              <Image
                src="/images/g7.webp"
                alt="Money Bowl with Lord Ganesha"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                25% off
              </span>
            </div>

            
              <div className="p-4 text-center space-y-2">
             <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
              <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
             Money Bowl with Lord Ganesha
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
              Tranquility | Prosperity | Abundance
              </p>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(3141)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                <span className="text-black">MRP: </span>
                <span className="line-through text-gray-800 mr-0.5">
                  ₹1,999.00
                </span>
                <span className="text-red-600">₹1,760.00</span>
              </div>

 <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded mt-4">
          
            <div className="relative">
              <Image
                src="/images/g8.webp"
                alt="Gayatri Mantra Pyrite"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                5% off
              </span>
            </div>

            
              <div className="p-4 text-center space-y-2">
             <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
              <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
             Gayatri Mantra Pyrite
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
               Money Attract | Abundance | Home Decor
              </p>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(3141)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                <span className="text-black">MRP: </span>
                <span className="line-through text-gray-800 mr-0.5">
                  ₹1,999.00
                </span>
                <span className="text-red-600">₹1,899.00</span>
              </div>

 <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded mt-4">
          
            <div className="relative">
              <Image
                src="/images/g9.webp"
                alt="Goddess Lakshmi Ji Pyrite"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                15% off
              </span>
            </div>

            
              <div className="p-4 text-center space-y-2">
             <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
              <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
              Goddess Lakshmi Ji Pyrite
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
              Tranquility | Prosperity | Abundance
              </p>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(41)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                <span className="text-black">MRP: </span>
                <span className="line-through text-gray-800 mr-0.5">
                  ₹1,999.00
                </span>
                <span className="text-red-600">₹1,499.00</span>
              </div>

 <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>

         <div className="bg-white overflow-hidden shadow-sm rounded mt-4">
          
            <div className="relative">
              <Image
                src="/images/g10.webp"
                alt="Money Bowl with Geode"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                10% off
              </span>
            </div>

            
              <div className="p-4 text-center space-y-2">
             <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
              <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
             Money Bowl with Geode
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
              Powerful | Prosperous | Divine
              </p>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(3141)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                <span className="text-black">MRP: </span>
                <span className="line-through text-gray-800 mr-0.5">
                  ₹1,999.00
                </span>
                <span className="text-red-600">₹1,199.00</span>
              </div>

 <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded mt-4">
          
            <div className="relative">
              <Image
                src="/images/g11.webp"
                alt="Selenite Crystal Recharging Plate"
                width={400}
                height={400}
                className="w-full object-cover"
              />

              <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                <Heart size={18} />
              </button>

              <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                25% off
              </span>
            </div>

            
              <div className="p-4 text-center space-y-2">
             <p className="text-[13px] text-gray-500 mb-0.5">Mindful Living</p>
              <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
             Crystal Recharging Plate
              </h3>
              <p className={`text-[13px] text-gray-500 ${mincho.className}`}>
          Crystal Recharging | Reduces Negative Energy
              </p>

              <div className="flex justify-center gap-1 text-sm">
                <span className="text-yellow-400">★★★★⯪</span>
                <span>4.9</span>
                <span className="text-gray-800">(3141)</span>
              </div>

              <div className={`text-lg ${mincho.className}`}>
                <span className="text-black">MRP: </span>
                <span className="line-through text-gray-800 mr-0.5">
                  ₹1,099.00
                </span>
                <span className="text-red-600">₹899.00</span>
              </div>

 <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">                Add to Cart
              </button>
              <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                BUY NOW
              </button>
            </div>
          </div>

         <div className="relative h-[98%] rounded-md bg-gradient-to-b from-[#2a2a2a] to-[#1b1b1b] overflow-hidden px-8 py-10 mt-[16px]">
        
      
        <div className="z-10 relative">
          <h2 className="text-white text-3xl md:text-4xl font-serif leading-tight">
            Pyrite Decor
          </h2>

          <Link
            href="/shop"
            className="inline-block mt-3 text-sm text-white underline underline-offset-4 hover:opacity-80 transition"
          >
            Shop all
          </Link>
        </div>

       
        <button
          aria-label="Next"
          className="absolute bottom-6 left-6 w-12 h-12 rounded-full border border-gray-500 flex items-center justify-center text-white hover:bg-white hover:text-black transition cursor-pointer"
        >
             <ChevronRight />
        </button>
      </div>



        </div>
      </div>
    </section>
  );
};

export default ProductCard;
