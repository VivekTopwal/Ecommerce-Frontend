"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const { token } = useAuth();

  const getAuthHeaders = () => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          headers: getAuthHeaders(),
          cache: "no-store",
        });
        const data = await res.json();
        const allProducts = data.products || data;

        const filtered = allProducts.filter((product) => {
          const query = searchQuery.toLowerCase();
          return (
            product.name.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query) ||
            product.shortDescription?.toLowerCase().includes(query) ||
            product.tags?.some((tag) => tag.toLowerCase().includes(query))
          );
        });

        setSearchResults(filtered.slice(0, 8));
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="search bg-[#E6E6E6] w-[600px] h-[50px] rounded-md px-4 relative border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.3)] transition-all">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          className="w-full bg-transparent text-gray-700 h-full outline-none border-0 pr-20"
        />

        {searchQuery && (
          <button
            onClick={handleClear}
            className="w-8 h-8 rounded-full absolute top-[11px] right-[52px] z-50 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-all"
          >
            <IoCloseOutline size={20} />
          </button>
        )}

        <button className="w-10 h-10 rounded-full absolute top-[5px] right-2 z-50 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-all">
          <IoSearchOutline size={20} />
        </button>
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[500px] overflow-y-auto z-[100]">
          {isSearching ? (
            <div className="p-6 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-200 text-sm text-gray-600">
                Found {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""}
              </div>
              <div className="py-2">
                {searchResults.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    {product.mainImage ? (
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-[60px] h-[60px] bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {product.productPrice &&
                          product.productPrice !== product.salePrice && (
                            <span className="text-sm line-through text-gray-400">
                              ${product.productPrice}
                            </span>
                          )}
                        <span className="text-sm font-semibold text-orange-600">
                          ${product.salePrice}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {searchResults.length >= 8 && (
                <Link
                  href={`/shop?search=${searchQuery}`}
                  onClick={handleResultClick}
                  className="block p-3 text-center text-orange-500 hover:bg-gray-50 border-t border-gray-200 font-medium"
                >
                  View all results for &quot;{searchQuery}&quot;
                </Link>
              )}
            </>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No products found for &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
