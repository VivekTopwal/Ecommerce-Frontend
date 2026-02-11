"use client";
import {
  Plus,
  Trash2,
  SquarePen,
  Eye,
  Search,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  X,
  ShoppingBag,
  Mail,
  Phone,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import Image from "next/image";

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

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [createForm, setCreateForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

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

  const handleView = async (id) => {
    setCustomerLoading(true);
    setShowViewModal(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${id}`,
        { headers: getAuthHeaders() }
      );

      const data = await res.json();

      if (data.success) {
        setSelectedCustomer(data.customer);
      } else {
        toast.error("Failed to load customer details");
        setShowViewModal(false);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to load customer details");
      setShowViewModal(false);
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ ...createForm, role: "user" }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Customer created successfully");
        setShowCreateModal(false);
        setCreateForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
        });
        fetchCustomers(currentPage);
      } else {
        toast.error(data.message || "Failed to create customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create customer");
    } finally {
      setModalLoading(false);
    }
  };
  const openEditModal = (customer) => {
    setEditCustomer(customer);
    setEditForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone || "",
    });
    setShowEditModal(true);
  };

  const handleEditCustomer = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${editCustomer._id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(editForm),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Customer updated successfully");
        setShowEditModal(false);
        fetchCustomers(currentPage);
      } else {
        toast.error(data.message || "Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    } finally {
      setModalLoading(false);
    }
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

  const deleteCustomer = async (id) => {
    if (!confirm("Delete this customer? This action cannot be undone.")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Customer deleted successfully");
        fetchCustomers(currentPage);
      } else {
        toast.error(data.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected customer(s)?`)) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/bulk-delete`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
          body: JSON.stringify({ ids: selected }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setSelected([]);
        fetchCustomers(currentPage);
      } else {
        toast.error(data.message || "Failed to delete customers");
      }
    } catch (error) {
      console.error("Error bulk deleting:", error);
      toast.error("Failed to delete customers");
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === customers.length) {
      setSelected([]);
    } else {
      setSelected(customers.map((c) => c._id));
    }
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

  const getStatusBadge = (status) => {
    if (status === "delivered")
      return "bg-emerald-100 text-emerald-800 capitalize";
    if (status === "pending") return "bg-orange-100 text-orange-800 capitalize";
    if (status === "cancelled") return "bg-red-100 text-red-800 capitalize";
    if (status === "processing") return "bg-blue-100 text-blue-800 capitalize";
    return "bg-gray-100 text-gray-800 capitalize";
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

        <div className="flex gap-2">
          <button
            onClick={handleBulkDelete}
            disabled={selected.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Trash2 size={16} />
            Delete ({selected.length})
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
          >
            <Plus size={16} />
            Add Customer
          </button>
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
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === customers.length &&
                      customers.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
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
                      <input
                        type="checkbox"
                        checked={selected.includes(customer._id)}
                        onChange={() => toggleSelect(customer._id)}
                        className="rounded"
                      />
                    </td>

                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
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
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Eye size={18} />
                          </button>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 text-xs text-white bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                            View
                          </span>
                        </div>

                          <div className="relative group">
                          <button
                            onClick={() => openEditModal(customer)}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
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
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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

      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                Customer Details
              </h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCustomer(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {customerLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : selectedCustomer ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {selectedCustomer.firstName?.charAt(0).toUpperCase()}
                      {selectedCustomer.lastName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedCustomer.firstName}{" "}
                        {selectedCustomer.lastName}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Customer since {formatDate(selectedCustomer.createdAt)}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedCustomer.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedCustomer.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <ShoppingBag
                        className="mx-auto mb-2 text-blue-600"
                        size={24}
                      />
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedCustomer.ordersCount || 0}
                      </p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 text-center">
                      <DollarSign
                        className="mx-auto mb-2 text-emerald-600"
                        size={24}
                      />
                      <p className="text-2xl font-bold text-emerald-600">
                        ${selectedCustomer.totalSpent?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-sm text-gray-600">Total Spent</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-700">
                        {selectedCustomer.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-700">
                        {selectedCustomer.phone || "Not provided"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-700">
                        Joined {formatDate(selectedCustomer.createdAt)}
                      </span>
                    </div>
                  </div>

                  {selectedCustomer.recentOrders?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Recent Orders
                      </h4>
                      <div className="space-y-2">
                        {selectedCustomer.recentOrders
                          .slice(0, 5)
                          .map((order) => (
                            <div
                              key={order._id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-sm text-gray-900">
                                  {order.orderNumber}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-sm text-gray-900">
                                  ${order.totalPrice?.toFixed(2)}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Add New Customer
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={createForm.firstName}
                    onChange={(e) =>
                      setCreateForm((p) => ({
                        ...p,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    value={createForm.lastName}
                    onChange={(e) =>
                      setCreateForm((p) => ({
                        ...p,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={createForm.phone}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, password: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm disabled:opacity-50"
                >
                  {modalLoading ? "Creating..." : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Customer
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditCustomer} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, firstName: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, lastName: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm disabled:opacity-50"
                >
                  {modalLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}