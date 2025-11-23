import React, { useState } from 'react';
import { Button, Link } from "@heroui/react"; 
import {  Navbar  as AppNavbar ,   NavbarBrand,   NavbarContent,   NavbarItem,   NavbarMenuToggle,  NavbarMenu,  NavbarMenuItem} from "@heroui/navbar";
import { NavLink } from 'react-router-dom';
import { PiForkKnifeFill } from "react-icons/pi";
import { FaShoppingCart } from "react-icons/fa";
export default function Navbar() {
  const[isLoggedIn, setIsLoggedin] = useState(localStorage.getItem('token')!=null)
  return (
    <>
   <AppNavbar className='bg-stone-50'>
      <NavbarBrand className='flex gap-1'>
        <PiForkKnifeFill className='mt-1 text-2xl text-amber-600' />
       <p className="font-bold text-amber-600 text-2xl"> FoodHub</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
      </NavbarContent>
      <NavbarContent justify='end'>
        {isLoggedIn ? <NavbarItem className=' text-amber-600'>
          Logout
        </NavbarItem> :
        <>
        <NavbarItem className=' text-amber-600'>
          <NavLink to={''}><FaShoppingCart className='text-lg mt-1 cursor-pointer' /> </NavLink>
        </NavbarItem>
        <NavbarItem className=' text-amber-600'>
          <NavLink to={'register'}> SignUp</NavLink>
        </NavbarItem>
             <NavbarItem className=' text-amber-600'>
          <NavLink to={'login'}> Signin</NavLink>
        </NavbarItem>
        </>
        
        }

      </NavbarContent>
    </AppNavbar>
 


    </>
  )}