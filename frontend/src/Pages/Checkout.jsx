import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // ---- SAFE VALUES ----
  const cartItems = location.state?.cartItems || [];
  const totalPrice = Number(location.state?.totalPrice) || 0;

  // ---- FORM STATE ----
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // ---- PRICES ----
  const deliveryFee = totalPrice >= 200 ? 0 : 20;
  const finalTotal = totalPrice + deliveryFee;

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
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-1">
            <span>Delivery Fee:</span>
            <span>${deliveryFee.toFixed(2)}</span>
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