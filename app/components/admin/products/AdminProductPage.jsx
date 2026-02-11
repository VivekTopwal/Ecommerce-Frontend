"use client";
import { Plus, Trash2, SquarePen, Eye, ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const router = useRouter();
  const { token, isAuthenticated, isAdmin } = useAuth();
  const getAuthHeaders = () => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [selected, setSelected] = useState([]);
 
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalDocs: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [limit] = useState(10); 

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/products?page=${page}&limit=${limit}`,
        {
        headers: getAuthHeaders(),
          cache: "no-store",
        }
      );

          if (!res.ok) {
          if (res.status === 401) {
            toast.error("Session expired. Please login again.");
            router.push("/admin/login");
            return;
          }
          throw new Error("Failed to fetch products");
        }

      const data = await res.json();
      const productsArray = data?.products || [];

      setProducts(productsArray);
      setPagination(data?.pagination || {});
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
        toast.error("Failed to load products");
      setProducts([]);
    }
  }, [limit, token, isAuthenticated, isAdmin]);

  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      fetchProducts(1);
       // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [fetchProducts, isAuthenticated, isAdmin]);

const togglePublish = async (id) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}/publish`,
      { 
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update publish status");
    }

    const data = await res.json();

    setProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, isPublished: data.isPublished } : p
      )
    );
    
    toast.success(
      data.isPublished ? "Product published" : "Product unpublished"
    );

  } catch (error) {
    console.error("Error toggling publish status:", error);
    toast.error("Failed to update publish status");
  }
};

  const filtered = useMemo(() => {
    let temp = [...products];

    if (search) {
      temp = temp.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    
    if (category && category !== "ALL") {
      temp = temp.filter((p) => p.category === category);
    }

    if (priceSort === "price_low") {
      temp.sort((a, b) => a.productPrice - b.productPrice);
    }

    if (priceSort === "price_high") {
      temp.sort((a, b) => b.productPrice - a.productPrice);
    }

    if (priceSort === "published") {
      temp = temp.filter((p) => p.isPublished === true);
    }

    if (priceSort === "unpublished") {
      temp = temp.filter((p) => p.isPublished === false);
    }

    if (priceSort === "selling") {
      temp = temp.filter((p) => p.quantity > 0);
    }

    if (priceSort === "quantity") {
      temp = temp.filter((p) => p.quantity === 0);
    }

    if (priceSort === "created_asc") {
      temp.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (priceSort === "created_desc") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (priceSort === "updated_asc") {
      temp.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    }

    if (priceSort === "updated_desc") {
      temp.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return temp;
  }, [products, search, category, priceSort]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setPriceSort("");
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((p) => p._id));
    }
  };

const deleteProduct = (id) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm">
          Are you sure you want to delete this product?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Deleting product...");

              try {
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`,
                  {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                  }
                );

                if (!res.ok) {
                  throw new Error("Failed to delete product");
                }

                toast.dismiss(loadingToast);
                toast.success("Product deleted successfully");
                fetchProducts(currentPage);
              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Failed to delete product");
                console.error("Error deleting product:", error);
              }
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded"
          >
            Delete
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
    }
  );
};


const handleBulkDelete = () => {
  if (selected.length === 0) {
    toast.error("No products selected");
    return;
  }

  toast(
    (t) => (
      <div className="flex flex-col gap-2 text-center">
        <p className="text-sm font-medium">
          Delete {selected.length} selected product
          {selected.length > 1 ? "s" : ""}?
        </p>

        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Deleting products...");

              try {
                await Promise.all(
                  selected.map((id) =>
                    fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${id}`,
                      {
                        method: "DELETE",
                        headers: getAuthHeaders(),
                      }
                    )
                  )
                );

                toast.dismiss(loadingToast);
                toast.success("Products deleted successfully");
                setSelected([]);
                fetchProducts(currentPage);
              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Failed to delete products");
                console.error("Error deleting products:", error);
              }
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded"
          >
            Delete
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


  const handleView = (slug) => {
    router.push(`/admin/product/${slug}`);
  };

  const handleEdit = (slug) => {
    router.push(`/admin/edit-product/${slug}`);
  };

  const handleAddProduct = () => {
    router.push("/admin/add-product");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchProducts(page);
      setSelected([]); 
    }
  };

  const handlePrevious = () => {
    if (pagination.hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    const current = currentPage;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
        pages.push(i);
      }

      if (current < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="p-6 bg-[#f7f7f5] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"></h1>
        <div className="flex gap-2">
          <button
            onClick={handleBulkDelete}
            className="btn-danger cursor-pointer disabled:opacity-50
                         disabled:cursor-not-allowed
                         disabled:bg-red-300
                         disabled:text-white"
            disabled={selected.length === 0}
          >
            <Trash2 size={16} /> Delete
          </button>
          <button
            onClick={handleAddProduct}
            className="btn-primary cursor-pointer"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search Product"
            className="input w-83!"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input w-83! appearance-none pr-10 cursor-pointer"
          >
            <option value="">Category</option>
            <option value="ALL">All</option>
            <option value="Haircare">Haircare</option>
            <option value="Skincare">Skincare</option>
            <option value="Crystals">Crystals</option>
          </select>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            className="input w-83! appearance-none pr-10 cursor-pointer"
          >
            <option value="">Price</option>

            <option value="price_low">Low to High</option>
            <option value="price_high">High to Low</option>

            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>

            <option value="selling">Status - Selling</option>
            <option value="quantity">Status - Out of Stock</option>

            <option value="created_asc">Date Added (Asc)</option>
            <option value="created_desc">Date Added (Desc)</option>

            <option value="updated_asc">Date Updated (Asc)</option>
            <option value="updated_desc">Date Updated (Desc)</option>
          </select>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>

        <button onClick={resetFilters} className="btn-secondary cursor-pointer">
          Reset
        </button>

      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selected.length === filtered.length && filtered.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left">PRODUCT NAME</th>
              <th className="px-4 py-3 text-center">CATEGORY</th>
              <th className="px-4 py-3 text-center">PRICE</th>
              <th className="px-4 py-3 text-center">SALE PRICE</th>
              <th className="px-4 py-3 text-center">STOCK</th>
              <th className="px-4 py-3 text-center">STATUS</th>
              <th className="px-4 py-3 text-center">VIEW</th>
              <th className="px-4 py-3 text-center">PUBLISHED</th>
              <th className="px-4 py-3 text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr 
                  key={item._id} 
                  className={`hover:bg-gray-50 ${!item.isPublished ? 'opacity-60 bg-gray-50' : ''}`}
                >
                  <td className="px-4 py-3 align-middle">
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() => toggleSelect(item._id)}
                    />
                  </td>

                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.mainImage || "/images/empty.jpg"}
                        width={100}
                        height={100}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      {item.name}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center align-middle">{item.category}</td>
                  <td className="px-4 py-3 text-center font-semibold align-middle">
                    ${item.productPrice}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold align-middle">
                    ${item.salePrice}
                  </td>
                  <td className="px-4 py-3 text-center align-middle">{item.quantity}</td>

                  <td className="px-4 py-3 text-center align-middle">
                    {item.quantity > 0 ? (
                      <span className="badge-success">Selling</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
                        Out of Stock
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center align-middle">
                    <div className="relative group inline-block">
                      <Eye
                        size={16}
                        className="mx-auto text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleView(item.slug)}
                      />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-600 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        View
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center align-middle">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isPublished ?? true}
                        onChange={() => togglePublish(item._id)}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-700 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </td>

                  <td className="px-4 py-3 align-middle">
                    <div className="flex justify-center gap-3">
                      <div className="relative group">
                        <SquarePen
                          size={20}
                          className="text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => handleEdit(item.slug)}
                        />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-blue-500 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Edit
                        </span>
                      </div>
                      <div className="relative group">
                        <Trash2
                          size={20}
                          className="text-gray-500 cursor-pointer hover:text-red-600 transition-colors"
                          onClick={() => deleteProduct(item._id)}
                        />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-red-500 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Delete
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {pagination.totalPages}
          </div>
          
          <div className="flex items-center gap-2">
  <button
    onClick={handlePrevious}
    disabled={!pagination.hasPrevPage}
    className={`px-3 py-1 rounded ${
      pagination.hasPrevPage
        ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
        : "text-gray-400 cursor-not-allowed"
    }`}
  >
    Previous
  </button>

  {getPageNumbers().map((page, index) => (
    page === '...' ? (
      <span key={`ellipsis-${index}`} className="px-2">...</span>
    ) : (
      <button
        key={`page-${page}`} 
        onClick={() => handlePageChange(page)}
        className={`px-3 py-1 rounded ${
          currentPage === page
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-100 cursor-pointer"
        }`}
      >
        {page}
      </button>
    )
  ))}

  <button
    onClick={handleNext}
    disabled={!pagination.hasNextPage}
    className={`px-3 py-1 rounded ${
      pagination.hasNextPage
        ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
        : "text-gray-400 cursor-not-allowed"
    }`}
  >
    Next
  </button>
</div>


        </div>
      </div>
    </div>
  );
}