"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Shippori_Mincho } from "next/font/google";
import { useShop } from "@/app/context/ShopContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";

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

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);
  const [buyingNow, setBuyingNow] = useState(null);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const getAuthHeaders = () => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`,
            {
        headers: getAuthHeaders(),
          cache: "no-store",
        }
        );
        
        const data = await res.json();
        setProducts(data.products || data);
        console.log("Fetched products:", data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, [token, isAuthenticated]);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (addingToCart || buyingNow) return; 
    
    setAddingToCart(productId);
    
    try {
      const result = await addToCart(productId, 1);
      
      if (result.success) {
     
      } else {
        toast.error(result.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleBuyNow = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (addingToCart || buyingNow) return;
    
    setBuyingNow(productId);
    
    try {

      const result = await addToCart(productId, 1, true);
      
      if (result.success) {
        router.push("/checkout");
      } else {
        toast.error(result.message || "Failed to proceed");
      }
    } catch (error) {
      console.error("Buy now error:", error);
      toast.error("Failed to proceed");
    } finally {
      setBuyingNow(null);
    }
  };

  const handleToggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const result = await toggleWishlist(productId);
      if (!result.success) {
        toast.error("Failed to update wishlist");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const isWishlisted = isInWishlist(p._id);
            const isAddingToCart = addingToCart === p._id;
            const isBuyingNow = buyingNow === p._id;
            const isAnyLoading = isAddingToCart || isBuyingNow;
            
            return (
              <div
                key={p._id}
                className="bg-white overflow-hidden shadow-sm rounded"
              >
                <Link href={`/product/${p.slug}`} className="block">
                  <div className="relative cursor-pointer">
                    {p?.mainImage && (
                      <Image
                        src={p.mainImage}
                        alt={p.name}
                        width={400}
                        height={400}
                        className="w-full object-cover"
                      />
                    )}

                    <button
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full shadow flex items-center justify-center transition-all cursor-pointer ${
                        isWishlisted
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={(e) => handleToggleWishlist(e, p._id)}
                    >
                      <Heart
                        size={18}
                        fill={isWishlisted ? "currentColor" : "none"}
                      />
                    </button>

                    {p.productPrice > p.salePrice && (
                      <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                        {Math.round(
                          ((p.productPrice - p.salePrice) / p.productPrice) *
                            100,
                        )}
                        % off
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-4 text-center space-y-2">
                  <p className="text-[13px] text-gray-500 mb-0.5">
                    Mindful Living
                  </p>
                  <Link href={`/product/${p.slug}`}>
                    <h3
                      className={`text-[20px] hover:text-orange-500 transition ${mincho.className}`}
                    >
                      {p.name}
                    </h3>
                  </Link>

                  <div className="flex justify-center gap-1 text-sm">
                    <span className="text-yellow-400">★★★★⯪</span>
                    <span>4.9</span>
                    <span className="text-gray-800">(3141)</span>
                  </div>

                  <div className={`text-lg ${mincho.className}`}>
                    {p.productPrice && (
                      <>
                        <span className="text-black">MRP: </span>
                        <span className="line-through text-gray-500 mr-1">
                          ${formatPrice(p.productPrice)}
                        </span>
                      </>
                    )}
                    <span
                      className={
                        p.productPrice ? "text-red-600" : "text-gray-800"
                      }
                    >
                      ${formatPrice(p.salePrice)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, p._id)}
                    disabled={isAnyLoading || p.quantity === 0}
                    className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isAddingToCart ? "Adding..." : p.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <button
                    onClick={(e) => handleBuyNow(e, p._id)}
                    disabled={isAnyLoading || p.quantity === 0}
                    className="w-full bg-orange-400 text-white py-2 rounded font-semibold cursor-pointer border border-[rgba(0,0,0,0.1)] hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBuyingNow ? "Processing..." : "BUY NOW"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;