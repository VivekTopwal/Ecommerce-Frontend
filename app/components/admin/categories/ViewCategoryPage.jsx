"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ViewCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`
        );
        const data = await res.json();

        if (data.success && data.category) {
          setCategory(data.category);
        } else {
          alert('Category not found');
          router.push('/admin/categories');
        }
      } catch (error) {
        console.error("Failed to fetch category", error);
        alert('Failed to load category');
        router.push('/admin/categories');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, router]);

  const handleEdit = () => {
    router.push(`/admin/edit-category/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f5]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-10 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/admin/categories')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Categories
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-10">
        Category Details
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl">
        {/* Left: Category Icon */}
        <div className="flex items-center justify-center bg-white rounded-lg p-8">
          {category.icon ? (
            <Image
              src={category.icon}
              alt={category.name}
              width={300}
              height={300}
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-lg">No Icon</span>
            </div>
          )}
        </div>

        {/* Right: Category Info */}
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Status:{" "}
            <span className={`font-medium ${category.isPublished ? 'text-green-500' : 'text-red-500'}`}>
              {category.isPublished ? 'Published' : 'Not Published'}
            </span>
          </p>

          <h2 className="text-4xl font-bold text-gray-900">
            {category.name}
          </h2>

          <p className="text-gray-600 leading-relaxed text-base">
            {category.description || 'No description provided'}
          </p>

          <div className="border-t pt-6 space-y-2 text-sm text-gray-600">
            <p><strong>Created:</strong> {new Date(category.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(category.updatedAt).toLocaleString()}</p>
          </div>

          <button 
            onClick={handleEdit}
            className="mt-8 w-full lg:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium transition cursor-pointer"
          >
            Edit Category
          </button>
        </div>
      </div>
    </div>
  );
}