"use client";
import { useShop } from "@/app/context/ShopContext";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart } = useShop();
  const [updatingItems, setUpdatingItems] = useState({});

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    await updateCartQuantity(productId, newQuantity);
    setUpdatingItems(prev => ({ ...prev, [productId]: false }));
  };

  const handleRemove = async (productId) => {
    if (confirm("Remove this item from cart?")) {
      await removeFromCart(productId);
    }
  };

  const calculateShipping = () => {
    if (!cart || cart.totalAmount === 0) return 0;
    return cart.totalAmount > 500 ? 0 : 50;
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.totalAmount + calculateShipping();
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
     <ProtectedRoute>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-orange-500 inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm p-6 flex flex-col sm:flex-row gap-6"
              >
                {/* Product Image */}
                <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
                  <Image
                    src={item.product.mainImage}
                    alt={item.product.name}
                    width={120}
                    height={120}
                    className="rounded-lg object-cover w-full sm:w-32 h-32"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link 
                        href={`/product/${item.product.slug}`}
                        className="font-semibold text-lg text-gray-900 hover:text-orange-500 transition"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 capitalize">{item.product.category}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded-lg"
                      title="Remove from cart"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-orange-500">
                      ${item.salePrice.toFixed(2)}
                    </span>
                    {item.price > item.salePrice && (
                      <span className="text-gray-400 line-through ml-2">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItems[item.product._id]}
                          className="px-4 py-2 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-6 py-2 border-x-2 border-gray-300 font-semibold min-w-[60px] text-center">
                          {updatingItems[item.product._id] ? "..." : item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.quantity || updatingItems[item.product._id]}
                          className="px-4 py-2 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({item.product.quantity} available)
                      </span>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${(item.salePrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold">${cart.totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {calculateShipping() === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${calculateShipping().toFixed(2)}`
                    )}
                  </span>
                </div>

                {cart.totalAmount < 500 && cart.totalAmount > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Add <strong>${(500 - cart.totalAmount).toFixed(2)}</strong> more for FREE shipping!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-orange-500">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition shadow-md hover:shadow-lg"
              >
                Proceed to Checkout
              </button>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Customer support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}