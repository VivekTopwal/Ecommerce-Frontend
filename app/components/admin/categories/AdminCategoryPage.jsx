"use client";
import { Plus, Trash2, SquarePen, Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";

export default function AdminCategoryPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
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

  const fetchCategories = useCallback(async (page = 1) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories?page=${page}&limit=${limit}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();
      const categoriesArray = data?.categories || [];

      setCategories(categoriesArray);
      setPagination(data?.pagination || {});
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  }, [limit]);

  useEffect(() => {
    fetchCategories(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCategories]);

  const togglePublish = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}/publish`,
        { method: "PATCH" }
      );

      if (res.ok) {
        setCategories(prev => prev.map(c => 
          c._id === id ? { ...c, isPublished: !c.isPublished } : c
        ));
      } else {
        alert("Failed to update publish status");
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update publish status");
    }
  };

  const filtered = useMemo(() => {
    let temp = [...categories];

    if (search) {
      temp = temp.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return temp;
  }, [categories, search]);

  const resetFilters = () => {
    setSearch("");
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
      setSelected(filtered.map((c) => c._id));
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`, {
        method: "DELETE",
      });

      fetchCategories(currentPage);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm("Delete selected categories?")) return;

    try {
      await Promise.all(
        selected.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${id}`, {
            method: "DELETE",
          }),
        ),
      );

      setSelected([]);
      fetchCategories(currentPage);
    } catch (error) {
      console.error("Error deleting categories:", error);
      alert("Failed to delete categories");
    }
  };

  const handleView = (id) => {
    router.push(`/admin/category/${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/admin/edit-category/${id}`);
  };

  const handleAddCategory = () => {
    router.push("/admin/add-category");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchCategories(page);
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
            className="btn-danger cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-white"
            disabled={selected.length === 0}
          >
            <Trash2 size={16} /> Delete
          </button>
          <button
            onClick={handleAddCategory}
            className="btn-primary cursor-pointer"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by category name"
            className="input w-83"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700" />
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
              <th className="px-4 py-3 text-left">CATEGORY</th>
              <th className="px-4 py-3 text-center">ICON</th>
              <th className="px-4 py-3 text-center">DESCRIPTION</th>
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
                    <div className="font-medium">{item.name}</div>
                  </td>

                  <td className="px-4 py-3 text-center align-middle">
                    {item.icon ? (
                      <div className="flex justify-center">
                        <Image
                          src={item.icon}
                          width={40}
                          height={40}
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No icon</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center align-middle max-w-xs">
                    <div className="truncate" title={item.description}>
                      {item.description || '-'}
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
                        <Eye
                          size={20}
                          className="text-gray-500 cursor-pointer hover:text-green-600 transition-colors"
                          onClick={() => handleView(item._id)}
                        />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-600 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          View
                        </span>
                      </div>
                      <div className="relative group">
                        <SquarePen
                          size={20}
                          className="text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => handleEdit(item._id)}
                        />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-blue-500 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Edit
                        </span>
                      </div>
                      <div className="relative group">
                        <Trash2
                          size={20}
                          className="text-gray-500 cursor-pointer hover:text-red-600 transition-colors"
                          onClick={() => deleteCategory(item._id)}
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
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No categories found
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
                  key={page}
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