import React from 'react';
import { NavLink } from 'react-router-dom'; 
import Logo from '../../Materials/Images/Logo_art.png';
import Facebook from '../../Materials/Icons/facebook.png';
import Twitter from '../../Materials/Icons/twitter.png';
import Instagram from '../../Materials/Icons/instagram.png';
import LinkedIn from '../../Materials/Icons/linkedin.png'; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-8 pb-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col items-center md:flex-row md:items-center justify-center md:mb-0 w-full md:w-auto">
          <img src={Logo} className="w-20 h-auto mb-4 md:mb-0" alt="Logo" />
          <div className="text-center md:text-left md:ml-4">
            <h1 className="text-3xl font-bold">Quanta</h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">
              Platform for learning programming with AI-driven insights.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-center md:space-x-12 space-y-4 md:space-y-0 w-full md:w-auto">
          <NavLink to="/Home" className="text-base transition hover:text-orange-400">HOME</NavLink>
          <NavLink to="/Courses" className="text-base transition hover:text-orange-400">COURSES</NavLink>
          <NavLink to="/Blog" className="text-base transition hover:text-orange-400">BLOG</NavLink>
          <NavLink to="/About" className="text-base transition hover:text-orange-400">ABOUT</NavLink>
          <NavLink to="/FAQ" className="text-base transition hover:text-orange-400">FAQ</NavLink>
        </div>

        <div className="flex flex-col items-center md:items-end w-full md:w-auto">
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/profile.php?id=61572994283521" target="_blank" rel="noopener noreferrer" className="transition hover:scale-105 duration-200">
              <img src={Facebook} alt="Facebook" className="w-6 h-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="transition hover:scale-105 duration-200">
              <img src={Twitter} alt="Twitter" className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/quanta.ast/" target="_blank" rel="noopener noreferrer" className="transition hover:scale-105 duration-200">
              <img src={Instagram} alt="Instagram" className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="transition hover:scale-105 duration-200">
              <img src={LinkedIn} alt="LinkedIn" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8 md:mt-12 border-t border-gray-700 pt-6 px-4">
        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-400">
          <p>Location: Astana EXPO C1</p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        © {currentYear} Quanta. All rights reserved.
      </div>
    </footer>
  );
}