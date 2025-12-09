import React, { useState, useEffect } from 'react';
import './Profile.css';
import api, { endpoints } from '../api/api';
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  // Load signed-in user from localStorage first, then try /api/auth/me
  useEffect(() => {
    const loadFromLocal = () => {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          setFormData(prev => ({
            ...prev,
            name: u.name || prev.name,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
            address: u.address || prev.address,
            city: u.city || prev.city,
            zipCode: u.zip_code || prev.zipCode || u.zipCode
          }));
          if (u.profile_image) setProfileImage(u.profile_image);
        }
      } catch (err) {
        console.error('Failed to parse stored user:', err);
      }
    };

    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await api.get(endpoints.ME);
        const response = res.data;
        if (response && response.success && response.data) {
          const u = response.data;
          setFormData(prev => ({
            ...prev,
            name: u.name || prev.name,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
            address: u.address || prev.address,
            city: u.city || prev.city,
            zipCode: u.zip_code || prev.zipCode || u.zipCode
          }));
          if (u.profile_image) setProfileImage(u.profile_image);
        }
      } catch (err) {
        console.debug('Could not fetch /auth/me, falling back to local user');
      }
    };

    loadFromLocal();
    fetchMe();
  }, []);

  const [formErrors, setFormErrors] = useState({});

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false
  });

  const [addresses] = useState([
    { id: 1, label: 'Home', address: '123 Main St, Apt 4B, janakles, EG 10001', isDefault: true },
    { id: 2, label: 'Work', address: '456 Office Plaza, Suite 200, New York, NY 10002', isDefault: false }
  ]);

  const [paymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '06/26', isDefault: false }
  ]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

    if (formData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (formData.phone.length < 10) {
      errors.phone = 'Phone must be at least 10 digits';
    }

    if (formData.address.length < 5) {
      errors.address = 'Address is required';
    }

    if (formData.city.length < 2) {
      errors.city = 'City is required';
    }

    if (formData.zipCode.length < 5) {
      errors.zipCode = 'ZIP code is required';
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
      console.log('Profile updated:', formData);
      setLoading(false);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Header */}
        <div className="profile-hero">
          <div className="hero-content">
            <h1>My Profile</h1>
            <p>Manage your account settings and preferences</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="profile-main-card">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              )}

              <label className="avatar-upload">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>

            <div className="profile-details">
              <h2>{formData.name}</h2>
              <p>{formData.email}</p>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="btn-edit">
                  Edit Profile
                </button>
              ) : (
                <div className="btn-group">
                  <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
                  <button onClick={handleSubmit} disabled={loading} className="btn-save">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-nav">

            <button className={`tab-item ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
              Personal Info
            </button>

            <button className={`tab-item ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
              Addresses
            </button>

            <button className={`tab-item ${activeTab === 'payment' ? 'active' : ''}`} onClick={() => setActiveTab('payment')}>
              Payment
            </button>

            <button className={`tab-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
              Notifications
            </button>

            <button className={`tab-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
              Security
            </button>
          </div>

          <div className="tab-panel">

            {/* PERSONAL INFO */}
            {activeTab === 'personal' && (
              <div className="content-card">
                <form onSubmit={handleSubmit}>
                  <div className="form-grid-2">
                    <div className="input-group">
                      <label>Full Name</label>
                      <input type="text" name="name" disabled={!isEditing} value={formData.name} onChange={handleInputChange} className={formErrors.name ? 'error' : ''} />
                      {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                    </div>

                    <div className="input-group">
                      <label>Email Address</label>
                      <input type="email" name="email" disabled={!isEditing} value={formData.email} onChange={handleInputChange} className={formErrors.email ? 'error' : ''} />
                      {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="input-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phone" disabled={!isEditing} value={formData.phone} onChange={handleInputChange} className={formErrors.phone ? 'error' : ''} />
                      {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                    </div>

                    <div className="input-group">
                      <label>City</label>
                      <input type="text" name="city" disabled={!isEditing} value={formData.city} onChange={handleInputChange} className={formErrors.city ? 'error' : ''} />
                      {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Street Address</label>
                    <input type="text" name="address" disabled={!isEditing} value={formData.address} onChange={handleInputChange} className={formErrors.address ? 'error' : ''} />
                    {formErrors.address && <span className="error-text">{formErrors.address}</span>}
                  </div>

                  <div className="input-group">
                    <label>ZIP Code</label>
                    <input type="text" name="zipCode" disabled={!isEditing} value={formData.zipCode} onChange={handleInputChange} className={formErrors.zipCode ? 'error' : ''} />
                    {formErrors.zipCode && <span className="error-text">{formErrors.zipCode}</span>}
                  </div>
                </form>
              </div>
            )}

            {/* ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="content-card">
                <div className="section-header">
                  <h3>Saved Addresses</h3>
                  <button className="btn-add">+ Add New Address</button>
                </div>

                <div className="address-grid">
                  {addresses.map(addr => (
                    <div key={addr.id} className="address-item">
                      <div className="address-top">
                        <div className="address-info">
                          <strong>{addr.label}</strong>
                          {addr.isDefault && <span className="badge-default">Default</span>}
                        </div>

                        <div className="item-actions">
                          <button className="btn-icon">Edit</button>
                          <button className="btn-icon danger">Delete</button>
                        </div>
                      </div>

                      <p className="address-text">{addr.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAYMENT */}
            {activeTab === 'payment' && (
              <div className="content-card">
                <div className="section-header">
                  <h3>Payment Methods</h3>
                  <button className="btn-add">+ Add New Card</button>
                </div>

                <div className="payment-grid">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="payment-item">
                      <div className="payment-details">
                        <strong>{method.type} •••• {method.last4}</strong>
                        {method.isDefault && <span className="badge-default">Default</span>}
                        <p>Expires {method.expiry}</p>
                      </div>

                      <div className="item-actions">
                        <button className="btn-icon">Edit</button>
                        <button className="btn-icon danger">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="content-card">
                <h3>Notification Preferences</h3>

                <div className="notification-list">
                  <div className="notification-item">
                    <div>
                      <strong>Order Updates</strong>
                      <p>Get notified about your order status</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifications.orderUpdates} onChange={e => setNotifications({ ...notifications, orderUpdates: e.target.checked })} />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div>
                      <strong>Promotions & Offers</strong>
                      <p>Receive exclusive deals and discounts</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifications.promotions} onChange={e => setNotifications({ ...notifications, promotions: e.target.checked })} />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div>
                      <strong>Newsletter</strong>
                      <p>Weekly food tips and recipes</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifications.newsletter} onChange={e => setNotifications({ ...notifications, newsletter: e.target.checked })} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY */}
            {activeTab === 'security' && (
              <div className="content-card">
                <h3>Change Password</h3>

                <div className="security-form">
                  <div className="input-group">
                    <label>Current Password</label>
                    <input type="password" placeholder="Enter current password" />
                  </div>

                  <div className="input-group">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password" />
                  </div>

                  <div className="input-group">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" />
                  </div>

                  <button className="btn-primary">Update Password</button>
                </div>

                <div className="danger-section">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all associated data</p>
                  <button className="btn-danger">Delete Account</button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
