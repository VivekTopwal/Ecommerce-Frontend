"use client";
import { Plus, Trash2, SquarePen, Eye, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    totalDocs: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [limit] = useState(10);

  const fetchCustomers = useCallback(async (page = 1) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers?page=${page}&limit=${limit}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();
      const customersArray = data?.customers || [];

      setCustomers(customersArray);
      setPagination(data?.pagination || {});
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      setCustomers([]);
    }
  }, [limit]);

//   useEffect(() => {
//     fetchCustomers(1);
//   }, [fetchCustomers]);

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${id}/status`,
        { method: "PATCH" }
      );

      if (res.ok) {
        setCustomers(prev => prev.map(c => 
          c._id === id ? { ...c, isActive: !c.isActive } : c
        ));
      } else {
        alert("Failed to update customer status");
      }
    } catch (error) {
      console.error("Error toggling customer status:", error);
      alert("Failed to update customer status");
    }
  };

  const filtered = useMemo(() => {
    let temp = [...customers];

    if (search) {
      temp = temp.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
      );
    }

    if (statusFilter !== "all") {
      temp = temp.filter((c) => {
        if (statusFilter === "active") return c.isActive !== false;
        if (statusFilter === "inactive") return c.isActive === false;
        return true;
      });
    }

    return temp;
  }, [customers, search, statusFilter]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
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

  const deleteCustomer = async (id) => {
    if (!confirm("Delete this customer? This action cannot be undone.")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${id}`, {
        method: "DELETE",
      });

      fetchCustomers(currentPage);
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer");
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected customer(s)?`)) return;

    try {
      await Promise.all(
        selected.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${id}`, {
            method: "DELETE",
          }),
        ),
      );

      setSelected([]);
      fetchCustomers(currentPage);
    } catch (error) {
      console.error("Error deleting customers:", error);
      alert("Failed to delete customers");
    }
  };

  const handleView = (id) => {
    router.push(`/admin/customer/${id}`);
  };

  const handleEdit = (id) => {
    router.push(`/admin/edit-customer/${id}`);
  };

  const handleAddCustomer = () => {
    router.push("/admin/add-customer");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchCustomers(page);
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 bg-[#f7f7f5] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your customer database
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBulkDelete}
            className="btn-danger cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-300 disabled:text-white"
            disabled={selected.length === 0}
          >
            <Trash2 size={16} /> Delete ({selected.length})
          </button>
          <button
            onClick={handleAddCustomer}
            className="btn-primary cursor-pointer"
          >
            <Plus size={16} /> Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex min-w-[250px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by name, email, or phone"
            className="input w-full pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input min-w-[150px]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button onClick={resetFilters} className="btn-secondary cursor-pointer">
          Reset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filtered.length} of {pagination.totalDocs} customers
          </div>
        </div>

        <div className="overflow-x-auto">
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
                <th className="px-4 py-3 text-left">CUSTOMER</th>
                <th className="px-4 py-3 text-center">EMAIL</th>
                <th className="px-4 py-3 text-center">PHONE</th>
                <th className="px-4 py-3 text-center">JOINED</th>
                <th className="px-4 py-3 text-center">STATUS</th>
                <th className="px-4 py-3 text-center">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filtered.length > 0 ? (
                filtered.map((customer) => (
                  <tr
                    key={customer._id}
                    className={`hover:bg-gray-50 ${customer.isActive === false ? 'opacity-60 bg-gray-50' : ''}`}
                  >
                    <td className="px-4 py-3 align-middle">
                      <input
                        type="checkbox"
                        checked={selected.includes(customer._id)}
                        onChange={() => toggleSelect(customer._id)}
                      />
                    </td>

                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {customer.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">ID: {customer._id?.slice(-8)}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center align-middle">
                      <div className="text-gray-700">{customer.email || '-'}</div>
                    </td>

                    <td className="px-4 py-3 text-center align-middle">
                      <div className="text-gray-700">{customer.phone || '-'}</div>
                    </td>

                    <td className="px-4 py-3 text-center align-middle">
                      <div className="text-gray-600 text-xs">
                        {formatDate(customer.createdAt || customer.joinedDate)}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center align-middle">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customer.isActive ?? true}
                          onChange={() => toggleStatus(customer._id)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                    </td>

                    <td className="px-4 py-3 align-middle">
                      <div className="flex justify-center gap-3">
                        <div className="relative group">
                          <Eye
                            size={20}
                            className="text-gray-500 cursor-pointer hover:text-green-600 transition-colors"
                            onClick={() => handleView(customer._id)}
                          />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            View Details
                          </span>
                        </div>
                        <div className="relative group">
                          <SquarePen
                            size={20}
                            className="text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => handleEdit(customer._id)}
                          />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-blue-600 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Edit Customer
                          </span>
                        </div>
                        <div className="relative group">
                          <Trash2
                            size={20}
                            className="text-gray-500 cursor-pointer hover:text-red-600 transition-colors"
                            onClick={() => deleteCustomer(customer._id)}
                          />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-red-600 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            Delete Customer
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No customers found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {pagination.totalPages || 1}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!pagination.hasPrevPage}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                pagination.hasPrevPage
                  ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
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
              className={`px-3 py-1.5 rounded text-sm font-medium ${
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