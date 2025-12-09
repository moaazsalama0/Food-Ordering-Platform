import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  }
});

export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// API Endpoints matching your backend
export const endpoints = {
  // Menu endpoints
  MENU: "menu/",
  DISHES: "dishes/", // Use dishes alias from backend
  MEALS: "dishes/", // Alias for MEALS in admin panel
  MENU_ITEM: (id) => `menu/${id}`,
  
  // Auth endpoints
  REGISTER: "auth/register",
  LOGIN: "auth/login",
  ME: "auth/me",
  LOGOUT: "auth/logout",
  
  // Order endpoints
  ORDERS: "orders/",
  MY_ORDERS: "orders/my-orders",
  ORDER_DETAIL: (id) => `orders/${id}`,
  CANCEL_ORDER: (id) => `orders/${id}/cancel`,
  
  // Admin Order endpoints
  ADMIN_ORDERS: "orders/admin/all",
  UPDATE_ORDER_STATUS: (id) => `orders/admin/${id}/status`,
  UPDATE_PAYMENT_STATUS: (id) => `orders/admin/${id}/payment-status`,
  ORDER_STATS: "orders/admin/stats",
  
  // Cart endpoints
  CART: "cart/",
  ADD_TO_CART: "cart/add",
  REMOVE_FROM_CART: (id) => `cart/remove/${id}`,
  UPDATE_CART: (id) => `cart/update/${id}`,
  CLEAR_CART: "cart/clear",
  CALCULATE_TOTALS: "cart/calculate-totals",
  
  // User endpoints
  PROFILE: "users/profile",
  CHANGE_PASSWORD: "users/change-password",
  ADMIN_USERS: "users/admin/all",
  USER_STATS: "users/admin/stats",
  
  // Payment endpoints
  CREATE_PAYMENT_INTENT: "payments/create-payment-intent",
  CONFIRM_PAYMENT: "payments/confirm-payment",
  CASH_PAYMENT: "payments/cash-payment",
  REFUND: "payments/refund",
};

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;