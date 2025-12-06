import { useState } from "react";
import api, { endpoints, authHeaders } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AddMeal() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    is_available: true,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("category", form.category);
      fd.append("is_available", form.is_available);
      if (image) fd.append("image", image);

      const res = await api.post(endpoints.MEALS, fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });

      alert("Meal added");
      nav("/admin/orders"); // or wherever you want to redirect
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to add meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Meal</h1>
      <form onSubmit={submit} className="max-w-xl bg-white p-6 rounded shadow">
        <label className="block mb-2">Name</label>
        <input name="name" value={form.name} onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />

        <label className="block mb-2">Price</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />

        <label className="block mb-2">Category</label>
        <input name="category" value={form.category} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <label className="block mb-2">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <label className="block mb-2">Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="mb-4" />

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? "Saving..." : "Add Meal"}
          </button>
          <button type="button" onClick={() => { setForm({ name:"", description:"", price:"", category:"", is_available:true }); setImage(null); }}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
