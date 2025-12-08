import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PiForkKnifeFill } from "react-icons/pi";
import { FaShoppingCart } from "react-icons/fa";
import SideBar from '../SideBar/SideBar';
import './Navbar.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount and when storage changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem('token') !== null);
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className='fixed top-0 left-0 right-0 bg-stone-50 z-50 shadow-sm'>
      <div className='flex items-center justify-between px-4 py-3 max-w-7xl mx-auto'>
        
        {/* Left side - Sidebar (only when logged in) */}
        <div className='flex items-center gap-3'>
          {isLoggedIn && <SideBar />}
        </div>

        {/* Center - Brand */}
        <div className='absolute left-1/2 transform -translate-x-1/2'>
          <NavLink to="/" className="flex gap-1 items-center">
            <PiForkKnifeFill className='text-2xl text-amber-600' />
            <p className="font-bold text-amber-600 text-2xl">FoodHub</p>
          </NavLink>
        </div>

        {/* Right side - Actions */}
        <div className='flex items-center gap-4'>
          {isLoggedIn ? (
            <>
              <NavLink to='/cart' className='text-amber-600 hover:text-amber-700'>
                <FaShoppingCart className='text-lg cursor-pointer' />
              </NavLink>
              <button 
                onClick={handleLogout}
                className='text-amber-600 hover:text-amber-700 font-medium'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to='/cart' className='text-amber-600 hover:text-amber-700'>
                <FaShoppingCart className='text-lg cursor-pointer' />
              </NavLink>
              <NavLink to='/register' className='text-amber-600 hover:text-amber-700 hidden sm:block'>
                SignUp
              </NavLink>
              <NavLink to='/login' className='text-amber-600 hover:text-amber-700 hidden sm:block'>
                Signin
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}