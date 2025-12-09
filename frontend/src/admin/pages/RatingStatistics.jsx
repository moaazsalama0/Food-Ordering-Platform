import { useEffect, useState } from "react";
import api, { endpoints, authHeaders } from "../../api/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function RatingStatistics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // Use menu/dishes endpoint to get all meals for now
        // In a real app, you'd have a ratings endpoint
        const res = await api.get(endpoints.MEALS, { headers: authHeaders() });
        
        // Create mock rating data from meals
        const normalized = (res.data.data || res.data).map((item, idx) => ({
          name: item.name || `Meal ${item.id}`,
          avg: 4 + Math.random(), // Mock average rating
          count: Math.floor(Math.random() * 50) + 5 // Mock rating count
        }));
        
        setData(normalized);
      } catch (err) {
        console.error(err);
        alert("Failed to load rating statistics: " + (err.response?.data?.message || err.message));
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Rating Statistics</h1>

      <div className="bg-white p-4 rounded shadow">
        {data.length === 0 ? (
          <p>No stats yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="avg" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
