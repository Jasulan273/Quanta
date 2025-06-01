import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation  } from "react-router-dom";
import Logo from "../../Materials/Images/Logo_art.png";
import { API_URL } from "../../Api/api";

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

   useEffect(() => {
 
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/Auth");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="flex items-center justify-between w-full max-w-7xl mx-auto h-16 px-4 border-b z-1000 border-lightgrey relative">
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
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold overflow-hidden">
                {user.avatar ? (
                  <img src={`${API_URL}${user.avatar}`} alt="User avatar" className="w-full h-full object-cover" />
                ) : (
                  user.username?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <span className="hidden md:inline text-sm font-medium">{user.username || 'User'}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <NavLink
                  to="/UserPanel"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink
              to="/Auth"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition"
            >
              Login
            </NavLink>
            <NavLink
              to="/Registration"
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition"
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}