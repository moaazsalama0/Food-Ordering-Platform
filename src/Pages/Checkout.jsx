import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.css';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { cartItems = [], total = 0, subtotal = 0, discount = 0, deliveryFee = 0, tax = 0 } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.fullName.length < 3) {
      errors.fullName = 'Name must be at least 3 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (formData.phone.length < 10) {
      errors.phone = 'Phone must be at least 10 digits';
    }
    
    if (formData.address.length < 10) {
      errors.address = 'Address is required';
    }
    
    if (formData.city.length < 2) {
      errors.city = 'City is required';
    }
    
    if (formData.zipCode.length < 5) {
      errors.zipCode = 'ZIP code is required';
    }

    if (paymentMethod === 'card') {
      if (formData.cardNumber.length < 16) {
        errors.cardNumber = 'Invalid card number';
      }
      if (formData.expiryDate.length < 5) {
        errors.expiryDate = 'Invalid expiry date';
      }
      if (formData.cvv.length < 3) {
        errors.cvv = 'Invalid CVV';
      }
      if (formData.cardholderName.length < 3) {
        errors.cardholderName = 'Cardholder name is required';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const orderData = {
        ...formData,
        paymentMethod,
        items: cartItems,
        total,
        orderDate: new Date().toISOString()
      };
      
      console.log('Order placed:', orderData);
      setLoading(false);
      setOrderPlaced(true);
      
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    }, 2000);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious items to get started!</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="success-state">
          <div className="success-animation">
            <div className="checkmark-circle">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle-path" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We'll start preparing it right away.</p>
          <div className="success-details">
            <div className="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Order Confirmed</span>
            </div>
            <div className="detail-item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Estimated delivery: 30-45 min</span>
            </div>
          </div>
          <p className="redirect-text">Redirecting to orders page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order in a few simple steps</p>
        </div>

        <div className="checkout-grid">
          <div className="checkout-main">
            <form onSubmit={handleSubmit}>
              {/* Delivery Section */}
              <div className="checkout-section">
                <div className="section-title">
                  <div className="step-number">1</div>
                  <div>
                    <h2>Delivery Information</h2>
                    <p>Where should we deliver your order?</p>
                  </div>
                </div>
                <div className="section-content">
                  <div className="input-grid">
                    <div className="input-group">
                      <label>Full Name *</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" className={formErrors.fullName ? 'error' : ''} />
                      {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
                    </div>
                    <div className="input-group">
                      <label>Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className={formErrors.email ? 'error' : ''} />
                      {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                    </div>
                  </div>
                  <div className="input-grid">
                    <div className="input-group">
                      <label>Phone Number *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className={formErrors.phone ? 'error' : ''} />
                      {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                    </div>
                    <div className="input-group">
                      <label>City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="New York" className={formErrors.city ? 'error' : ''} />
                      {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Delivery Address *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St, Apt 4B" className={formErrors.address ? 'error' : ''} />
                    {formErrors.address && <span className="error-text">{formErrors.address}</span>}
                  </div>
                  <div className="input-grid">
                    <div className="input-group">
                      <label>ZIP Code *</label>
                      <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="10001" className={formErrors.zipCode ? 'error' : ''} />
                      {formErrors.zipCode && <span className="error-text">{formErrors.zipCode}</span>}
                    </div>
                    <div className="input-group">
                      <label>Order Notes (Optional)</label>
                      <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Ring the doorbell" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="checkout-section">
                <div className="section-title">
                  <div className="step-number">2</div>
                  <div>
                    <h2>Payment Method</h2>
                    <p>Choose how you'd like to pay</p>
                  </div>
                </div>
                <div className="section-content">
                  <div className="payment-methods">
                    <div className={`payment-card ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                      <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      <div className="payment-icon">💳</div>
                      <div className="payment-details">
                        <strong>Credit / Debit Card</strong>
                        <p>Pay securely with your card</p>
                      </div>
                    </div>
                    <div className={`payment-card ${paymentMethod === 'cash' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cash')}>
                      <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                      <div className="payment-icon">💵</div>
                      <div className="payment-details">
                        <strong>Cash on Delivery</strong>
                        <p>Pay when you receive</p>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="card-fields">
                      <div className="input-group">
                        <label>Card Number *</label>
                        <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" maxLength="16" className={formErrors.cardNumber ? 'error' : ''} />
                        {formErrors.cardNumber && <span className="error-text">{formErrors.cardNumber}</span>}
                      </div>
                      <div className="input-grid">
                        <div className="input-group">
                          <label>Expiry Date *</label>
                          <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/YY" maxLength="5" className={formErrors.expiryDate ? 'error' : ''} />
                          {formErrors.expiryDate && <span className="error-text">{formErrors.expiryDate}</span>}
                        </div>
                        <div className="input-group">
                          <label>CVV *</label>
                          <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" maxLength="3" className={formErrors.cvv ? 'error' : ''} />
                          {formErrors.cvv && <span className="error-text">{formErrors.cvv}</span>}
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Cardholder Name *</label>
                        <input type="text" name="cardholderName" value={formData.cardholderName} onChange={handleInputChange} placeholder="JOHN DOE" className={formErrors.cardholderName ? 'error' : ''} />
                        {formErrors.cardholderName && <span className="error-text">{formErrors.cardholderName}</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order • ${total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <strong>{item.name}</strong>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="total-row discount">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="total-row">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="total-row final">
                  <strong>Total</strong>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}