import { useEffect, useState } from "react";
import api, { endpoints, authHeaders } from "../../api/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function RatingStatistics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(endpoints.RATINGS_STATS, { headers: authHeaders() });
        const normalized = res.data.map(item => {
          // try multiple possible field names
          const mealId = item.meal ?? item._id ?? item._id?.meal ?? null;
          const avg = item.avg ?? item.avgScore ?? item.avg_score ?? item.avgRating ?? 0;
          const count = item.count ?? item._count ?? 0;
          return { name: item.name || `Meal ${mealId}`, avg: Number(avg), count: Number(count) };
        });
        setData(normalized);
      } catch (err) {
        console.error(err);
        alert("Failed to load rating statistics");
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
