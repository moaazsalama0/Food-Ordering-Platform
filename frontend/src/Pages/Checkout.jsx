import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { endpoints } from '../api/api';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // ---- SAFE VALUES ----
  const cartItems = location.state?.cartItems || [];

  // ---- FORM STATE ----
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // ---- TOTALS STATE ----
  const [totals, setTotals] = useState({
    subtotal: Number(location.state?.subtotal) || 0,
    discount: Number(location.state?.discount) || 0,
    deliveryFee: Number(location.state?.deliveryFee) || 0,
    tax: Number(location.state?.tax) || 0,
    total: Number(location.state?.total) || 0
  });

  // ---- PRICES ----
  // Force delivery to be free per request
  const deliveryFee = 0;

  const finalTotal = (() => {
    // Prefer server-calculated values, but recompute total if needed
    const subtotal = Number(totals.subtotal) || 0;
    const discount = Number(totals.discount) || 0;
    const tax = Number(totals.tax) || 0;
    return Math.round((subtotal - discount + tax + deliveryFee) * 100) / 100;
  })();

  // If totals weren't provided via navigation state, call backend to compute them
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        if (!Array.isArray(cartItems) || cartItems.length === 0) return;

        // If subtotal already present, skip calling backend
        if (location.state && location.state.subtotal) return;

        const payload = {
          items: cartItems.map(i => ({ id: i.id, price: i.price, quantity: i.quantity })),
          couponCode: location.state?.couponCode || undefined
        };

        const res = await api.post(endpoints.CALCULATE_TOTALS, payload);
        const response = res.data;

        if (response && response.success && response.data) {
          // Force deliveryFee to 0 (free delivery)
          const d = response.data;
          const updated = {
            subtotal: d.subtotal || 0,
            discount: d.discount || 0,
            deliveryFee: 0,
            tax: d.tax || 0,
            total: Math.round(((d.subtotal || 0) - (d.discount || 0) + (d.tax || 0) + 0) * 100) / 100
          };
          setTotals(updated);
        }
      } catch (err) {
        console.error('Failed to fetch totals in Checkout:', err);
      }
    };

    fetchTotals();
  }, [cartItems, location.state]);

  const handlePlaceOrder = () => {
    if (!address || !paymentMethod) {
      alert("Please fill in all fields.");
      return;
    }

    alert("Order placed successfully!");
    navigate("/");
  };

  return (
    <div className="p-6 mt-20 max-w-lg mx-auto">

      <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>

      {/* CART SUMMARY */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Order Summary</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t mt-3 pt-3">
          <div className="flex justify-between mb-1">
            <span>Subtotal:</span>
            <span>${Number(totals.subtotal || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-1">
            <span>Delivery Fee:</span>
            <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ADDRESS */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Delivery Details</h2>
        <input
          type="text"
          placeholder="Enter your address"
          className="w-full p-3 border rounded-lg"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* PAYMENT */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Payment Method</h2>

        <select
          className="w-full p-3 border rounded-lg"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">Select Payment Method</option>
          <option value="cash">Cash on Delivery</option>
          <option value="visa">Visa / Mastercard</option>
        </select>
      </div>

      {/* CONFIRM BUTTON */}
      <button
        className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold text-lg active:scale-95 transition"
        onClick={handlePlaceOrder}
      >
        Place Order
      </button>
    </div>
  );
}