"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import Image from "next/image";
import { CloudUpload, X } from "lucide-react";

export default function AddCategoryPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: null,
    isPublished: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("isPublished", formData.isPublished);

      if (formData.icon) {
        data.append("icon", formData.icon);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/add-category`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        },
      );

      if (res.ok) {
        toast.success("Category created successfully!");
        router.push("/admin/categories");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
        <div className="flex justify-between items-start p-6 border-b border-gray-200 bg-gray-100">
          <div>
            <h1 className="text-2xl font-semibold">Add Category</h1>
            <p className="text-medium text-gray-700">
              Add your Product category and necessary information from here
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full bg-white hover:bg-red-300 cursor-pointer"
              type="button"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-3 text-[16px] font-semibold text-gray-800">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Category Title"
              value={formData.name}
              onChange={handleChange}
              className="col-span-9 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-12 gap-6 items-start">
            <label className="col-span-3 text-[16px] font-semibold text-gray-800">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Category Description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="col-span-9 border border-gray-300 bg-gray-100 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-12 gap-6 items-start">
            <label className="col-span-12 md:col-span-3 text-[16px] font-semibold text-gray-800 pt-2">
              Category Image
            </label>

            <div className="col-span-12 md:col-span-9">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                id="categoryImage"
                className="hidden"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, icon: e.target.files[0] }))
                }
              />

              <label
                htmlFor="categoryImage"
                className="block border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-green-500 transition bg-gray-50"
              >
                <CloudUpload
                  className="mx-auto mb-2 text-green-500"
                  size={40}
                />
                <p className="font-medium text-gray-800">
                  {formData.icon
                    ? formData.icon.name
                    : "Click to upload category image"}
                </p>
                <p className="text-xs mt-1 text-gray-500">(JPEG, PNG, WEBP)</p>
              </label>

              {formData.icon && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </p>

                  <div className="relative group w-40 h-40 border rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={URL.createObjectURL(formData.icon)}
                      width={160}
                      height={160}
                      alt="Category image preview"
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        toast(
                          (t) => (
                            <div className="flex flex-col gap-2 text-center">
                              <p className="text-sm font-medium">
                                Are you sure you want to remove the category
                                image?
                              </p>

                              <div className="flex justify-center gap-2 mt-2">
                                <button
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      icon: null,
                                    }));
                                    toast.dismiss(t.id);
                                    toast.success("Category image removed");
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
                          },
                        );
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full
             opacity-0 group-hover:opacity-100 transition
             hover:bg-red-600 hover:cursor-pointer"
                      aria-label="Remove category image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

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

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-md border bg-white hover:bg-gray-100 w-[49%] cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 w-[49%] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
