import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { endpoints, authHeaders } from "../../api/api";

export default function EditMeal() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`${endpoints.MEALS}${id}/`);
        setMeal(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load meal");
      }
    })();
  }, [id]);

  if (!meal) return <p>Loading...</p>;

  const handleChange = (e) => setMeal({ ...meal, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (image) {
        const fd = new FormData();
        fd.append("name", meal.name);
        fd.append("description", meal.description);
        fd.append("price", meal.price);
        fd.append("category", meal.category || "");
        fd.append("is_available", meal.is_available ?? true);
        fd.append("image", image);
        await api.put(`${endpoints.MEALS}${id}/`, fd, {
          headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.put(`${endpoints.MEALS}${id}/`, meal, { headers: authHeaders() });
      }
      alert("Meal updated");
      nav("/admin/orders");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Meal</h1>
      <form onSubmit={submit} className="max-w-xl bg-white p-6 rounded shadow">
        <label className="block mb-2">Name</label>
        <input name="name" value={meal.name} onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />

        <label className="block mb-2">Price</label>
        <input name="price" type="number" value={meal.price} onChange={handleChange} required className="w-full mb-3 p-2 border rounded" />

        <label className="block mb-2">Category</label>
        <input name="category" value={meal.category || ""} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <label className="block mb-2">Description</label>
        <textarea name="description" value={meal.description || ""} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <label className="block mb-2">Replace Image (optional)</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="mb-4" />
        {meal.image && <img src={meal.image} alt="meal" className="w-32 h-20 object-cover mb-3" />}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => nav("/admin/orders")} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
