"use client";
import { useShop } from "@/app/context/ShopContext";
import Image from "next/image";
import { Trash2, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [loading, setLoading] = useState({});

 const handleRemove = (productId) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2 text-center">
        <p className="text-sm font-medium">
          Remove this item from your wishlist?
        </p>

        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Removing from wishlist...");

              try {
                await toggleWishlist(productId);
                toast.dismiss(loadingToast);
                
              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Failed to remove from wishlist");
              }
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded"
          >
            Remove
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm bg-gray-200 text-black rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-center",
    }
  );
};

  const handleAddToCart = async (product) => {
    setLoading(prev => ({ ...prev, [product._id]: true }));
    const result = await addToCart(product._id, 1);
    
    if (result.success) {
     
    } else {
      toast.error(result.message || "Failed to add to cart");
    }
    setLoading(prev => ({ ...prev, [product._id]: false }));
  };

  const handleAddAllToCart = async () => {
    if (!wishlist?.products?.length) return;
    
    setLoading({ all: true });
    
    for (const product of wishlist.products) {
      await addToCart(product._id, 1);
    }
    
    setLoading({ all: false });
    toast.success("All items added to cart!");
  };

 if (!wishlist?.products?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <Heart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            Save your favorite items here and come back to them later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            <ArrowLeft size={20} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
      
        <div className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-orange-500 inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>

       
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlist.products.length} {wishlist.products.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          <button
            onClick={handleAddAllToCart}
            disabled={loading.all}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            {loading.all ? "Adding..." : "Add All to Cart"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group"
            >

              <Link href={`/product/${product.slug}`} className="block relative">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(product._id);
                    }}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-50 transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>

                  {product.quantity === 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}

                  {product.quantity > 0 && product.quantity < 10 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Only {product.quantity} left
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                  <p className="text-sm text-gray-500 capitalize mb-1">{product.category}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-orange-500 transition">
                    {product.name}
                  </h3>
                </Link>

                <div className="mb-4">
                  <span className="text-xl font-bold text-orange-500">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  {product.productPrice > product.salePrice && (
                    <span className="text-sm text-gray-400 line-through ml-2">
                      ${product.productPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity === 0 || loading[product._id]}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  {loading[product._id] ? "Adding..." : product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}