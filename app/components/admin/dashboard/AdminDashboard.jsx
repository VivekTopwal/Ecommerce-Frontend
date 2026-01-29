"use client";

import React from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  ChartBar,
  Settings,
  Flower,
  Users,
  Compass,
  User,
  Layers,
  ShoppingCart,
  CreditCard,
  Calendar,
  RefreshCcw,
  Truck,
  Check,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import LogoutComponent from "@/app/components/logout/LogoutComponent";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white text-black flex flex-col p-6">
        <div className="flex items-center mb-10">
          <Flower className="text-orange-500" />
          <h2 className="text-xl font-bold text-orange-500 font-serif ml-[10px]">
            Mindful Living
          </h2>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link
                href="#"
                className="flex items-center px-3 py-2 rounded-md bg-gray-100 font-bold text-gray-600"
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition font-bold text-gray-600"
              >
                <ChartBar className="h-5 w-5 mr-3" />
                Catalog <ChevronRight className="h-5 w-5" />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition font-bold text-gray-600"
              >
                <Users className="h-5 w-5 mr-3" />
                Customers
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition font-bold text-gray-600"
              >
                <Compass className="h-5 w-5 mr-3" />
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition font-bold text-gray-600"
              >
                <User className="h-5 w-5 mr-3" />
                Our Staff
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition font-bold text-gray-600"
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition font-bold text-gray-600"
              >
                <Settings className="h-5 w-5 mr-3" />
                International
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition font-bold text-gray-600"
              >
                <Settings className="h-5 w-5 mr-3" />
                Online Store
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition font-bold text-gray-600"
              >
                <Settings className="h-5 w-5 mr-3" />
                Pages
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
          <Image
            src="/images/store-logo.png"
            alt="Company Logo"
            width={120}
            height={50}
            priority
          />
          <LogoutComponent />
        </header>

        <main className="flex-1 relative bg-gray-200">
          <div>
            <h2 className="pl-5 pt-5 pb-5 font-bold font-sans text-[25px]">
              Dashboard Overview
            </h2>
          </div>

          <div className="mr-[20px] ml-[20px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-teal-600 text-white rounded-lg p-6 min-h-[170px]">
                <Layers className="w-7 h-7 mb-3" />
                <p className="text-sm opacity-90">Today Orders</p>
                <h3 className="text-2xl font-bold mt-1">$110.00</h3>

                <div className="mt-4 flex justify-between text-xs opacity-90">
                  <span>
                    Cash: <span className="font-semibold">$110.00</span>
                  </span>
                  <span>
                    Card: <span className="font-semibold">$0.00</span>
                  </span>
                  <span>
                    Credit: <span className="font-semibold">$0.00</span>
                  </span>
                </div>
              </div>

              <div className="bg-orange-400 text-white rounded-lg p-6 min-h-[170px]">
                <Layers className="w-7 h-7 mb-3" />
                <p className="text-sm opacity-90">Yesterday Orders</p>
                <h3 className="text-2xl font-bold mt-1">$4799.01</h3>

                <div className="mt-4 flex justify-between text-xs opacity-90">
                  <span>
                    Cash: <span className="font-semibold">$4799.01</span>
                  </span>
                  <span>
                    Card: <span className="font-semibold">$0.00</span>
                  </span>
                  <span>
                    Credit: <span className="font-semibold">$0.00</span>
                  </span>
                </div>
              </div>

              <div className="bg-blue-500 text-white rounded-lg p-6 min-h-[170px]">
                <ShoppingCart className="w-7 h-7 mb-3" />
                <p className="text-sm opacity-90">This Month</p>
                <h3 className="text-2xl font-bold mt-1">$9620.43</h3>
              </div>

              <div className="bg-cyan-600 text-white rounded-lg p-6 min-h-[170px]">
                <Calendar className="w-7 h-7 mb-3" />
                <p className="text-sm opacity-90">Last Month</p>
                <h3 className="text-2xl font-bold mt-1">$4536.69</h3>
              </div>

              <div className="bg-green-600 text-white rounded-lg p-6 min-h-[170px]">
                <CreditCard className="w-7 h-7 mb-3" />
                <p className="text-sm opacity-90">All-Time Sales</p>
                <h3 className="text-2xl font-bold mt-1">$1156218.66</h3>
              </div>
            </div>
          </div>

<div className="mt-[40px] mr-[20px] ml-[20px] ">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <ShoppingCart className="text-orange-500" size={22} />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Order</p>
          <p className="text-2xl font-semibold text-gray-600">1291</p>
        </div>
      </div>

  
      <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <RefreshCcw className="text-blue-500" size={22} />
        </div>
        <div>
          <p className="text-gray-500 text-sm">
            Orders Pending <span className="text-red-500 font-semibold">(42352.59)</span>
          </p>
          <p className="text-2xl font-semibold text-gray-600">84</p>
        </div>
      </div>

  
      <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <Truck className="text-emerald-500" size={22} />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Orders Processing</p>
          <p className="text-2xl font-semibold text-gray-600">23</p>
        </div>
      </div>

    
      <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Check className="text-green-500" size={22} />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Orders Delivered</p>
          <p className="text-2xl font-semibold text-gray-600">95</p>
        </div>
      </div>

    </div>
</div>



        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
