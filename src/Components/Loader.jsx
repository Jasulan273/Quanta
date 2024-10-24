import React from 'react';
import logo from '../Materials/Images/Logo.png';
import './Loader.css'

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="animate-pulse w-60 h-60"> 
        <img
          src={logo}
          alt="Loading Logo"
          className="w-full h-full object-contain transform animate-pulse-scale"
        />
      </div>
      <div className="mt-6 w-48 h-2 bg-gray-200 relative overflow-hidden rounded-full"> {/* Исправлен ползунок */}
        <div className="absolute left-0 top-0 h-full bg-orange-500 animate-loading-bar"></div>
      </div>
      <p className="mt-4 text-orange-500 text-lg font-medium">Loading...</p>
    </div>
  );
};

export default Loader;
