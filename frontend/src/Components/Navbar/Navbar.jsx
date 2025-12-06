import React, { useState } from 'react';
import { Button, Link } from "@heroui/react";
import { 
  Navbar as AppNavbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle, 
  NavbarMenu, 
  NavbarMenuItem
} from "@heroui/navbar";
import { NavLink } from 'react-router-dom';
import { PiForkKnifeFill } from "react-icons/pi";
import { FaShoppingCart } from "react-icons/fa";
import SideBar from '../SideBar/SideBar';
import './Navbar.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedin] = useState(localStorage.getItem('token') != null);

  return (
    <>
      <AppNavbar className='bg-stone-50 z-50 shadow-sm'>
        <NavbarContent className='navbar-content' justify='start'>
          <SideBar />
        </NavbarContent>

        <NavbarBrand className='navbar-brand flex gap-1 items-center justify-center'>
          <PiForkKnifeFill className='text-2xl text-amber-600' />
          <p className="font-bold text-amber-600 text-2xl">FoodHub</p>
        </NavbarBrand>

        <NavbarContent className='navbar-content' justify='end'>
          {isLoggedIn ? (
            <NavbarItem className='text-amber-600 cursor-pointer'>
              Logout
            </NavbarItem>
          ) : (
            <>
              <NavbarItem className='text-amber-600'>
                <NavLink to={'/cart'}>
                  <FaShoppingCart className='text-lg cursor-pointer' />
                </NavLink>
              </NavbarItem>
              <NavbarItem className='text-amber-600 hidden sm:block'>
                <NavLink to={'/register'}>SignUp</NavLink>
              </NavbarItem>
              <NavbarItem className='text-amber-600 hidden sm:block'>
                <NavLink to={'/login'}>Signin</NavLink>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </AppNavbar>
    </>
  );
}