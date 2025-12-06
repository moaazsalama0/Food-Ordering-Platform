import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-5">Admin Dashboard</h2>
        
        <ul className="space-y-3">
          <li><Link to="/admin/add-meal">Add Meal</Link></li>
          <li><Link to="/admin/edit-meal">Edit Meal</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/admin/ratings">Ratings</Link></li>
          <li><Link to="/admin/upload-image">Upload Images</Link></li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>

    </div>
  );
}
