import { useState } from "react";
import api, { endpoints, authHeaders } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AddMeal() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    preparationTime: "",
    calories: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (!form.name || !form.description || !form.price || !form.categoryId) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("categoryId", form.categoryId);
      fd.append("preparationTime", form.preparationTime || 30);
      fd.append("calories", form.calories || 0);
      if (image) fd.append("image", image);

      const res = await api.post(endpoints.MEALS, fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });

      alert("Meal added successfully!");
      nav("/admin/orders");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data?.detail || "Failed to add meal");
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

        <label className="block mb-2">Category ID *</label>
        <input name="categoryId" type="number" value={form.categoryId} onChange={handleChange} required className="w-full mb-3 p-2 border rounded" placeholder="e.g., 1" />

        <label className="block mb-2">Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange} required className="w-full mb-3 p-2 border rounded" placeholder="At least 10 characters" />

        <label className="block mb-2">Preparation Time (minutes)</label>
        <input name="preparationTime" type="number" value={form.preparationTime} onChange={handleChange} className="w-full mb-3 p-2 border rounded" placeholder="e.g., 30" />

        <label className="block mb-2">Calories</label>
        <input name="calories" type="number" value={form.calories} onChange={handleChange} className="w-full mb-3 p-2 border rounded" placeholder="e.g., 500" />

        <label className="block mb-2">Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="mb-4" />

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? "Saving..." : "Add Meal"}
          </button>
          <button type="button" onClick={() => { setForm({ name:"", description:"", price:"", categoryId:"", preparationTime:"", calories:"" }); setImage(null); }} className="px-4 py-2 bg-gray-200 rounded">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
