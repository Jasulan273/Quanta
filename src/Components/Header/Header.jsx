import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../../Materials/Images/Logo_art.png';

export default function Header() {
  return (
    <div className="flex items-center justify-between w-container h-[72px] mx-auto border-b border-lightgrey">
      <div className="flex flex-row h-max items-center">
        <img src={Logo} className='w-[60px]' alt="Logo" />
        <h1 className='ml-2 font-bold'>Quanta</h1>
      </div>
      <div className="flex flex-row w-[50%] h-full items-center justify-between font-semibold">
        <NavLink 
          to="/Home" 
          className={({ isActive }) => 
            `flex items-center justify-center h-full text-[16px] transition ease-in delay-150 hover:scale-105 duration-200 ${isActive ? 'bg-lightgrey text-warning border-gray-300 shadow-lg px-4 py-2' : 'text-black px-4 py-2'}`}
        >
          HOME
        </NavLink>
        <NavLink 
          to="/Courses" 
          className={({ isActive }) => 
            `flex items-center justify-center h-full text-[16px] transition ease-in delay-150 hover:scale-105 duration-200 ${isActive ? 'bg-lightgrey text-black border border-gray-300 shadow-lg px-4 py-2' : 'text-black px-4 py-2'}`}
        >
          COURSES
        </NavLink>
        <NavLink 
          to="/Blog" 
          className={({ isActive }) => 
            `flex items-center justify-center h-full text-[16px] transition ease-in delay-150 hover:scale-105 duration-200 ${isActive ? 'bg-lightgrey text-black border border-gray-300 shadow-lg px-4 py-2' : 'text-black px-4 py-2'}`}
        >
          BLOG
        </NavLink>
        <NavLink 
          to="/About" 
          className={({ isActive }) => 
            `flex items-center justify-center h-full text-[16px] transition ease-in delay-150 hover:scale-105 duration-200 ${isActive ? 'bg-lightgrey text-black border border-gray-300 shadow-lg px-4 py-2' : 'text-black px-4 py-2'}`}
        >
          ABOUT
        </NavLink>
        <NavLink 
          to="/FAQ" 
          className={({ isActive }) => 
            `flex items-center justify-center h-full text-[16px] transition ease-in delay-150 hover:scale-105 duration-200 ${isActive ? 'bg-lightgrey text-black border border-gray-300 shadow-lg px-4 py-2' : 'text-black px-4 py-2'}`}
        >
          FAQ
        </NavLink>
      </div>
      <div className="flex">
        <NavLink 
          to="/Auth" 
          className="flex items-center justify-center h-full text-[16px] font-bold transition ease-in delay-150 hover:scale-105 duration-200 text-black py-2"
        >
          Login|
        </NavLink>
        <NavLink 
          to="/Registration" 
          className="flex items-center justify-center h-full text-[16px] font-bold transition ease-in delay-150 hover:scale-105 duration-200 text-black py-2"
        >
          |Register
        </NavLink>
      </div>
    </div>
  );
}
