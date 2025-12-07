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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();

      setOrders(data); // API returns an array
    } catch (err) {
      console.error("ORDERS ERROR:", err);
    }

    setLoading(false);
  };

  // ICONS
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FaCheckCircle className="status-icon delivered" />;
      case "processing":
        return <FaClock className="status-icon processing" />;
      case "on-the-way":
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
      case "processing":
        return "warning";
      case "on-the-way":
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
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.cartItems.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter = filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

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
              className={
                filterStatus === "processing"
                  ? "filter-active"
                  : "filter-btn"
              }
              onClick={() => setFilterStatus("processing")}
            >
              Processing
            </Button>

            <Button
              className={
                filterStatus === "on-the-way" ? "filter-active" : "filter-btn"
              }
              onClick={() => setFilterStatus("on-the-way")}
            >
              On the way
            </Button>

            <Button
              className={
                filterStatus === "delivered" ? "filter-active" : "filter-btn"
              }
              onClick={() => setFilterStatus("delivered")}
            >
              Delivered
            </Button>
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className="orders-list">
          {loading ? (
            <div className="loading-state">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <h3>No orders found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const subtotal = order.cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              const deliveryFee = subtotal >= 200 ? 0 : 20;

              const total = subtotal + deliveryFee;

              return (
                <Card key={order.id} className="order-card">
                  <CardHeader className="order-card-header">
                    <div className="order-info">
                      <h3>Order #{order.id}</h3>

                      <p>
                        {new Date(order.createdAt).toLocaleString("en-US", {
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
                      {order.status.replace("-", " ")}
                    </Chip>
                  </CardHeader>

                  <CardBody className="order-card-body">
                    {/* ITEMS */}
                    <div className="order-items">
                      {order.cartItems.map((item, index) => (
                        <div key={index} className="order-item">
                          <div className="item-details">
                            <span>{item.name}</span>
                            <span>×{item.quantity}</span>
                          </div>
                          <span>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* DELIVERY INFO */}
                    <div className="order-delivery-info">
                      <div className="info-item">
                        <span>Address:</span>
                        <span>
                          {order.deliveryAddress},{" "}
                          {order.deliveryCity} {order.deliveryZip}
                        </span>
                      </div>

                      <div className="info-item">
                        <span>Payment Method:</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>

                    {/* TOTALS (DYNAMIC) */}
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
                      <span className="total-amount">
                        ${total.toFixed(2)}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="order-actions">
                      <Button className="track-btn">Track Order</Button>

                      {order.status === "delivered" && (
                        <Button className="reorder-btn">Reorder</Button>
                      )}

                      <Button className="details-btn">View Details</Button>
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