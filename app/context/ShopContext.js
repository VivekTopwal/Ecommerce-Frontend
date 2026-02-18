
/* eslint-disable */
"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [sessionId, setSessionId] = useState(null);


  useEffect(() => {
    let id = localStorage.getItem("guestSessionId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guestSessionId", id);
    }
    setSessionId(id);
  }, []);

  const getHeaders = useCallback(() => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (sessionId) headers["x-session-id"] = sessionId;
    return headers;
  }, [token, sessionId]);

  const { data: cartData, mutate: mutateCart } = useSWR(
    sessionId ? `${process.env.NEXT_PUBLIC_API_URL}/cart?sid=${sessionId}` : null,
    (url) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: getHeaders(),
      }).then((res) => res.json()),
    { refreshInterval: 0 }
  );

  const { data: wishlistData, mutate: mutateWishlist } = useSWR(
    sessionId ? `${process.env.NEXT_PUBLIC_API_URL}/wishlist?sid=${sessionId}` : null,
    (url) =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        headers: getHeaders(),
      }).then((res) => res.json()),
    { refreshInterval: 0 }
  );

  const cart = cartData?.cart || { items: [], totalAmount: 0, totalItems: 0 };

  const wishlistProducts =
    wishlistData?.wishlist?.products ||
    wishlistData?.wishlist?.items ||
    [];

  const wishlist = {
    ...wishlistData?.wishlist,
    products: wishlistProducts,
    items: wishlistProducts,
  };

  useEffect(() => {
    const mergeGuestData = async () => {
      if (!token || !sessionId) return;

      try {
        await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/merge`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ sessionId }),
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/merge`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ sessionId }),
          }),
        ]);

        await Promise.all([mutateCart(), mutateWishlist()]);
      } catch (error) {
        console.error("Merge error:", error);
      }
    };

    if (token) {
      mergeGuestData();
    }
  }, [token]);

  const addToCart = async (productId, quantity = 1, skipToast = false) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (data.success) {
        mutateCart({ ...cartData, cart: data.cart }, false);
        if (!skipToast) toast.success(data.message || "Added to cart!");
        return { success: true, message: data.message };
      } else {
        toast.error(data.message || "Failed to add to cart");
        return { success: false, message: data.message };
      }
    } catch (error) {
      toast.error("Failed to add to cart");
      return { success: false };
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();

      if (data.success) {
        await mutateCart();
        return { success: true };
      }
      toast.error(data.message || "Failed to update cart");
      return { success: false };
    } catch (error) {
      toast.error("Failed to update cart");
      return { success: false };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/remove/${productId}`,
        { method: "DELETE", headers: getHeaders() }
      );

      const data = await res.json();

      if (data.success) {
        await mutateCart();
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error("Failed to remove from cart");
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/clear`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      await mutateCart();
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/toggle`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ productId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        await mutateWishlist();
        toast.success(
          data.isWishlisted ? "Added to wishlist!" : "Removed from wishlist"
        );
        return { success: true, isWishlisted: data.isWishlisted };
      }
      return { success: false };
    } catch (error) {
      toast.error("Failed to update wishlist");
      return { success: false };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistProducts.some((p) => {
      const id = p?._id || p;
      return id?.toString() === productId?.toString();
    });
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        sessionId,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);