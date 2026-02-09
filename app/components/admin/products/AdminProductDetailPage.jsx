"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${slug}`
        );
        const data = await res.json();

        if (data.success && data.product) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleEdit = () => {
    router.push(`/admin/edit-product/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center flex-col gap-6 justify-center bg-[#fffdf9]">
        <div className="max-w-md text-center px-4">
          <h1 className="text-3xl font-semibold text-gray-800 mb-3">
            Product Not Found
          </h1>
          <p className="text-gray-600 text-base">
            Sorry, the product you are looking for is unavailable or may have
            been removed.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/products")}
          className="bg-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-600 transition-all duration-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-[#fffdf9] px-10 py-8">
  <h1 className="text-2xl font-semibold text-gray-900 mb-10">
    Product Details
  </h1>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
    <div className="flex items-center justify-center bg-white rounded-lg p-8">
      <Image
        src={product.mainImage || "/placeholder.png"}
        alt={product.name}
        width={400}
        height={400}
        className="object-contain"
        priority
      />
    </div>

    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Status:{" "}
        <span className={`font-medium ${product.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {product.quantity > 0 ? 'This product Showing' : 'Out of Stock'}
        </span>
      </p>

      <h2 className="text-4xl font-bold text-gray-900">
        {product.name}
      </h2>

      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold text-black">
          ${product.salePrice?.toFixed(2)}
        </span>
        {product.productPrice > product.salePrice && (
          <span className="text-xl line-through text-gray-400">
            ${product.productPrice?.toFixed(2)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 text-sm rounded-md font-medium ${
          product.quantity > 0 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
        <span className="text-sm text-gray-700">
          QUANTITY: <strong>{product.quantity}</strong>
        </span>
      </div>

      <p className="text-gray-600 leading-relaxed text-base">
        {product.description}
      </p>

      <p className="font-semibold text-gray-800 text-lg">
        Category: <span className="font-normal capitalize">{product.category}</span>
      </p>

      <button 
        onClick={handleEdit}
        className="mt-8 w-full lg:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium transition cursor-pointer"
      >
        Edit Product
      </button>
    </div>
  </div>
</div>
  );
}