import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
} from "@heroui/react";
import {
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
} from "react-icons/fa";
import "./Orders.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login to view orders");
        return;
      }

      // Use the correct endpoint from backend: /api/orders/my-orders
      const res = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Orders response:', data);

      // Backend returns { success: true, count: X, data: [...] }
      if (data.success) {
        setOrders(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FaCheckCircle className="status-icon delivered" />;
      case "ready":
      case "pending":
        return <FaClock className="status-icon processing" />;
      case "on the way":
        return <FaTruck className="status-icon ontheway" />;
      case "cancelled":
        return <FaTimesCircle className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon default" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "ready":
        return "warning";
      case "on the way":
        return "primary";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toString().includes(searchTerm);

    const matchesFilter = filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="text-xl mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="text-center py-20">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1 className="header-title">My Orders</h1>
          <p className="header-subtitle">Track and manage your food orders</p>
        </div>

        {/* SEARCH + FILTER */}
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
            <Button
              className={filterStatus === "all" ? "filter-active" : "filter-btn"}
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>

            <Button
              className={filterStatus === "pending" ? "filter-active" : "filter-btn"}
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </Button>

            <Button
              className={filterStatus === "ready" ? "filter-active" : "filter-btn"}
              onClick={() => setFilterStatus("ready")}
            >
              Ready
            </Button>

            <Button
              className={filterStatus === "on the way" ? "filter-active" : "filter-btn"}
              onClick={() => setFilterStatus("on the way")}
            >
              On the way
            </Button>

            <Button
              className={filterStatus === "delivered" ? "filter-active" : "filter-btn"}
              onClick={() => setFilterStatus("delivered")}
            >
              Delivered
            </Button>
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-state">
              <h3>No orders found</h3>
              <p>
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't placed any orders yet"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              // Calculate totals
              const subtotal = parseFloat(order.total_amount || 0);
              const deliveryFee = subtotal >= 200 ? 0 : 20;
              const total = subtotal + deliveryFee;

              return (
                <Card key={order.id} className="order-card">
                  <CardHeader className="order-card-header">
                    <div className="order-info">
                      <h3>Order #{order.order_number || order.id}</h3>
                      <p>
                        {new Date(order.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <Chip
                      startContent={getStatusIcon(order.status)}
                      color={getStatusColor(order.status)}
                      variant="flat"
                    >
                      {order.status?.replace("-", " ") || "pending"}
                    </Chip>
                  </CardHeader>

                  <CardBody className="order-card-body">
                    {/* ITEMS */}
                    <div className="order-items">
                      {order.items?.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="item-details">
                            <span>{item.name}</span>
                            <span>×{item.quantity}</span>
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* DELIVERY INFO */}
                    <div className="order-delivery-info">
                      <div className="info-item">
                        <span>Address:</span>
                        <span>
                          {order.delivery_address}, {order.delivery_city}{" "}
                          {order.delivery_zip}
                        </span>
                      </div>

                      <div className="info-item">
                        <span>Payment Method:</span>
                        <span>{order.payment_method}</span>
                      </div>

                      <div className="info-item">
                        <span>Payment Status:</span>
                        <span className={order.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* TOTALS */}
                    <div className="order-total">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="order-total">
                      <span>Delivery Fee:</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>

                    <div className="order-total total-amount-row">
                      <span>Total:</span>
                      <span className="total-amount">${total.toFixed(2)}</span>
                    </div>

                    {/* ACTIONS */}
                    <div className="order-actions">
                      <Button className="details-btn">View Details</Button>

                      {order.status === "delivered" && (
                        <Button className="reorder-btn">Reorder</Button>
                      )}

                      {(order.status === "pending" || order.status === "ready") && (
                        <Button className="text-red-600 border-red-600">
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}