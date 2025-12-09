import { useState, useEffect } from "react";
import api, { endpoints, authHeaders } from "../../api/api";

export default function UploadMealImages() {
  const [meals, setMeals] = useState([]);
  const [fileMap, setFileMap] = useState({}); // { mealId: File }

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(endpoints.MEALS, { headers: authHeaders() });
        setMeals(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load meals");
      }
    })();
  }, []);

  const handleFile = (mealId, file) => {
    setFileMap({ ...fileMap, [mealId]: file });
  };

  const upload = async (mealId) => {
    try {
      const file = fileMap[mealId];
      if (!file) return alert("Select a file first");
      const fd = new FormData();
      fd.append("image", file);
      
      const res = await api.put(`${endpoints.MEALS}${mealId}/`, fd, { 
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" }
      });
      
      // Update the meal in the list with new image
      setMeals(meals.map(m => m.id === mealId ? { ...m, img: res.data?.data?.img || res.data?.img } : m));
      setFileMap({ ...fileMap, [mealId]: null });
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Image upload failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload Meal Images</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meals.map(m => (
          <div key={m.id} className="bg-white p-4 rounded shadow flex items-center gap-4">
            {(m.img || m.image) && <img src={m.img || m.image} alt={m.name} className="w-20 h-20 object-cover rounded" />}
            <div className="flex-1">
              <div className="font-semibold">{m.name}</div>
              <input type="file" accept="image/*" onChange={(e)=>handleFile(m.id, e.target.files[0])} className="mt-2" />
            </div>
            <div>
              <button onClick={()=>upload(m.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Upload</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
