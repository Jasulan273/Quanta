import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../Materials/Images/Logo_art.png";

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/Auth");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex items-center justify-between w-full max-w-7xl mx-auto h-16 px-4 border-b border-lightgrey">
      <div className="flex items-center">
        <img src={Logo} className="w-12 h-auto" alt="Logo" />
        <h1 className="ml-2 font-bold text-lg">Quanta</h1>
      </div>

      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-black focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>
      </div>

      <div className={`flex-col md:flex md:flex-row md:items-center md:gap-6 font-semibold absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out ${isMenuOpen ? 'flex' : 'hidden md:flex'}`}>
        <NavLink
          to="/Home"
          className={({ isActive }) =>
            `text-sm transition hover:scale-105 px-3 py-2 w-full md:w-auto text-center md:text-left ${isActive ? "bg-lightgrey text-warning border-gray-300 shadow-md rounded" : "text-black"}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          HOME
        </NavLink>
        <NavLink
          to="/Courses"
          className={({ isActive }) =>
            `text-sm transition hover:scale-105 px-3 py-2 w-full md:w-auto text-center md:text-left ${isActive ? "bg-lightgrey text-black border border-gray-300 shadow-md rounded" : "text-black"}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          COURSES
        </NavLink>
        <NavLink
          to="/Blog"
          className={({ isActive }) =>
            `text-sm transition hover:scale-105 px-3 py-2 w-full md:w-auto text-center md:text-left ${isActive ? "bg-lightgrey text-black border border-gray-300 shadow-md rounded" : "text-black"}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          BLOG
        </NavLink>
        <NavLink
          to="/About"
          className={({ isActive }) =>
            `text-sm transition hover:scale-105 px-3 py-2 w-full md:w-auto text-center md:text-left ${isActive ? "bg-lightgrey text-black border border-gray-300 shadow-md rounded" : "text-black"}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          ABOUT
        </NavLink>
        <NavLink
          to="/FAQ"
          className={({ isActive }) =>
            `text-sm transition hover:scale-105 px-3 py-2 w-full md:w-auto text-center md:text-left ${isActive ? "bg-lightgrey text-black border border-gray-300 shadow-md rounded" : "text-black"}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          FAQ
        </NavLink>
        <NavLink
          to="/Quiz"
          className={({ isActive }) =>
            `text-sm transition hover:scale-105 px-3 py-2 w-full md:w-auto text-center md:text-left ${isActive ? "bg-lightgrey text-black border border-gray-300 shadow-md rounded" : "text-black"}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          QUIZ
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-bold">
              <a href="/Quanta/UserPanel">{user}</a>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-bold text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/Auth" className="text-sm font-bold transition hover:scale-105 text-black">
              Login
            </NavLink>
            <span className="text-sm">||</span>
            <NavLink to="/Registration" className="text-sm font-bold transition hover:scale-105 text-black">
              Register
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}