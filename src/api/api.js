import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
  withCredentials: false,
});

export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const endpoints = {
  Dishes: "dishes/",             
  ORDERS: "orders/",            
  ORDER_STATUS: (id) => `orders/${id}/update_status/`, 
  RATINGS_STATS: "ratings-stats/", 
  UPLOAD_IMAGE: "meals/upload-image/",
};

export default api;
