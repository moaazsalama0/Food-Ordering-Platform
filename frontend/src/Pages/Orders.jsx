import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Chip, Input } from '@heroui/react';
import { FaSearch, FaClock, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    setTimeout(() => {
      setOrders([
        {
          _id: '1',
          orderId: 'ORD-2025-001',
          items: [
            { name: 'Margherita Pizza', quantity: 2, price: 12.99 },
            { name: 'Caesar Salad', quantity: 1, price: 8.99 }
          ],
          totalAmount: 34.97,
          status: 'delivered',
          createdAt: '2025-11-24T10:30:00',
          address: '123 Main St, New York, NY 10001',
          paymentMethod: 'Credit Card'
        },
        {
          _id: '2',
          orderId: 'ORD-2025-002',
          items: [
            { name: 'Chicken Burger', quantity: 1, price: 11.99 },
            { name: 'French Fries', quantity: 2, price: 4.99 }
          ],
          totalAmount: 21.97,
          status: 'processing',
          createdAt: '2025-11-25T14:20:00',
          address: '123 Main St, New York, NY 10001',
          paymentMethod: 'Cash on Delivery'
        },
        {
          _id: '3',
          orderId: 'ORD-2025-003',
          items: [
            { name: 'Pasta Carbonara', quantity: 1, price: 14.99 }
          ],
          totalAmount: 14.99,
          status: 'on-the-way',
          createdAt: '2025-11-26T12:00:00',
          address: '123 Main St, New York, NY 10001',
          paymentMethod: 'Credit Card'
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'processing':
        return <FaClock className="status-icon processing" />;
      case 'on-the-way':
        return <FaTruck className="status-icon ontheway" />;
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon default" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'success';
      case 'processing': return 'warning';
      case 'on-the-way': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="orders-page">
      <div className="orders-container">

        <div className="orders-header">
          <h1 className="header-title">My Orders</h1>
          <p className="header-subtitle">Track and manage your food orders</p>
        </div>

        <div className="orders-filters">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<FaSearch className="search-icon" />}
            variant="bordered"
            className="search-input"
          />

          <div className="filter-buttons">
            <Button className={filterStatus === 'all' ? 'filter-active' : 'filter-btn'} onClick={() => setFilterStatus('all')}>All</Button>
            <Button className={filterStatus === 'processing' ? 'filter-active' : 'filter-btn'} onClick={() => setFilterStatus('processing')}>Processing</Button>
            <Button className={filterStatus === 'on-the-way' ? 'filter-active' : 'filter-btn'} onClick={() => setFilterStatus('on-the-way')}>On the way</Button>
            <Button className={filterStatus === 'delivered' ? 'filter-active' : 'filter-btn'} onClick={() => setFilterStatus('delivered')}>Delivered</Button>
          </div>
        </div>

        <div className="orders-list">
          {loading ? (
            <div className="loading-state">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <h3>No orders found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order._id} className="order-card">
                <CardHeader className="order-card-header">
                  <div className="order-info">
                    <h3>{order.orderId}</h3>
                    <p>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <Chip startContent={getStatusIcon(order.status)} color={getStatusColor(order.status)} variant="flat">
                    {order.status.replace('-', ' ')}
                  </Chip>
                </CardHeader>

                <CardBody className="order-card-body">
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-details">
                          <span>{item.name}</span>
                          <span>×{item.quantity}</span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-delivery-info">
                    <div className="info-item">
                      <span>Delivery Address:</span>
                      <span>{order.address}</span>
                    </div>
                    <div className="info-item">
                      <span>Payment Method:</span>
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="order-actions">
                    <Button className="track-btn">Track Order</Button>
                    {order.status === 'delivered' && (
                      <Button className="reorder-btn">Reorder</Button>
                    )}
                    <Button className="details-btn">View Details</Button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
