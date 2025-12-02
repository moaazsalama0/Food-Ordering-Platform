import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { endpoints, authHeaders } from "../../api/api";

const STATUS_CHOICES = ["pending","confirmed","preparing","out-for-delivery","delivered","cancelled"];

export default function UpdateOrderStatus() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`${endpoints.ORDERS}${id}/`, { headers: authHeaders() });
        setOrder(res.data);
        setStatus(res.data.status || res.data.current_status || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load order");
      }
    })();
  }, [id]);

  const save = async () => {
    try {
      setSaving(true);
      // using special endpoint (Django viewset action) if available
      await api.patch(endpoints.ORDER_STATUS(id), { status }, { headers: authHeaders() });
      alert("Status updated");
      nav("/admin/orders");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Update Order #{order.id}</h1>
      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <div className="mb-4">
          <div className="text-sm text-gray-600">Customer: {order.user?.username || order.user_email || order.user}</div>
          <div className="text-sm text-gray-600">Address: {order.address}</div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Status</label>
          <select value={status} onChange={(e)=>setStatus(e.target.value)} className="p-2 border rounded w-full">
            <option value="">-- choose --</option>
            {STATUS_CHOICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={() => nav("/admin/orders")} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
