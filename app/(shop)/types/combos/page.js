"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Heart, Loader2, ChevronLeft } from "lucide-react";
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

const ProductCard = ({ itemsPerPage = 12, category = "Haircare, Skincare" }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);
  const [buyingNow, setBuyingNow] = useState(null);

  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();

  const observerTarget = useRef(null);

  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const getAuthHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenRef.current}`,
    };
  }, []);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = `${process.env.NEXT_PUBLIC_API_URL}/products`;

      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const res = await fetch(url, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      const data = await res.json();
      const products = data.products || data;

      setAllProducts(products);

      const firstPage = products.slice(0, itemsPerPage);
      setDisplayedProducts(firstPage);
      setHasMore(products.length > itemsPerPage);

    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [token, isAuthenticated, itemsPerPage, category]);


  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const startIndex = page * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newProducts = allProducts.slice(startIndex, endIndex);

      if (newProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
        setHasMore(endIndex < allProducts.length);
      } else {
        setHasMore(false);
      }

      setLoadingMore(false);
    }, 500);
  }, [page, itemsPerPage, allProducts, loadingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMoreProducts, hasMore, loadingMore]);

const handleAddToCart = async (e, productId) => {
  e.preventDefault();
  e.stopPropagation();
  if (addingToCart || buyingNow) return;

  setAddingToCart(productId);
  await addToCart(productId, 1);
  setAddingToCart(null);
};


const handleToggleWishlist = async (e, productId) => {
  e.preventDefault();
  e.stopPropagation();
  await toggleWishlist(productId);
};


const handleBuyNow = async (e, product) => {
  e.preventDefault();
  e.stopPropagation();


  if (!isAuthenticated()) {
    toast.error("Please login to purchase", {
      duration: 2000,
      icon: "🔒",
    });

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

  if (loading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-400" />
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <nav className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[20px] text-gray-600 hover:text-orange-500 transition-colors group"
          >
            <ChevronLeft
              size={24}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Back To Home</span>
          </Link>
        </nav>

        <h2 className={`text-center text-[30px] mb-8 ${mincho.className}`}>
          Combos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((p) => {
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
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full shadow flex items-center justify-center transition-all cursor-pointer ${isWishlisted
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
                          100
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
                          ₹{formatPrice(p.productPrice)}
                        </span>
                      </>
                    )}
                    <span
                      className={
                        p.productPrice ? "text-red-600" : "text-gray-800"
                      }
                    >
                      ₹{formatPrice(p.salePrice)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, p._id)}
                    disabled={isAnyLoading || p.quantity === 0}
                    className="w-full border py-2 rounded cursor-pointer border-[rgba(0,0,0,0.3)] hover:border-[rgba(0,0,0,0.5)] mt-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isAddingToCart
                      ? "Adding..."
                      : p.quantity === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                  </button>

                  <button
                    onClick={(e) => handleBuyNow(e, p)}
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

        <div ref={observerTarget} className="w-full py-8">
          {loadingMore && (
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-400" />
              <p className="mt-4 text-gray-600">Loading more products...</p>
            </div>
          )}

          {!hasMore && displayedProducts.length > 0 && (
            <div className="text-center text-gray-500">
              <p>You&apos;ve reached the end!</p>
              <p className="text-sm mt-2">
                Showing all {displayedProducts.length} products
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductCard;