"use client";
import { Trash2, SquarePen, Eye, Search, Users, UserCheck, UserX, UserPlus} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";

export default function CustomersPage() {
  const router = useRouter();
  const { token, isAuthenticated, isAdmin } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});
  const [togglingId, setTogglingId] = useState(null);

  const [limit] = useState(10);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });


  const fetchCustomers = useCallback(
    async (page = 1) => {
      if (!isAuthenticated() || !isAdmin()) return;
      setLoading(true);

      try {
        const params = new URLSearchParams({
          page,
          limit,
          ...(search && { search }),
          ...(statusFilter !== "all" && { status: statusFilter }),
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/customers?${params}`,
          { headers: getAuthHeaders() }
        );

        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/admin/login");
          return;
        }

        const data = await res.json();

        if (data.success) {
          setCustomers(data.customers);
          setPagination(data.pagination);
          setStats(data.stats || {});
          setCurrentPage(page);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
        toast.error("Failed to load customers");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    },
    [token, search, statusFilter, limit, isAuthenticated, isAdmin]
  );

  useEffect(() => {
    fetchCustomers(1);
  }, [search, statusFilter]);

  const handleView = (id) => {
  router.push(`/admin/customer/${id}`);
};

  const handleEdit = (id) => {
  router.push(`/admin/edit-customer/${id}`);
};

  const toggleStatus = async (customer) => {
    setTogglingId(customer._id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${customer._id}/toggle-status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setCustomers((prev) =>
          prev.map((c) =>
            c._id === customer._id ? { ...c, isActive: data.isActive } : c
          )
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

const deleteCustomer = (id) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2 text-center">
        <p className="text-sm font-semibold text-red-500">
          Delete this customer?
        </p>
        <p className="text-xs text-gray-400">
          This action cannot be undone.
        </p>

        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Deleting customer...");

              try {
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${id}`,
                  {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                  }
                );

                const data = await res.json();

                toast.dismiss(loadingToast);

                if (data.success) {
                  toast.success("Customer deleted successfully");
                  fetchCustomers(currentPage);
                } else {
                  toast.error(
                    data.message || "Failed to delete customer"
                  );
                }
              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Failed to delete customer");
                console.error("Error deleting customer:", error);
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
      position: "top-center"
    }
  );
};

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchCustomers(page);
      setSelected([]);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages || 1;
    const current = currentPage;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("...");
      for (
        let i = Math.max(2, current - 1);
        i <= Math.min(totalPages - 1, current + 1);
        i++
      )
        pages.push(i);
      if (current < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <div className="p-6 bg-[#f7f7f5] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your customer database
          </p>
        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.totalCustomers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <UserCheck size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.activeCustomers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Inactive</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.inactiveCustomers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserPlus size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">New This Month</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.newThisMonth || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by name, email, or phone"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[150px]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          onClick={resetFilters}
          className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-sm transition"
        >
          Reset
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {customers.length} of {pagination.totalDocs || 0} customers
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-xs">
                  Customer
                </th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wider text-xs">
                  Contact
                </th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wider text-xs">
                  Orders
                </th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wider text-xs">
                  Total Spent
                </th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wider text-xs">
                  Joined
                </th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wider text-xs">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wider text-xs">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                      Loading customers...
                    </div>
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className={`hover:bg-gray-50 transition-colors ${
                      !customer.isActive ? "opacity-60" : ""
                    }`}
                  >
          
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-sm flex-shrink-0">
                          {customer.firstName?.charAt(0).toUpperCase()}
                          {customer.lastName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-xs text-gray-400">
                            #{customer._id?.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center align-middle">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700">
                          {customer.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.phone || "No phone"}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center align-middle">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                        {customer.ordersCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <span className="font-semibold text-emerald-600">
                        ${customer.totalSpent?.toFixed(2) || "0.00"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center align-middle">
                      <span className="text-sm text-gray-600">
                        {formatDate(customer.createdAt)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center align-middle">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customer.isActive ?? true}
                          onChange={() => toggleStatus(customer)}
                          disabled={togglingId === customer._id}
                          className="sr-only peer"
                        />
                        <div className="relative w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4 peer-disabled:opacity-50" />
                      </label>
                    </td>

                    <td className="px-4 py-3 align-middle">
                      <div className="flex justify-center gap-2">
                        <div className="relative group">
                          <button
                            onClick={() => handleView(customer._id)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          >
                            <Eye size={18} />
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-xs text-white bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                            View
                          </span>
                        </div>

                        <div className="relative group">
                          <button
                            onClick={() => handleEdit(customer._id)}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                          >
                            <SquarePen size={18} />
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-xs text-white bg-indigo-500 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                            Edit
                          </span>
                        </div>

                        <div className="relative group">
                          <button
                            onClick={() => deleteCustomer(customer._id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-xs text-white bg-red-500 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                            Delete
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No customers found
                      </p>
                      <p className="text-gray-400 text-sm">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {pagination.totalPages || 1}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                pagination.hasPrevPage
                  ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
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