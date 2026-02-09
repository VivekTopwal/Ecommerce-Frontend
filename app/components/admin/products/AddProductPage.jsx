"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, CloudUpload, DollarSign, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const AddProductPage = () => {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/admin/products");
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [featureImages, setFeatureImages] = useState([]);
  const [category, setCategory] = useState("");
  const [productPrice, setproductPrice] = useState("");
  const [salePrice, setsalePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  // const [productSlug, setproductSlug] = useState("");

  const addProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("productPrice", productPrice);
      formData.append("salePrice", salePrice);
      formData.append("quantity", quantity);
      formData.append("mainImage", mainImage);

      featureImages.forEach((img) => {
        formData.append("featureImages", img);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/add-product`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert("Product added successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
        <div className="flex justify-between items-start p-6 border-b border-gray-200 bg-gray-100">
          <div>
            <h1 className="text-2xl font-semibold">Add Product</h1>
            <p className="text-medium text-gray-700">
              Add your product and necessary information from here
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleCancel} className="p-2 rounded-full bg-white hover:bg-red-300 cursor-pointer">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center px-6 border-b border-gray-200 ">
          <button className="py-3 text-green-600 font-medium border-b-2 border-green-600">
            Basic Info
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-3 text-[16px] font-semibold text-gray-800">
              Product Title/Name
            </label>
            <input
              type="text"
              placeholder="Product Title/Name"
              className="col-span-9 border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          <div className="grid grid-cols-12 gap-6 items-start">
            <label className="col-span-3 text-[16px] font-semibold text-gray-800">
              Product Description
            </label>
            <textarea
              placeholder="Product Description"
              rows={4}
              className="col-span-9 border border-gray-300 bg-gray-100 rounded-md px-4 py-2 focus:outline-none "
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-12 gap-6 items-start">
              <label className="col-span-12 md:col-span-3 text-[16px] font-semibold text-gray-800 pt-2">
                Main Image
              </label>

              <div className="col-span-12 md:col-span-9">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  id="mainImage"
                  className="hidden"
                  onChange={(e) => setMainImage(e.target.files[0])}
                />

                <label
                  htmlFor="mainImage"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-green-500 transition bg-gray-50"
                >
                  <CloudUpload className="mx-auto mb-2 text-green-500" />
                  <p className="font-medium text-gray-800">
                    {mainImage ? mainImage.name : "Click to upload main image"}
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    (JPEG, PNG, WEBP)
                  </p>
                </label>
                {mainImage && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </p>

                    <div className="relative group w-40 h-40 border rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={URL.createObjectURL(mainImage)}
                        width={100}
                        height={100}
                        alt="Main product preview"
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Are you sure you want to remove the main image?",
                          );
                          if (confirmed) setMainImage(null);
                        }}
                        className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full
                   opacity-0 group-hover:opacity-100 transition
                   hover:bg-red-600 hover:cursor-pointer"
                        aria-label="Remove main image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

        
            <div className="grid grid-cols-12 gap-6 items-start">
              <label className="col-span-12 md:col-span-3 text-[16px] font-semibold text-gray-800 pt-2">
                Feature Images
              </label>

              <div className="col-span-12 md:col-span-9">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  id="featureImages"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setFeatureImages((prev) => {
                      if (prev.length >= 5) {
                        alert("You can upload a maximum of 5 feature images.");
                        return prev;
                      }
                      return [...prev, file];
                    });

                    e.target.value = "";
                  }}
                />

                <label
                  htmlFor="featureImages"
                  className={`block border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition
    ${
      featureImages.length >= 5
        ? "border-gray-200 bg-gray-100 cursor-not-allowed"
        : "border-gray-300 hover:border-green-500 bg-gray-50"
    }`}
                >
                  <CloudUpload className="mx-auto mb-2 text-green-500" />
                  <p className="font-medium text-gray-800">
                    {featureImages.length >= 5
                      ? "Maximum 5 images uploaded"
                      : "Click to add a feature image"}
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    {featureImages.length}/5 images added
                  </p>
                </label>

                {featureImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Previews ({featureImages.length}/5)
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {featureImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={URL.createObjectURL(image)}
                            width={100}
                            height={100}
                            alt={`Feature preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setFeatureImages((prev) =>
                                prev.filter((_, i) => i !== index),
                              )
                            }
                            className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full
                       opacity-0 group-hover:opacity-100 transition
                       hover:bg-red-600 hover:cursor-pointer"
                            aria-label="Remove feature image"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-3 text-[16px] font-semibold text-gray-800">
              Category
            </label>
            <div className="col-span-9 relative">
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none bg-white text-gray-700 cursor-pointer transition-all duration-200 appearance-none pr-10"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="Haircare">Haircare</option>
                <option value="Skincare">Skincare</option>
                <option value="Crystals">Crystals</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-3 text-[16px] font-semibold text-gray-800">
              Product Price
            </label>
            <div className="col-span-9 flex items-center border border-gray-300 rounded-md px-4 py-2">
              <DollarSign size={18} className="text-gray-500 mr-2" />
              <input
                type="number"
                placeholder="OriginalPrice"
                className="flex-1 focus:outline-none"
                value={productPrice}
                onChange={(e) => {
                  setproductPrice(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-3 text-[16px] font-semibold text-gray-800">
              Sale Price
            </label>
            <div className="col-span-9 flex items-center border border-gray-300 rounded-md px-4 py-2">
              <DollarSign size={18} className="text-gray-500 mr-2" />
              <input
                type="number"
                placeholder="Sale Price"
                className="flex-1 focus:outline-none"
                value={salePrice}
                onChange={(e) => {
                  setsalePrice(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 items-center">
            <label className="col-span-3 text-[16px] font-semibold text-gray-800">
              Product Quantity
            </label>
            <input
              type="text"
              placeholder="Product Quantity"
              className="col-span-9 border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-md border bg-white hover:bg-gray-100 w-[49%] cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={addProduct}
            className="px-8 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 w-[49%] cursor-pointer"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
