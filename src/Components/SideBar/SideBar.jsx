import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ShoppingBagIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

export default function SideBar() {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const closeSidebar = () => {
    setOpen(false);
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="w-10 h-10 flex items-center justify-center bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 relative z-10"
        aria-label="Toggle menu"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Backdrop Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-[9998]"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-amber-600">Menu</h2>
          <button
            onClick={closeSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600"
            aria-label="Close menu"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-4 flex-grow overflow-y-auto">
          <NavLink
            to="/profile"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-amber-100 text-amber-700 font-semibold shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <UserIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-base">Profile</span>
          </NavLink>

          <NavLink
            to="/orders"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-amber-100 text-amber-700 font-semibold shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <ShoppingBagIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-base">Orders</span>
          </NavLink>

          <NavLink
            to="/checkout"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-amber-100 text-amber-700 font-semibold shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <CreditCardIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-base">Checkout</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <p className="text-xs text-gray-500 text-center">
            © 2024 FoodHub
          </p>
        </div>
      </div>
    </>
  );
}