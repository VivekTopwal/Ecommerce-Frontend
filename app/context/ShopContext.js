/* eslint-disable */
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import useSWR from 'swr';
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const ShopContext = createContext();

const fetcher = (url, token) =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

export function ShopProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  const { data: cartData, mutate: mutateCart } = useSWR(
    isAuthenticated() ? [`${process.env.NEXT_PUBLIC_API_URL}/cart`, token] : null,
    ([url, token]) => fetcher(url, token),
    { refreshInterval: 0 }
  );

  const { data: wishlistData, mutate: mutateWishlist } = useSWR(
    isAuthenticated() ? [`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, token] : null,
    ([url, token]) => fetcher(url, token),
    { refreshInterval: 0 }
  );
  
  const cart = cartData?.cart || { items: [], totalAmount: 0, totalItems: 0 };
  const wishlist = wishlistData?.wishlist || { products: [] };

  useEffect(() => {
    if (isAuthenticated()) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  const getAuthHeaders = () => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

 const addToCart = async (productId, quantity = 1, skipToast = false) => {
  if (!isAuthenticated()) {
    toast.error("Please login to add items to cart");
    return { success: false, message: "Please login first" };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await res.json();

    if (data.success) {
      await mutateCart();
      if (!skipToast) {
        toast.success(data.message || "Added to cart!");
      }
      return { success: true, message: data.message };
    } else {
      toast.error(data.message || "Failed to add to cart");
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error("Failed to add to cart");
    return { success: false, message: "Failed to add to cart" };
  }
};

  const updateCartQuantity = async (productId, quantity) => {
    if (!isAuthenticated()) return { success: false };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (data.success) {
        await mutateCart();
        toast.success("Cart updated successfully");
        return { success: true };
      }
      toast.error(data.message || "Failed to update cart");
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
      return { success: false, message: "Failed to update cart" };
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated()) return { success: false };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();

      if (data.success) {
        await mutateCart();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
      return { success: false };
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated()) {
      toast.error("Please login to add items to wishlist");
      return { success: false };
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/toggle`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ productId }),
        }
      );

      const data = await res.json();

      if (data.success) {
       await mutateWishlist();
        toast.success(data.isWishlisted ? "Added to wishlist!" : "Removed from wishlist!");
        return { success: true, isWishlisted: data.isWishlisted };
      }
      return { success: false };
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
      return { success: false };
    }
  };

  const isInWishlist = (productId) => {
    if (!wishlist || !wishlist.products) return false;
    return wishlist.products.some((p) => p._id === productId);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        loading,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);