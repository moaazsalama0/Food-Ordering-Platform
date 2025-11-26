import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import Homepage from './Pages/Homepage'
import Profile from './Pages/Profile'
import NotFound from './Pages/NotFound'
import AuthLayout from './Layouts/AuthLayout'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ProtectedRoute from './Components/ProtectedRoute'
import AuthProtectedRoute from './Components/AuthProtectedRoute'
function App() {
  const routers= createBrowserRouter([
    {path:'', element: <MainLayout/> , children:[
      {index:true , element:  <Homepage/>},
      {path:'profile' , element: <Profile/>},
      {path:'Orders' , element: <Orders/>},
      {path:'*', element:<NotFound/>}],
    },{path:'', element: <AuthLayout/> , children:[
      {path:'login', element:<AuthProtectedRoute><Login/></AuthProtectedRoute>},
      {path:'register', element:<AuthProtectedRoute><Register/></AuthProtectedRoute>}
    ]

    }
  ])

  return (
    <>
    <div className='bg-stone-50 h-full'>
    <RouterProvider router={routers}></RouterProvider>
    </div>
    
    </>
  )
}

export default App
