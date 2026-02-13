"use client";
import {
  Printer,
  Search as SearchIcon,
  ChevronDown,
  Download,
  Eye,
  X,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import Image from "next/image";

export default function OrdersPage() {
  const router = useRouter();
  const { token, isAuthenticated, isAdmin } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [limit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchOrders = useCallback(
    async (page = 1) => {
      if (!isAuthenticated() || !isAdmin()) return;
      setLoading(true);

      try {
        const params = new URLSearchParams({
          page,
          limit,
          ...(search && { search }),
          ...(statusFilter !== "all" && { status: statusFilter }),
          ...(methodFilter !== "all" && { paymentMethod: methodFilter }),
          ...(dateRange !== "all" && { dateRange }),
          ...(startDate && endDate && { startDate, endDate }),
        });

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/orders?${params}`,
          { headers: getAuthHeaders() },
        );

        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/admin/login");
          return;
        }

        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
          setPagination(data.pagination);
          setCurrentPage(page);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    },
 [token,search,statusFilter,methodFilter,dateRange,startDate,endDate,limit,],
  );

  useEffect(() => {
    fetchOrders(1);
  }, [search, statusFilter, methodFilter, dateRange]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Order status updated");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );

        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };


   const handleViewOrder = (orderId) => {
  router.push(`/admin/orders/${orderId}`);
};

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchOrders(1);
    } else {
      toast.error("Please select both start and end dates");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setMethodFilter("all");
    setDateRange("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };


  const handleDownloadAll = () => {
    if (orders.length === 0) {
      toast.error("No orders to download");
      return;
    }

    const headers = [
      "Order Number",
      "Customer Name",
      "Email",
      "Amount",
      "Status",
      "Payment Method",
      "Date",
    ];

    const csvData = orders.map((order) => [
      order.orderNumber,
      `${order.customerInfo?.firstName} ${order.customerInfo?.lastName}`,
      order.customerInfo?.email,
      order.totalPrice?.toFixed(2),
      order.status,
      order.paymentMethod,
      new Date(order.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Orders downloaded!");
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { font-size: 24px; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            .section { margin-bottom: 20px; }
            .section h3 { border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 12px; 
                      background: #10b981; color: white; font-size: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-item { margin: 5px 0; }
            .info-label { font-weight: bold; color: #555; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p>Order #${order.orderNumber}</p>
            <p>Date: ${new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
            <p>Status: <span class="status">${order.status?.toUpperCase()}</span></p>
          </div>
          
          <div class="grid">
            <div class="section">
              <h3>Customer Information</h3>
              <p class="info-item"><span class="info-label">Name:</span> ${order.customerInfo?.firstName} ${order.customerInfo?.lastName}</p>
              <p class="info-item"><span class="info-label">Email:</span> ${order.customerInfo?.email}</p>
              <p class="info-item"><span class="info-label">Phone:</span> ${order.customerInfo?.phone || "N/A"}</p>
            </div>
            <div class="section">
              <h3>Shipping Address</h3>
              <p class="info-item">${order.shippingAddress?.address || ""}</p>
              <p class="info-item">${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""}</p>
              <p class="info-item">${order.shippingAddress?.zipCode || ""}, ${order.shippingAddress?.country || ""}</p>
            </div>
          </div>
          
          <div class="section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  ?.map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price?.toFixed(2)}</td>
                    <td>$${(item.price * item.quantity)?.toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
                <tr class="total-row">
                  <td colspan="3">Subtotal</td>
                  <td>$${order.itemsPrice?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3">Shipping</td>
                  <td>${order.shippingPrice === 0 ? "FREE" : "$" + order.shippingPrice?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3">Tax</td>
                  <td>$${order.taxPrice?.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3">TOTAL</td>
                  <td>$${order.totalPrice?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <p><strong>Payment Method:</strong> ${order.paymentMethod?.toUpperCase()}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus?.toUpperCase()}</p>
            ${order.orderNotes ? `<p><strong>Notes:</strong> ${order.orderNotes}</p>` : ""}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };


  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return (
      new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " " +
      new Date(dateString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-emerald-500 text-white",
      pending: "bg-orange-500 text-white",
      cancelled: "bg-red-500 text-white",
      processing: "bg-blue-500 text-white",
      shipped: "bg-purple-500 text-white",
    };
    return colors[status?.toLowerCase()] || "bg-gray-500 text-white";
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchOrders(page);
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
      ) {
        pages.push(i);
      }
      if (current < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
     
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
         
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or order"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>

      
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none appearance-none bg-white pr-10"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

      
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none appearance-none bg-white pr-10"
            >
              <option value="all">Order limits</option>
              <option value="5days">Last 5 Days</option>
              <option value="7days">Last 7 Days</option>
              <option value="15days">Last 15 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none appearance-none bg-white pr-10"
            >
              <option value="all">Method</option>
              <option value="cod">Cash on Delivery</option>
              <option value="card">Card</option>
              <option value="paypal">PayPal</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={handleDownloadAll}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 text-sm rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Download size={16} />
            Download All Orders
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-2 md:col-span-2">
            <button
              onClick={handleFilter}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 text-sm rounded-lg font-medium transition-colors"
            >
              Apply Filter
            </button>
            <button
              onClick={resetFilters}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 text-sm rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

   
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Order Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                  
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDateTime(order.createdAt)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customerInfo?.firstName}{" "}
                          {order.customerInfo?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customerInfo?.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700 uppercase">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">
                        ${order.totalPrice?.toFixed(2)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block w-full max-w-[150px]">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateStatus(order._id, e.target.value)
                          }
                          disabled={updatingStatus === order._id}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none appearance-none bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="text-gray-500 hover:text-emerald-600 transition-colors p-1.5 hover:bg-emerald-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handlePrintInvoice(order)}
                          className="text-gray-500 hover:text-emerald-600 transition-colors p-1.5 hover:bg-emerald-50 rounded-lg"
                          title="Print Invoice"
                        >
                          <Printer size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <ShoppingBag
                      className="mx-auto mb-3 text-gray-300"
                      size={48}
                    />
                    <p className="text-gray-500 font-medium">No orders found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try adjusting your filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing {orders.length} of {pagination.totalDocs || 0} orders
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pagination.hasPrevPage
                  ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
