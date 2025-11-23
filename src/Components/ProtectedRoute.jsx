import { useState } from "react";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute(){
    const [isLoggedin , setIsLoggedin] = useState(localStorage.getItem('token') != null)
    return isLoggedin ? children : <Navigate to={'/login'}/>
}