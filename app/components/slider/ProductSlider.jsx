"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, FreeMode, Mousewheel } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Shippori_Mincho } from "next/font/google";
import { useShop } from "@/app/context/ShopContext";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const mincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const formatPrice = (price) => {
  return Number(price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};



const ProductSlider = ({ category = null, limit = 10 }) => {
  const [products, setProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);
  const [buyingNow, setBuyingNow] = useState(null);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
const handleClick = () => {
   router.push("/shop");
}
 
    useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (category) {
          const categoryValue = Array.isArray(category)
            ? category.join(",")
            : category;
          params.append("category", categoryValue);
        }
        if (limit) {
          params.append("limit", limit);
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`,
          { cache: "no-store" }
        );

        const data = await res.json();
       setProducts(data.products ?? data);
      } catch (error) {
        console.error("Failed to fetch products", error);
        toast.error("Failed to load products");
      } 
    };

    fetchProducts();
  }, [category, limit]); 


const handleAddToCart = async (e, productId) => {
  e.preventDefault();
  e.stopPropagation();
  if (addingToCart || buyingNow) return;

  setAddingToCart(productId);
  await addToCart(productId, 1);
  setAddingToCart(null);
};

// ✅ Wishlist — no login needed
const handleToggleWishlist = async (e, productId) => {
  e.preventDefault();
  e.stopPropagation();
  await toggleWishlist(productId);
};

// 🔒 Buy Now — REQUIRES login
const handleBuyNow = async (e, product) => {
  e.preventDefault();
  e.stopPropagation();

  // Block guests — show login prompt
  if (!isAuthenticated()) {
    toast.error("Please login to purchase", {
      duration: 2000,
      icon: "🔒",
    });
    // Save intended destination so user comes back after login
    sessionStorage.setItem("redirectAfterLogin", `/product/${product.slug}`);
     setTimeout(() => {
         router.push("/login");
  }, 2000);
   
    return;
  }

  if (addingToCart || buyingNow) return;
  setBuyingNow(product._id);

  try {
    const buyNowItem = {
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        mainImage: product.mainImage,
        category: product.category,
        salePrice: product.salePrice,
        productPrice: product.productPrice,
        quantity: product.quantity,
      },
      quantity: 1,
      salePrice: product.salePrice,
    };

    sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
    router.push("/checkout?buyNow=true");
  } catch (error) {
    toast.error("Failed to proceed");
  } finally {
    setBuyingNow(null);
  }
};


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
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
          >
            {products.map((product) => {
              const isWishlisted = isInWishlist(product._id);
              const isAddingToCart = addingToCart === product._id;
              const isBuyingNow = buyingNow === product._id;
              const isAnyLoading = isAddingToCart || isBuyingNow;
              const discountPercent = product.productPrice
                ? Math.round(
                    ((product.productPrice - product.salePrice) /
                      product.productPrice) *
                      100
                  )
                : 0;

              return (
                <SwiperSlide key={product._id}>
                  <Link href={`/product/${product.slug}`}>
                    <div className="bg-white overflow-hidden shadow-sm rounded">
                      <div className="relative">
                        {product.mainImage ? (
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="w-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}

                        <button
                          onClick={(e) => handleToggleWishlist(e, product._id)}
                          className={`absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center cursor-pointer transition-colors ${
                            isWishlisted ? "text-red-500" : ""
                          }`}
                        >
                          <Heart
                            size={18}
                            fill={isWishlisted ? "currentColor" : "none"}
                          />
                        </button>

                        {discountPercent > 0 && (
                          <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                            {discountPercent}% off
                          </span>
                        )}
                      </div>

                      <div className="p-4 text-center space-y-2">
                        <p className="text-[13px] text-gray-500 mb-0.5">
                          Mindful Living
                        </p>
                        <h3 className={`text-[20px] mb-0.5 ${mincho.className}`}>
                          {product.name}
                        </h3>
                       
                        <div className="flex justify-center gap-1 text-sm">
                          <span className="text-yellow-400">★★★★⯪</span>
                          <span>4.9</span>
                          <span className="text-gray-800">(3141)</span>
                        </div>

                        <div className={`text-lg ${mincho.className}`}>
                          {product.productPrice &&
                            product.productPrice !== product.salePrice && (
                              <>
                                <span className="text-black">MRP: </span>
                                <span className="line-through text-gray-600 mr-0.5">
                                  ₹{formatPrice(product.productPrice)}
                                </span>
                              </>
                            )}
                          <span className="text-red-600">
                            ₹{formatPrice(product.salePrice)}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(e, product._id)}
                          disabled={isAnyLoading || product.quantity === 0}
                          className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {isAddingToCart
                            ? "Adding..."
                            : product.quantity === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </button>
                        <button
                          onClick={(e) => handleBuyNow(e, p)}
                          disabled={isAnyLoading || product.quantity === 0}
                          className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isBuyingNow ? "Processing..." : "BUY NOW"}
                        </button>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}

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

                <button onClick={handleClick}
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