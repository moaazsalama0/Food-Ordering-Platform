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

  // --- FIX 1: Load cart from LocalStorage ---
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");

    // Convert your menu item structure → cart page structure
    const formatted = saved.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.qty,        // menu uses qty, your cart uses quantity
      image: item.img,           // your mock items use image, menu uses img
      category: item.category || "Food"
    }));

    setCartItems(formatted);
  }, []);

  // --- FIX 2: Save updated cart back to localStorage ---
  const syncToLocalStorage = (items) => {
    const formatted = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.quantity, // back to menu format
      img: item.image,
      category: item.category
    }));
    localStorage.setItem("cart", JSON.stringify(formatted));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updated);
    syncToLocalStorage(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    syncToLocalStorage(updated);
  };

  const applyCoupon = () => {
    if (couponCode === 'FOOD10') {
      setAppliedCoupon({ code: 'FOOD10', discount: 10 });
      alert('Coupon applied! 10% discount');
    } else if (couponCode === 'SAVE20') {
      setAppliedCoupon({ code: 'SAVE20', discount: 20 });
      alert('Coupon applied! 20% discount');
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const deliveryFee = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + deliveryFee + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    navigate('/checkout', { 
      state: { cartItems, total, subtotal, discount, deliveryFee, tax }
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
              <p className="text-gray-500 mb-4">Add some delicious food to get started!</p>
              <Button 
                className="bg-amber-600 text-white hover:bg-amber-700"
                onClick={() => navigate('/menu')}
              >
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
                          <Button
                            size="sm"
                            isIconOnly
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <FaMinus />
                          </Button>
                          <span className="quantity-display">{item.quantity}</span>
                          <Button
                            size="sm"
                            isIconOnly
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                        
                        <div className="item-total">
                          <span className="total-label">Total:</span>
                          <span className="total-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>

                        <Button
                          size="sm"
                          isIconOnly
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
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
                    <div className="coupon-input-wrapper">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        variant="bordered"
                        startContent={<FaTag className="text-amber-600" />}
                        disabled={appliedCoupon !== null}
                      />
                      {appliedCoupon ? (
                        <Button
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={removeCoupon}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          className="bg-amber-600 text-white hover:bg-amber-700"
                          onClick={applyCoupon}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="price-row discount">
                        <span>Discount:</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="price-row">
                      <span>Delivery Fee:</span>
                      <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
                    </div>

                    <div className="price-row">
                      <span>Tax (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>

                    <div className="price-row total">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-2xl text-amber-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="checkout-btn bg-amber-600 text-white hover:bg-amber-700"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="bordered"
                    className="continue-shopping-btn"
                    onClick={() => navigate('/menu')}
                  >
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
