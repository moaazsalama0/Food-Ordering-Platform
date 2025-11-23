import React from 'react';
import myPhoto from '../assets/burger.png'
import { FaHamburger } from "react-icons/fa";
import { FaPizzaSlice } from "react-icons/fa";
import { FaIceCream } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import { PiForkKnifeFill } from "react-icons/pi";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { SiGooglemaps } from "react-icons/si";


import "./HomePage.css"
export default function Homepage() {
  return (
    <>
    <div className='mydiv'>
    
    <div className=' pt-5 m-5'>
      
      <h1 className='text-6xl font-bold homepage'>Delicious Food <span className='text-amber-600 '>Delivered Fast </span></h1>
      <p className='myparagraph text-md'>Order your favorite meals from the best restaurants in town.<br/> Fresh ingredients, quick delivery, and amazing taste guaranteed.</p>
      <button className='my-btn'>Order Now <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
</svg>
 </button>
    </div>
    
    <div>
      <div className='w-sm '>
      <div className="image-container">
        <img src={myPhoto} alt="burger" className="myimg shadow-lg" />
      </div>
      </div>
    </div>
    </div>
    <div className='text-center header'>
      <h2 className='font-bold text-3xl'> Browse By Category</h2>
      <p className='text-md text-gray-700'>Choose from our wide variety of food categories</p>
    </div>
  <div className='mycards'>
    <div className='mycard'>
      <div className="card-box">
        <FaHamburger className='myicon icon-wrapper' />
        <h3 className='font-bold'>Burgers</h3>
      </div>
    </div>
    <div className='mycard'>
      <div className="card-box">
        <FaPizzaSlice  className='myicon icon-wrapper' />
        <h3 className='font-bold'>pizza</h3>
      </div>
    </div>
    <div className='mycard'>
      <div className="card-box">
        <FaIceCream className='myicon icon-wrapper' />
        <h3 className='font-bold'>Desserts</h3>
      </div>
    </div>
  </div>
  <div className='extrainfo'>
    <div className='parts flex justify-content-center gap-4 '>
      <div className='part text-center'>
        <div className='icon-wrap mx-auto'>
        <FaClock className='text-amber-600 text-6xl'/>
        </div>
        <h3 className='font-bold text-2xl mt-2'>Fast Delivery</h3>
        <p className='text-gray-600 mt-2'>Get your food delivered in 30 minutes or less. We guarantee quick and reliable service.</p>

      </div>
      <div className='part text-center'>
        <div className='icon-wrap mx-auto'>
        <FaLeaf className='text-amber-600 text-6xl'/>
        </div>
        <h3 className='font-bold text-2xl mt-2'>Fresh Ingredients</h3>
        <p className='text-gray-600 mt-2'>We use only the freshest and highest quality ingredients in all our dishes.</p>

      </div>
      <div className='part text-center'>
        <div className='icon-wrap mx-auto'>
        <FaShieldAlt className='text-amber-600 text-6xl'/>
        </div>
        <h3 className='font-bold text-2xl mt-2'>Safe & Secure</h3>
        <p className='text-gray-600 mt-2'>Your payment information is protected with industry-standard encryption.</p>

      </div>
    </div>

  </div>
  <footer className='myfooter'>
  <div className='myfooter-div'>

    
    <div>
      <div className='flex pt-8 gap-1'>
        <div className='footer-wrap'>
          <PiForkKnifeFill className='text-2xl text-white' />
        </div>
        <span className='text-white text-2xl font-bold mt-1'>FoodHub</span>
      </div>

      <p className='text-gray-500 mt-3 mb-4'>
        Delivering delicious food to your doorstep since 2020.
      </p>

      <div className='icons flex gap-2'>
        <div className='link-wrapper'>
          <a href='https://www.facebook.com/' target='_blank'>
            <FaFacebook className='text-white text-2xl'/>
          </a>
        </div>
        <div className='link-wrapper'>
          <a href='https://www.instagram.com/' target='_blank'>
            <FaInstagram className='text-white text-2xl' />
          </a>
        </div>
        <div className='link-wrapper'>
          <a href='https://x.com/' target='_blank'>
            <FaTwitter className='text-white text-2xl'/>
          </a>
        </div>
      </div>
    </div>

    
    <div className='contact-box pt-5'>
      <h4 className='text-white text-2xl font-bold'>Contact Us</h4>
      <div className='flex gap-1 text-center'> 
        <FaPhone className='text-amber-600 mt-1' />
        <span className='text-gray-500 mb-2'> +1 (555) 123-4567</span>

      </div>
       <div className='flex gap-1 text-center'> 
        <IoMdMail className='text-amber-600 mt-1' />
        <span className='text-gray-500 mb-2'>hello@foodhub.com </span>

      </div>
       <div className='flex gap-1 text-center'> 
        <SiGooglemaps className='text-amber-600 mt-1' />
        <span className='text-gray-500 mb-2'> 123 Food Street, NY</span>

      </div>
    </div>

  </div>
</footer>

  

    
  </>
)}