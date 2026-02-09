"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [wishlist, setWishlist] = useState({ products: [] });

  // Fetch cart and wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
      fetchWishlist();
    } else {
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
      setWishlist({ products: [] });
    }
  }, [token]);

  const getAuthHeaders = () => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchCart = async () => {
    if (!isAuthenticated()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchWishlist = async () => {
    if (!isAuthenticated()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
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
        setCart(data.cart);
        toast.success(data.message || "Added to cart!");
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
        setCart(data.cart);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Error updating cart:", error);
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
        setCart(data.cart);
        toast.success("Item removed from cart");
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Error removing from cart:", error);
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
        setWishlist(data.wishlist);
        toast.success(
          data.isWishlisted ? "Added to wishlist!" : "Removed from wishlist!"
        );
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
    return wishlist.products.some((p) => p._id === productId);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        toggleWishlist,
        isInWishlist,
        fetchCart,
        fetchWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);