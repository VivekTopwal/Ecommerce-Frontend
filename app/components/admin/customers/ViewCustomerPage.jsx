"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ArrowLeft, Mail, Phone, Calendar, ShoppingBag, DollarSign, Shield, UserCheck, UserX, Package, } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ViewCustomerPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, isAuthenticated, isAdmin } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      fetchCustomer();
    } else {
      router.push("/admin/login");
    }
  }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${id}`,
        { headers: getAuthHeaders() }
      );

      const data = await res.json();

      if (data.success) {
        setCustomer(data.customer);
      } else {
        toast.error("Customer not found");
        router.push("/admin/customers");
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to load customer");
      router.push("/admin/customers");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      delivered: "bg-emerald-100 text-emerald-800",
      pending: "bg-orange-100 text-orange-800",
      cancelled: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
    };
    return badges[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-6 bg-[#f7f7f5] min-h-screen">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading customer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="p-6 bg-[#f7f7f5] min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/customers")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Customers</span>
        </button>

        <div className="flex justify-between items-start mt-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-bold text-2xl">
              {customer.firstName?.charAt(0).toUpperCase()}
              {customer.lastName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {customer.firstName} {customer.lastName}
              </h1>
              <p className="text-gray-500 mt-1">Customer ID: {customer._id}</p>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    customer.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {customer.isActive ? (
                    <>
                      <UserCheck size={14} />
                      Active
                    </>
                  ) : (
                    <>
                      <UserX size={14} />
                      Inactive
                    </>
                  )}
                </span>
                {customer.role === "admin" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                    <Shield size={14} />
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="text-blue-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">
                {customer.ordersCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="text-emerald-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-3xl font-bold text-emerald-600">
                ${customer.totalSpent?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="text-purple-600" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Since</p>
              <p className="text-lg font-bold text-gray-900">
                {formatDate(customer.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="text-gray-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Email
                  </p>
                  <p className="text-gray-900 font-medium">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="text-gray-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Phone
                  </p>
                  <p className="text-gray-900 font-medium">
                    {customer.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="text-gray-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Joined
                  </p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="text-gray-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Last Updated
                  </p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(customer.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Package className="text-indigo-600" size={24} />
                <h2 className="text-lg font-bold text-gray-900">
                  Order History
                </h2>
              </div>
              <span className="text-sm text-gray-500">
                {customer.recentOrders?.length || 0} orders
              </span>
            </div>

            {customer.recentOrders && customer.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {customer.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition cursor-pointer"
                    onClick={() => router.push(`/admin/orders/${order._id}`)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${order.totalPrice?.toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1"
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={24}
                              height={24}
                              className="rounded object-cover w-6 h-6"
                            />
                          )}
                          <span className="text-xs text-gray-600">
                            {item.name}
                            {item.quantity > 1 && ` (×${item.quantity})`}
                          </span>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto mb-3 text-gray-300" size={48} />
                <p className="text-gray-500 font-medium">No orders yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  This customer hasn&apos;t placed any orders
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}