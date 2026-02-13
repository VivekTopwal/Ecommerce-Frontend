"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Package, Truck, CreditCard } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";


export default function OrderConfirmationPage() {
  const router = useRouter();
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated } = useAuth();
  const getAuthHeaders = () => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/number/${orderNumber}`,
            {
               headers: getAuthHeaders(),
            }
        );
        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
        } else {
          toast.error("Order not found");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber, router, token, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
       
        <div className="bg-white rounded-lg p-8 shadow-sm mb-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We&apos;ve sent a confirmation email to{" "}
            <strong>{order.customerInfo.email}</strong>
          </p>
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-orange-500">{order.orderNumber}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Package size={20} />
                <span className="font-medium">Order Status</span>
              </div>
              <p className="ml-7 capitalize">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {order.orderStatus}
                </span>
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <CreditCard size={20} />
                <span className="font-medium">Payment Method</span>
              </div>
              <p className="ml-7 capitalize">{order.paymentMethod}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start gap-2 text-gray-600 mb-2">
              <Truck size={20} className="mt-1" />
              <div className="flex-1">
                <p className="font-medium mb-1">Shipping Address</p>
                <p className="text-sm text-gray-700">
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </p>
                <p className="text-sm text-gray-700">{order.shippingAddress.address}</p>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex gap-4 pb-4 border-b last:border-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm font-semibold text-orange-500">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Price Summary</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {order.shippingPrice === 0 ? "FREE" : `$${order.shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-orange-500">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

       
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition cursor-pointer"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}