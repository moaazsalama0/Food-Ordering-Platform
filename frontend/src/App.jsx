import { useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import Homepage from './Pages/Homepage';
import Profile from './Pages/Profile';
import NotFound from './Pages/NotFound';
import AuthLayout from './Layouts/AuthLayout';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ProtectedRoute from './Components/ProtectedRoute';
import AuthProtectedRoute from './Components/AuthProtectedRoute';
import Menu from './Pages/Menu';
import Cart from './Pages/cart';
import Checkout from './Pages/Checkout';
import Orders from './Pages/Orders';
import AdminLayout from './Layouts/AdminLayout';
import AddDish from './admin/pages/AddDish';
import EditDish from './admin/pages/EditDish';
import AdminOrders from './admin/pages/Orders';
import RatingStatistics from './admin/pages/RatingStatistics';
import UploadMealImages from './admin/pages/UploadMealImages';


function App() {
  const routers = createBrowserRouter([
    {
      path: '',
      element: <MainLayout />,
      children: [
        { index: true, element: <Homepage /> },
        { path: 'menu', element: <Menu /> },
        { path: 'cart', element: <Cart /> },
        { 
          path: 'checkout', 
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          )
        },
        { 
          path: 'profile', 
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )
        },
        { 
          path: 'orders', 
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          )
        },
        { path: '*', element: <NotFound /> },
      ],
    },
    {
      path: 'admin',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: 'add-meal', element: <AddDish /> },
        { path: 'edit-meal', element: <EditDish /> },
        { path: 'orders', element: <AdminOrders /> },
        { path: 'ratings', element: <RatingStatistics /> },
        { path: 'upload-image', element: <UploadMealImages /> },
      ],
    },
    {
      path: '',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: (
            <AuthProtectedRoute>
              <Login />
            </AuthProtectedRoute>
          ),
        },
        {
          path: 'register',
          element: (
            <AuthProtectedRoute>
              <Register />
            </AuthProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <div className="bg-stone-50 h-full">
      <RouterProvider router={routers}></RouterProvider>
    </div>
  );
}

export default App;