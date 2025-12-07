import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Input } from '@heroui/react';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0
  });

  // Load cart from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");

    const formatted = saved.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || item.qty || 1,
      image: item.image || item.img,
      category: item.category || "Food"
    }));

    setCartItems(formatted);
  }, []);

  const syncToLocalStorage = (items) => {
    const formatted = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: item.category,
    }));
    localStorage.setItem("cart", JSON.stringify(formatted));
  };

  // -------------------------------
  // 🔹 API: Update Cart Totals
  // -------------------------------
  const updateTotalsFromApi = async (items, coupon = null) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/cart/calculate-totals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({ itemId: i.id, quantity: i.quantity })),
          couponCode: coupon || undefined
        })
      });

      const data = await res.json();

      setTotals({
        subtotal: data.subtotal,
        discount: data.discount,
        deliveryFee: data.deliveryFee,
        tax: data.tax,
        total: data.total
      });

    } catch (err) {
      console.error("Failed to calculate totals:", err);
    }
  };

  // Call totals calculator whenever cart changes
  useEffect(() => {
    updateTotalsFromApi(cartItems, appliedCoupon?.code || null);
  }, [cartItems, appliedCoupon]);

  // -------------------------------
  // 🔹 API: Add / Update cart item
  // -------------------------------
  const sendUpdateToBackend = async (itemId, quantity) => {
    try {
      await fetch("http://127.0.0.1:8000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity })
      });
    } catch (err) {
      console.error("Cart update failed:", err);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updated);
    syncToLocalStorage(updated);
    sendUpdateToBackend(id, newQuantity);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    syncToLocalStorage(updated);
    sendUpdateToBackend(id, 0); // remove from backend
  };

  // -------------------------------
  // 🔹 Coupon Handling
  // -------------------------------
  const applyCoupon = () => {
    if (couponCode === 'FOOD10') {
      setAppliedCoupon({ code: 'FOOD10', discount: 10 });
    } else if (couponCode === 'SAVE20') {
      setAppliedCoupon({ code: 'SAVE20', discount: 20 });
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    navigate('/checkout', {
      state: {
        cartItems,
        ...totals
      }
    });
  };

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* Header */}
        <div className="cart-header">
          <h1 className="text-4xl font-bold text-amber-600">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="empty-cart">
            <CardBody>
              <FaShoppingCart className="empty-cart-icon" />
              <h3 className="text-2xl font-bold text-gray-700">Your cart is empty</h3>
              <Button className="bg-amber-600 text-white" onClick={() => navigate('/menu')}>
                Browse Menu
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="cart-content">

            {/* Cart Items */}
            <div className="cart-items-section">
              {cartItems.map((item) => (
                <Card key={item.id} className="cart-item-card">
                  <CardBody>
                    <div className="cart-item">
                      <img src={item.image} alt={item.name} className="item-image" />

                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-category">{item.category}</p>
                        <p className="item-price">${item.price.toFixed(2)}</p>
                      </div>

                      <div className="item-actions">
                        <div className="quantity-controls">
                          <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <FaMinus />
                          </Button>
                          <span className="quantity-display">{item.quantity}</span>
                          <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <FaPlus />
                          </Button>
                        </div>

                        <div className="item-total">
                          <span>Total:</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>

                        <Button className="remove-btn" onClick={() => removeItem(item.id)}>
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary-section">
              <Card className="order-summary-card">
                <CardBody>
                  <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

                  {/* Coupon */}
                  <div className="coupon-section">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      startContent={<FaTag />}
                      disabled={appliedCoupon !== null}
                    />
                    {appliedCoupon ? (
                      <Button className="bg-red-600 text-white" onClick={removeCoupon}>
                        Remove
                      </Button>
                    ) : (
                      <Button className="bg-amber-600 text-white" onClick={applyCoupon}>
                        Apply
                      </Button>
                    )}
                  </div>

                  {/* Prices */}
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Subtotal:</span>
                      <span>${totals.subtotal.toFixed(2)}</span>
                    </div>

                    {totals.discount > 0 && (
                      <div className="price-row discount">
                        <span>Discount:</span>
                        <span>-${totals.discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="price-row">
                      <span>Delivery Fee:</span>
                      <span>{totals.deliveryFee === 0 ? "FREE" : `$${totals.deliveryFee.toFixed(2)}`}</span>
                    </div>

                    <div className="price-row">
                      <span>Tax (8%):</span>
                      <span>${totals.tax.toFixed(2)}</span>
                    </div>

                    <div className="price-row total">
                      <span>Total:</span>
                      <span className="text-amber-600 font-bold text-2xl">
                        ${totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button className="bg-amber-600 text-white" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>

                  <Button variant="bordered" onClick={() => navigate('/menu')}>
                    Continue Shopping
                  </Button>

                </CardBody>
              </Card>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}