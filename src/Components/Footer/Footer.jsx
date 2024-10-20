import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink for routing
import Logo from '../../Materials/Images/Logo_art.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-lightgrey flex flex-col mt-8 pt-16">
      <div className="flex flex-col md:flex-row justify-between items-start w-container h-[160px] mx-auto border-t border-lightgrey bg-lightgray">
        <div className="flex flex-col items-center justify-center h-full">
          <img src={Logo} className='w-[60px]' alt="Logo" />
          <h1 className='ml-2 font-bold'>Quanta</h1>
        </div>
        <div className="flex flex-col items-start justify-center h-full">
          <NavLink 
            to="/Home" 
            className="mb-2 text-[16px] transition ease-in delay-150 hover:scale-105 duration-200"
          >
            HOME
          </NavLink>
          <NavLink 
            to="/Courses" 
            className="mb-2 text-[16px] transition ease-in delay-150 hover:scale-105 duration-200"
          >
            COURSES
          </NavLink>
          <NavLink 
            to="/Blog" 
            className="mb-2 text-[16px] transition ease-in delay-150 hover:scale-105 duration-200"
          >
            BLOG
          </NavLink>
          <NavLink 
            to="/About" 
            className="mb-2 text-[16px] transition ease-in delay-150 hover:scale-105 duration-200"
          >
            ABOUT
          </NavLink>
          <NavLink 
            to="/FAQ" 
            className="mb-2 text-[16px] transition ease-in delay-150 hover:scale-105 duration-200"
          >
            FAQ
          </NavLink>
        </div>
      </div>
      <div className="border-t border-lightgrey py-2 text-center text-sm text-gray-500">
        &copy; {currentYear} Quanta. All rights reserved.
      </div>
    </div>
  );
}
