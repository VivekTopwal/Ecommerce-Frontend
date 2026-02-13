"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { ArrowLeft, Printer, Package, User, MapPin, CreditCard, DollarSign, Phone, Mail, FileText, } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ViewOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, isAuthenticated, isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      fetchOrder();
    } else {
      router.push("/admin/login");
    }
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${id}`,
        { headers: getAuthHeaders() }
      );
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error("Order not found");
        router.push("/admin/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order");
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!order) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .header h1 { font-size: 28px; margin: 0; color: #333; }
            .header p { color: #666; margin: 5px 0; }
            .section { margin-bottom: 30px; }
            .section h3 { border-bottom: 1px solid #ddd; padding-bottom: 8px; color: #333; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
            .status { display: inline-block; padding: 6px 16px; border-radius: 20px; 
                      background: #10b981; color: white; font-size: 13px; font-weight: bold; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
            .info-item { margin: 8px 0; }
            .info-label { font-weight: bold; color: #555; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
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
            <p>Status: <span class="status">${order.status.toUpperCase()}</span></p>
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
              <p class="info-item">${order.shippingAddress?.zipCode || ""}</p>
              <p class="info-item">${order.shippingAddress?.country || ""}</p>
            </div>
          </div>
          
          <div class="section">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  ?.map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">$${item.price?.toFixed(2)}</td>
                    <td style="text-align: right;">$${(item.price * item.quantity)?.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right;">Subtotal</td>
                  <td style="text-align: right;">$${order.itemsPrice?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="text-align: right;">Shipping</td>
                  <td style="text-align: right;">${order.shippingPrice === 0 ? "FREE" : "$" + order.shippingPrice?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="text-align: right;">Tax</td>
                  <td style="text-align: right;">$${order.taxPrice?.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3" style="text-align: right; font-size: 16px;">TOTAL</td>
                  <td style="text-align: right; font-size: 16px;">$${order.totalPrice?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h3>Payment Information</h3>
            <p><strong>Payment Method:</strong> ${order.paymentMethod?.toUpperCase()}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus?.toUpperCase()}</p>
            ${order.orderNotes ? `<p><strong>Order Notes:</strong> ${order.orderNotes}</p>` : ""}
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer-generated invoice. No signature required.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  if (loading) {
    return (
      <div className="p-6 bg-[#f7f7f5] min-h-screen">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="p-6 bg-[#f7f7f5] min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin/orders")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Orders</span>
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-500 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
      
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium"
          >
            <Printer size={18} />
            Print Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-emerald-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Information
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-1" size={16} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Name
                  </p>
                  <p className="text-gray-900 font-medium">
                    {order.customerInfo?.firstName}{" "}
                    {order.customerInfo?.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-1" size={16} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Email
                  </p>
                  <p className="text-gray-900 font-medium">
                    {order.customerInfo?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-1" size={16} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    Phone
                  </p>
                  <p className="text-gray-900 font-medium">
                    {order.customerInfo?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-emerald-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">
                Shipping Address
              </h2>
            </div>
            <div className="text-gray-700 space-y-1 text-sm">
              <p className="font-medium">{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </p>
              <p>{order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="text-emerald-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Information
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Method</span>
                <span className="font-medium text-gray-900 uppercase">
                  {order.paymentMethod}
                </span>
              </div>
        
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
          </div>
          {order.orderNotes && (
            <div className="bg-amber-50 rounded-xl p-6 shadow-sm border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="text-amber-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Notes
                </h2>
              </div>
              <p className="text-sm text-gray-700">{order.orderNotes}</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <Package className="text-emerald-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">
                Order Items ({order.items?.length})
              </h2>
            </div>

            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover w-20 h-20 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Quantity: {item.quantity}</span>
                      <span>•</span>
                      <span>Price: ${item.price?.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${(item.price * item.quantity)?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="text-emerald-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ${order.itemsPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-emerald-600">
                  {order.shippingPrice === 0
                    ? "FREE"
                    : `$${order.shippingPrice?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium text-gray-900">
                  ${order.taxPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-emerald-50 -mx-6 px-6 rounded-lg mt-4">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${order.totalPrice?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
}