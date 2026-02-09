"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { CloudUpload, X, Loader2 } from "lucide-react";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
const [icon, setIcon] = useState(null);            
const [existingIcon, setExistingIcon] = useState(""); 

  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: null,
    isPublished: true,
  });

  const [originalData, setOriginalData] = useState(null);
useEffect(() => {
  const fetchCategory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`
      );

      const data = await res.json();

      if (!data.success || !data.category) {
        alert("Category not found");
        router.push("/admin/categories");
        return;
      }

      const category = data.category;

      setFormData({
        name: category.name || "",
        description: category.description || "",
        icon: null,
        isPublished: category.isPublished ?? true,
      });

      setOriginalData(category);

      if (category.icon) {
        const imageUrl = category.icon.startsWith("http")
          ? category.icon
          : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${category.icon}`;

        setExistingIcon(imageUrl);
      }
    } catch (error) {
      console.error("Failed to fetch category", error);
      alert("Failed to load category");
      router.push("/admin/categories");
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchCategory();
  }
}, [id, router]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setIcon(file);
  setExistingIcon(""); 
};

const removeNewImage = () => {
  const confirmed = window.confirm(
    "Are you sure you want to remove the new image?"
  );
  if (confirmed) {
    setIcon(null);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('isPublished', formData.isPublished);
      
  if (icon) {
  data.append("icon", icon);
}

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`,
        {
          method: 'PUT',
          body: data,
        }
      );

      if (res.ok) {
        alert('Category updated successfully!');
        router.push('/admin/categories');
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/admin/categories');
    }
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

return (
  <div className="bg-gray-50 p-6">
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
      
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-gray-200 bg-gray-100">
        <div>
          <h1 className="text-2xl font-semibold">Edit Category</h1>
          <p className="text-medium text-gray-700">
            Update your product category and necessary information from here
          </p>
        </div>

        <button
          onClick={handleCancel}
          className="p-2 rounded-full bg-white hover:bg-red-300 cursor-pointer"
          type="button"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Name */}
        <div className="grid grid-cols-12 gap-6 items-center">
          <label className="col-span-3 text-[16px] font-semibold text-gray-800">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Category Title"
            className="col-span-9 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Description */}
        <div className="grid grid-cols-12 gap-6 items-start">
          <label className="col-span-3 text-[16px] font-semibold text-gray-800">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Category Description"
            className="col-span-9 border border-gray-300 bg-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

    <div className="grid grid-cols-12 gap-6 items-start">
  <label className="col-span-12 md:col-span-3 text-[16px] font-semibold text-gray-800 pt-2">
    Category Image
  </label>

  <div className="col-span-12 md:col-span-9">
    
    {/* Existing Image */}
    {existingIcon && !icon && (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Current Image
        </p>

        <div className="relative group w-40 h-40 border rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={existingIcon}
            width={160}
            height={160}
            alt="Current category image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    )}

    {/* Upload Input */}
    <input
      type="file"
      accept="image/png, image/jpeg, image/webp"
      id="categoryIcon"
      className="hidden"
      onChange={handleImageChange}
    />

    <label
      htmlFor="categoryIcon"
      className="block border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-green-500 transition bg-gray-50"
    >
      <CloudUpload className="mx-auto mb-2 text-green-500" size={40} />
      <p className="font-medium text-gray-800">
        {icon
          ? icon.name
          : existingIcon
          ? "Click to upload new category image"
          : "Click to upload category image"}
      </p>
      <p className="text-xs mt-1 text-gray-500">
        (JPEG, PNG, WEBP)
      </p>
    </label>

    {/* New Image Preview */}
    {icon && (
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          New Image Preview
        </p>

        <div className="relative group w-40 h-40 border rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={URL.createObjectURL(icon)}
            width={160}
            height={160}
            alt="New category preview"
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={removeNewImage}
            className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full
                       opacity-0 group-hover:opacity-100 transition
                       hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    )}
  </div>
</div>


        {/* Published */}
        <div className="flex items-center gap-3">
          <label className="text-[17px] font-medium text-gray-800">
            Published
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>

  {originalData && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Original Information</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Created:</strong> {new Date(originalData.createdAt).toLocaleString()}</p>
              <p><strong>Last Updated:</strong> {new Date(originalData.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 rounded-md border bg-white hover:bg-gray-100 w-[49%] cursor-pointer"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 w-[49%] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Updating..." : "Update Category"}
          </button>



        </div>
      </form>
    </div>
  </div>
);

}












