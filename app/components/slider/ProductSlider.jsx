"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, FreeMode, Mousewheel } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Shippori_Mincho } from "next/font/google";

const mincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const ProductSlider = () => {
  return (
    <section className="container py-8">
      <div className="container">
        <h2 className={`text-center text-[30px] mb-8 ${mincho.className}`}>
          New Arrivals
        </h2>

        <div className="relative group">
          <Swiper
            slidesPerView={5}
            spaceBetween={20}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            freeMode={true}
            mousewheel={{
              forceToAxis: true,
            }}
            modules={[Navigation, FreeMode, Mousewheel]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="bg-white overflow-hidden shadow-sm rounded">
                <div className="relative">
                  <Image
                    src="/images/cat1.webp"
                    alt="Kamdhenu Lotus Pyrite"
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />

                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                    <Heart size={18} />
                  </button>

                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                    27% off
                  </span>
                </div>

                <div className="p-4 text-center space-y-2">
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                    Kamdhenu Lotus Pyrite
                  </h3>
                  <p
                    className={`text-[13px] text-gray-500 ${mincho.className}`}
                  >
                    Nurturing | Prosperity | Harmony
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
                    <span className="text-red-600">₹999.00</span>
                  </div>

                  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                    {" "}
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                    BUY NOW
                  </button>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white overflow-hidden shadow-sm rounded">
                <div className="relative">
                  <Image
                    src="/images/cat2.webp"
                    alt="Sacred Twin Cow Harmon"
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />

                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                    <Heart size={18} />
                  </button>

                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                    7% off
                  </span>
                </div>

                <div className="p-4 text-center space-y-2">
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                    Sacred Cow Harmony
                  </h3>
                  <p
                    className={`text-[13px] text-gray-500 ${mincho.className}`}
                  >
                    Harmony | Nurture | Abundance
                  </p>
                  <div className="flex justify-center gap-1 text-sm">
                    <span className="text-yellow-400">★★★★⯪</span>
                    <span>4.9</span>
                    <span className="text-gray-800">(3141)</span>
                  </div>

                  <div className={`text-lg ${mincho.className}`}>
                    <span className="text-black">MRP: </span>
                    <span className="line-through text-gray-600 mr-0.5">
                      ₹1,899.00
                    </span>
                    <span className="text-red-600">₹1,299.00</span>
                  </div>

                  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                    {" "}
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                    BUY NOW
                  </button>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white overflow-hidden shadow-sm rounded">
                <div className="relative">
                  <Image
                    src="/images/cat3.webp"
                    alt="King & Queen Crystal"
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />

                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                    <Heart size={18} />
                  </button>

                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                    17% off
                  </span>
                </div>

                <div className="p-4 text-center space-y-2">
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                    King & Queen Crystal
                  </h3>
                  <p
                    className={`text-[13px] text-gray-500 ${mincho.className}`}
                  >
                    Strategic | Prosperous | Protective
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

                  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                    {" "}
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                    BUY NOW
                  </button>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white overflow-hidden shadow-sm rounded">
                <div className="relative">
                  <Image
                    src="/images/cat4.webp"
                    alt="Lord Narasimha Pyrite"
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />

                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                    <Heart size={18} />
                  </button>

                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                    27% off
                  </span>
                </div>

                <div className="p-4 text-center space-y-2">
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                    Lord Narasimha Pyrite
                  </h3>
                  <p
                    className={`text-[13px] text-gray-500 ${mincho.className}`}
                  >
                    Protection | Strength | Abundance
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

                  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                    {" "}
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                    BUY NOW
                  </button>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white overflow-hidden shadow-sm rounded">
                <div className="relative">
                  <Image
                    src="/images/cat5.webp"
                    alt="Kathakali Netram Pyrite"
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
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                    Kathakali Pyrite
                  </h3>
                  <p
                    className={`text-[13px] text-gray-500 ${mincho.className}`}
                  >
                    Focus | Prosperity | Protection
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
                    <span className="text-red-600">₹999.00</span>
                  </div>

                  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                    {" "}
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                    BUY NOW
                  </button>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white overflow-hidden shadow-sm rounded">
                <div className="relative">
                  <Image
                    src="/images/cat6.webp"
                    alt="Buddha Pyrite-Lapis"
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />

                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                    <Heart size={18} />
                  </button>

                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                    17% off
                  </span>
                </div>

                <div className="p-4 text-center space-y-2">
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                    Buddha Pyrite-Lapis
                  </h3>
                  <p
                    className={`text-[13px] text-gray-500 ${mincho.className}`}
                  >
                    Grace | Prosperity | Elegance
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

                  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                    {" "}
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                    BUY NOW
                  </button>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white overflow-hidden shadow-sm rounded">
                <div className="relative">
                  <Image
                    src="/images/cat7.webp"
                    alt="Pyrite-Lapis Peacock
"
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />

                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                    <Heart size={18} />
                  </button>

                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                    27% off
                  </span>
                </div>

                <div className="p-4 text-center space-y-2">
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                    Pyrite-Lapis Peacock
                  </h3>
                  <p
                    className={`text-[13px] text-gray-500 ${mincho.className}`}
                  >
                    Grace I Wisdom I Abundance
                  </p>
                  <div className="flex justify-center gap-1 text-sm">
                    <span className="text-yellow-400">★★★★⯪</span>
                    <span>4.9</span>
                    <span className="text-gray-800">(3141)</span>
                  </div>

                  <div className={`text-lg ${mincho.className}`}>
                    <span className="text-black">MRP: </span>
                    <span className="line-through text-gray-600 mr-0.5">
                      ₹1,999.00
                    </span>
                    <span className="text-red-600">₹1,799.00</span>
                  </div>

                  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                    {" "}
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                    BUY NOW
                  </button>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white overflow-hidden shadow-sm rounded">
                <div className="relative">
                  <Image
                    src="/images/cat8.webp"
                    alt="Mahadev Trishul Pyrite"
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />

                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                    <Heart size={18} />
                  </button>

                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                    7% off
                  </span>
                </div>

                <div className="p-4 text-center space-y-2">
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                    Mahadev Trishul Pyrite
                  </h3>
                  <p
                    className={`text-[13px] text-gray-500 ${mincho.className}`}
                  >
                    Power | Protection | Presence
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
                    <span className="text-red-600">₹1,199.00</span>
                  </div>

                  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                    {" "}
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                    BUY NOW
                  </button>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white overflow-hidden shadow-sm rounded">
                <div className="relative">
                  <Image
                    src="/images/cat9.webp"
                    alt="Chess-Queen Tourmaline"
                    width={400}
                    height={400}
                    className="w-full object-cover"
                  />

                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer">
                    <Heart size={18} />
                  </button>

                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                    27% off
                  </span>
                </div>

                <div className="p-4 text-center space-y-2">
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                    Chess Tourmaline
                  </h3>
                  <p
                    className={`text-[13px] text-gray-500 ${mincho.className}`}
                  >
                    Strategic | Prosperous | Protective
                  </p>
                  <div className="flex justify-center gap-1 text-sm">
                    <span className="text-yellow-400">★★★★⯪</span>
                    <span>4.8</span>
                    <span className="text-gray-800">(241)</span>
                  </div>

                  <div className={`text-lg ${mincho.className}`}>
                    <span className="text-black">MRP: </span>
                    <span className="line-through text-gray-600 mr-0.5">
                      ₹2,499.00
                    </span>
                    <span className="text-red-600">₹2,199.00</span>
                  </div>

                  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                    {" "}
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                    BUY NOW
                  </button>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="bg-white overflow-hidden shadow-sm rounded">
                <div className="relative">
                  <Image
                    src="/images/cat10.webp"
                    alt="Chess-King Pyrite"
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
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                    Chess-King Pyrite
                  </h3>
                  <p
                    className={`text-[13px] text-gray-500 ${mincho.className}`}
                  >
                    Strategic | Prosperous | Protective
                  </p>
                  <div className="flex justify-center gap-1 text-sm">
                    <span className="text-yellow-400">★★★★⯪</span>
                    <span>4.9</span>
                    <span className="text-gray-800">(3141)</span>
                  </div>

                  <div className={`text-lg ${mincho.className}`}>
                    <span className="text-black">MRP: </span>
                    <span className="line-through text-gray-600 mr-0.5">
                      ₹1,999.00
                    </span>
                    <span className="text-red-600">₹1,099.00</span>
                  </div>

                  <button className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5">
                    {" "}
                    Add to Cart
                  </button>
                  <button className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.5)]">
                    BUY NOW
                  </button>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="relative h-[520px] rounded-md bg-gradient-to-b from-[#2a2a2a] to-[#1b1b1b] overflow-hidden px-8 py-10">
                <div className="relative z-10">
                  <h2 className="text-white text-3xl md:text-4xl font-serif leading-tight">
                    Featured Collection
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
                  className="absolute bottom-6 left-6 z-20 w-12 h-12 rounded-full border border-gray-500 flex items-center justify-center text-white hover:bg-white hover:text-black transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </SwiperSlide>
          </Swiper>

          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 cursor-pointer">
            <ChevronLeft size={24} className="text-gray-700" />
          </button>

          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 cursor-pointer">
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
