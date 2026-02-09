"use client";
import { Printer, Search as SearchIcon, ChevronDown, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";

export default function OrdersPage() {
  const router = useRouter();

  const staticOrders = [
    {
      _id: "ord001",
      invoiceNo: "12362",
      customerName: "Suganya R",
      amount: 2168.52,
      status: "Delivered",
      method: "Cash",
      createdAt: "2026-02-07T12:54:00Z",
    },
 
  ];

  const [orders, setOrders] = useState(staticOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderLimitFilter, setOrderLimitFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalDocs: 7,
    totalPages: 1,
    page: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [limit] = useState(10);

  const fetchOrders = useCallback(async (page = 1) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders?page=${page}&limit=${limit}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();
      const ordersArray = data?.orders || [];

      setOrders(ordersArray);
      setPagination(data?.pagination || {});
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  }, [limit]);

  useEffect(() => {
    // fetchOrders(1);
  }, [fetchOrders]);

  const filtered = useMemo(() => {
    let temp = [...orders];

    if (search) {
      temp = temp.filter((o) =>
        o.customerName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      temp = temp.filter((o) => o.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (methodFilter !== "all") {
      temp = temp.filter((o) => o.method.toLowerCase() === methodFilter.toLowerCase());
    }

    if (startDate && endDate) {
      temp = temp.filter((o) => {
        const orderDate = new Date(o.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return orderDate >= start && orderDate <= end;
      });
    }

    return temp;
  }, [orders, search, statusFilter, methodFilter, startDate, endDate]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setOrderLimitFilter("all");
    setMethodFilter("all");
    setStartDate("");
    setEndDate("");
  };

  const handleDownloadAll = () => {
    alert("Downloading all orders...");
  };

  const handleFilter = () => {
    console.log("Filtering orders...");
  };

  const handleViewInvoice = (id) => {
    router.push(`/admin/invoice/${id}`);
  };

  const handlePrintInvoice = (id) => {
    alert(`Printing invoice for order ${id}`);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric',
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Delivered': 'bg-emerald-500 text-white',
      'Pending': 'bg-orange-500 text-white',
      'Cancel': 'bg-red-500 text-white',
      'Processing': 'bg-blue-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchOrders(page);
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
    <div className="p-6 bg-gray-50 min-h-screen">
   
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Customer Name"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none "
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none appearance-none bg-white pr-10"
            >
              <option value="all">Status</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending">Pending</option>
              <option value="Cancel">Cancel</option>
              <option value="Processing">Processing</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={orderLimitFilter}
              onChange={(e) => setOrderLimitFilter(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none  appearance-none bg-white pr-10"
            >
              <option value="all">Order limits</option>
              <option value="0-100">Last 5 days orders</option>
              <option value="100-500">Last 7 days orders</option>
              <option value="500+">Last 15 days orders</option>
              <option value="500+">Last 30 days orders</option>
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
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Online">Credit</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={handleDownloadAll}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 text-sm rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm w-[85%]"
          >
            <Download size={16} />
            Download All Orders
          </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
  <div>
    <label className="block text-[15px] font-medium text-black mb-1.5">
      Start Date
    </label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
    />
  </div>

  <div>
    <label className="block text-[15px] font-medium text-black mb-1.5">
      End Date
    </label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg"
    />
  </div>

<div className="flex gap-2 md:col-span-2">
  <button
    onClick={handleFilter}
    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 text-sm rounded-lg font-medium"
  >
    Filter
  </button>

  <button
    onClick={resetFilters}
    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 text-sm rounded-lg font-medium"
  >
    Reset
  </button>
</div>

</div>


      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Invoice No
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Order Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Invoice
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length > 0 ? (
                filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.invoiceNo}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDateTime(order.createdAt)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {order.customerName}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="font-medium">{order.method}</span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(order.amount)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block w-full max-w-[140px]">
                        <select
                          defaultValue={order.status}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none  appearance-none bg-white cursor-pointer"
                        >
                          <option value="Delivered">Delivered</option>
                          <option value="Pending">Pending</option>
                          <option value="Cancel">Cancel</option>
                          <option value="Processing">Processing</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePrintInvoice(order._id)}
                          className="text-gray-500 hover:text-emerald-600 transition-colors p-1 hover:bg-emerald-50 rounded"
                          title="Print Invoice"
                        >
                          <Printer size={18} />
                        </button>
                        <button
                          onClick={() => handleViewInvoice(order._id)}
                          className="text-gray-500 hover:text-emerald-600 transition-colors p-1 hover:bg-emerald-50 rounded"
                          title="View Invoice"
                        >
                          <SearchIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600 font-medium">
            Page {currentPage} of {pagination.totalPages || 1}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevious}
              disabled={!pagination.hasPrevPage}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-emerald-500 text-white shadow-sm"
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