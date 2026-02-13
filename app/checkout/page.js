"use client";
import { useState, useEffect } from "react";
import { useShop } from "@/app/context/ShopContext";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CreditCard, Truck, MapPin, ShoppingBag } from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import toast from "react-hot-toast";

export default function CheckoutPage() {
    const router = useRouter();
    const { cart } = useShop();
    const { token, isAuthenticated } = useAuth();
    const getAuthHeaders = () => {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    };
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState("");

    const searchParams = useSearchParams();
    const [isBuyNow, setIsBuyNow] = useState(false);
    const [buyNowItem, setBuyNowItem] = useState(null);
    const [formData, setFormData] = useState({

        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
        paymentMethod: "card",
        sameAsShipping: true,
        orderNotes: "",
    });

    const [billingAddress, setBillingAddress] = useState({
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
    });

    useEffect(() => {
        const id = localStorage.getItem("sessionId");
        setSessionId(id);

        const buyNowParam = searchParams.get("buyNow");

        if (buyNowParam === "true") {
            setIsBuyNow(true);
            const storedItem = sessionStorage.getItem("buyNowItem");

            if (storedItem) {
                setBuyNowItem(JSON.parse(storedItem));
            } else {
                router.push("/cart");
            }
        } else {
            if (!cart || cart.items.length === 0) {
                router.push("/cart");
            }
        }
    }, [cart, router, searchParams]);

    const checkoutItems = isBuyNow && buyNowItem ? [buyNowItem] : cart?.items || [];

    const calculateSubtotal = () => {
        if (isBuyNow && buyNowItem) {
            return buyNowItem.salePrice * buyNowItem.quantity;
        }
        return cart?.totalAmount || 0;
    };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

 const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50;
};

  const calculateTax = () => {
    return Number((calculateSubtotal() * 0.1).toFixed(2));
};

    const calculateTotal = () => {
        return Number((calculateSubtotal() + calculateShipping() + calculateTax()).toFixed(2));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                sessionId,
                items: isBuyNow ? [buyNowItem] : undefined,
                isBuyNow: isBuyNow,
                customerInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                },
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country,
                },
                billingAddress: formData.sameAsShipping ? undefined : billingAddress,
                paymentMethod: formData.paymentMethod,
                orderNotes: formData.orderNotes,
                sameAsShipping: formData.sameAsShipping,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(orderData),
            });

            const data = await res.json();
            if (data.success) {

                if (isBuyNow) {
                    sessionStorage.removeItem("buyNowItem");
                }

                localStorage.setItem("lastOrderNumber", data.order.orderNumber);
                router.push(`/order-confirmation/${data.order.orderNumber}`);
            } else {
                toast.error(data.message || "Failed to place order");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (checkoutItems.length === 0) {
        return null;
    }
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            <div className="lg:col-span-2 space-y-6">

                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="text-orange-500" size={24} />
                                        <h2 className="text-xl font-semibold">Customer Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="input"
                                                style={{ width: '100%' }}
                                                placeholder="John"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="input"
                                                style={{ width: '100%' }}
                                                placeholder="Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="input"
                                                style={{ width: '100%' }}
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="input"
                                                style={{ width: '100%' }}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Truck className="text-orange-500" size={24} />
                                        <h2 className="text-xl font-semibold">Shipping Address</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Street Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                className="input"
                                                style={{ width: '100%' }}
                                                placeholder="123 Main St"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    City <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    required
                                                    className="input"
                                                    style={{ width: '100%' }}
                                                    placeholder="New York"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    State <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    required
                                                    className="input"
                                                    style={{ width: '100%' }}
                                                    placeholder="NY"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    ZIP Code <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={formData.zipCode}
                                                    onChange={handleChange}
                                                    required
                                                    className="input"
                                                    style={{ width: '100%' }}
                                                    placeholder="10001"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Country <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                    required
                                                    className="input"
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-semibold">Billing Address</h2>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="sameAsShipping"
                                                checked={formData.sameAsShipping}
                                                onChange={handleChange}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm">Same as shipping</span>
                                        </label>
                                    </div>

                                    {!formData.sameAsShipping && (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                name="address"
                                                value={billingAddress.address}
                                                onChange={handleBillingChange}
                                                required
                                                className="input"
                                                style={{ width: '100%' }}
                                                placeholder="Billing Address"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={billingAddress.city}
                                                    onChange={handleBillingChange}
                                                    required
                                                    className="input"
                                                    style={{ width: '100%' }}
                                                    placeholder="City"
                                                />
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={billingAddress.state}
                                                    onChange={handleBillingChange}
                                                    required
                                                    className="input"
                                                    style={{ width: '100%' }}
                                                    placeholder="State"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={billingAddress.zipCode}
                                                    onChange={handleBillingChange}
                                                    required
                                                    className="input"
                                                    style={{ width: '100%' }}
                                                    placeholder="ZIP Code"
                                                />
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={billingAddress.country}
                                                    onChange={handleBillingChange}
                                                    required
                                                    className="input"
                                                    style={{ width: '100%' }}
                                                    placeholder="Country"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>


                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CreditCard className="text-orange-500" size={24} />
                                        <h2 className="text-xl font-semibold">Payment Method</h2>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-orange-500 transition">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="card"
                                                checked={formData.paymentMethod === "card"}
                                                onChange={handleChange}
                                                className="w-4 h-4"
                                            />
                                            <CreditCard size={20} />
                                            <span className="font-medium">Credit/Debit Card</span>
                                        </label>

                                        <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-orange-500 transition">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="paypal"
                                                checked={formData.paymentMethod === "paypal"}
                                                onChange={handleChange}
                                                className="w-4 h-4"
                                            />
                                            <span className="font-medium">PayPal</span>
                                        </label>

                                        <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-orange-500 transition">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === "cod"}
                                                onChange={handleChange}
                                                className="w-4 h-4"
                                            />
                                            <span className="font-medium">Cash on Delivery</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4">Order Notes (Optional)</h2>
                                    <textarea
                                        name="orderNotes"
                                        value={formData.orderNotes}
                                        onChange={handleChange}
                                        rows={4}
                                        className="input w-full resize-none"
                                        placeholder="Any special instructions for your order..."
                                    />
                                </div>
                            </div>


                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShoppingBag className="text-orange-500" size={24} />
                                        <h2 className="text-xl font-semibold">Order Summary</h2>
                                    </div>


                                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                       {checkoutItems.map((item, index) => (
                                           <div key={item._id || `${item.product._id}-${index}`} className="flex gap-3">
                                                <Image
                                                    src={item.product.mainImage}
                                                    alt={item.product.name}
                                                    width={60}
                                                    height={60}
                                                    className="rounded object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.product.name}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-semibold">
                                                        ${(item.salePrice * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">${cart.totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-medium">
                                                {calculateShipping() === 0 ? "FREE" : `$${calculateShipping()}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tax (10%)</span>
                                            <span className="font-medium">${calculateTax()}</span>
                                        </div>
                                    </div>

                                    <div className="border-t mt-4 pt-4">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-2xl font-bold text-orange-500">
                                                ${calculateTotal()}
                                            </span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? "Processing..." : "Place Order"}
                                        </button>

                                        <p className="text-xs text-gray-500 text-center mt-4">
                                            By placing this order, you agree to our Terms & Conditions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}