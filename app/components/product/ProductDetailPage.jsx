"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart, ShoppingCart, Minus, Plus, Star } from "lucide-react";
import { Shippori_Mincho } from "next/font/google";
import { useRouter } from "next/navigation";
import { useShop } from "@/app/context/ShopContext";

const mincho = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false); // Separate state for Add to Cart
  const [buyingNow, setBuyingNow] = useState(false); // Separate state for Buy Now
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [images, setImages] = useState([]);

  const handlePage = () => {
    router.push("/");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${slug}`,
        );
        const data = await res.json();

        if (data.success && data.product) {
          const p = data.product;

          const imageList = [p.mainImage, ...(p.featureImages || [])].filter(
            Boolean,
          );

          setProduct(p);
          setImages(imageList);
          setActiveImage(imageList[0] || null);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const calculateDiscount = () => {
    if (product.productPrice > product.salePrice) {
      return Math.round(
        ((product.productPrice - product.salePrice) / product.productPrice) *
          100,
      );
    }
    return 0;
  };

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const result = await addToCart(product._id, quantity);
    
    if (result.success) {
      // Optional: Reset quantity after adding
      // setQuantity(1);
    }
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    setBuyingNow(true);
    const result = await addToCart(product._id, quantity);
    
    if (result.success) {
      router.push("/checkout");
    } else {
      alert(result.message || "Failed to proceed");
    }
    setBuyingNow(false);
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist(product._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center flex-col gap-[25px] justify-center bg-gray-50">
        <div className="max-w-md text-center px-4">
          <h1 className="text-3xl font-semibold text-gray-800 mb-3">
            Product Not Found
          </h1>
          <p className="text-gray-600 text-base">
            Sorry, the product you're looking for is unavailable or may have
            been removed.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={handlePage}
            className="w-50 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount();
  const isWishlisted = isInWishlist(product._id);

  return (
    <section className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-orange-500 transition-colors">
                Home
              </Link>
            </li>

            <li className="mx-1 text-gray-400">/</li>

            <li>
              <Link
                href={`/category/${product.category}`}
                className="hover:text-orange-500 transition-colors capitalize"
              >
                {product.category}
              </Link>
            </li>

            <li className="mx-1 text-gray-400">/</li>

            <li
              className="text-gray-900 font-medium truncate max-w-[220px]"
              aria-current="page"
              title={product.name}
            >
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-lg shadow-sm p-6 lg:p-8">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              {activeImage && (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  priority
                />
              )}

              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {discount}% OFF
                </div>
              )}

              <button
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
                  isWishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.slice(0, 5).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`relative min-w-[80px] h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      activeImage === img
                        ? "border-orange-500 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-orange-500 font-semibold uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1
                className={`text-3xl lg:text-4xl text-gray-900 font-semibold leading-tight ${mincho.className}`}
              >
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                (4.8 from 127 reviews)
              </span>
            </div>

            <p className="text-gray-600 text-base leading-relaxed">
              {product.description}
            </p>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  className={`text-4xl text-red-600 font-bold ${mincho.className}`}
                >
                  ${product.salePrice.toLocaleString()}
                </span>
                {product.productPrice > product.salePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.productPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
                      Save $
                      {(
                        product.productPrice - product.salePrice
                      ).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.quantity > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <p
                className={`font-semibold ${
                  product.quantity > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.quantity > 0
                  ? `In Stock - ${product.quantity} available`
                  : "Out of Stock"}
              </p>
            </div>

            {product.quantity > 0 && (
              <div className="space-y-2">
                <label className="font-semibold text-gray-700 block">
                  Quantity:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 py-2 border-x-2 border-gray-300 font-semibold min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      disabled={quantity >= product.quantity}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.quantity} units available
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4">
              <button
                onClick={handleBuyNow}
                disabled={buyingNow || product.quantity === 0}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buyingNow ? "Processing..." : "BUY NOW"}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.quantity === 0}
                className="w-full border-2 border-gray-800 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 hover:text-white transition-all duration-200 flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={22} />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Free shipping on orders over $500</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}