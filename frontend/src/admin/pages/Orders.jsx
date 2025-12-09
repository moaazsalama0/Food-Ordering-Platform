import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { endpoints, authHeaders } from "../../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Use admin orders endpoint for the admin panel
      const res = await api.get(endpoints.ADMIN_ORDERS, { headers: authHeaders() });
      setOrders(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customer Orders</h1>

      {loading ? <p>Loading...</p> : (
        <div className="space-y-4">
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">Order #{o.id} — {o.current_status || o.status}</div>
                <div className="text-sm text-gray-600">Placed: {new Date(o.created_at || o.placement_date).toLocaleString()}</div>
                <div className="text-sm">Total: {o.total ?? o.subtotal ?? o.total_amount}</div>

                <div className="mt-2">
                  { (o.items || o.order_items || o.orderitem_set)?.map((it, idx) => (
                    <div key={idx} className="text-sm text-gray-700">
                      {it.meal?.name || it.name || it.dish_name} x {it.qty || it.quantity || it.cart_items_quantities}
                    </div>
                  )) }
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Link to={`/admin/order/${o.id}`} className="px-3 py-1 bg-blue-600 text-white rounded">View</Link>
                <button onClick={fetchOrders} className="px-3 py-1 bg-gray-200 rounded">Refresh</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
