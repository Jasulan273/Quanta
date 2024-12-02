import React from "react";
import { Link } from "react-router-dom";
import NotFoundImage from "../../Materials/Images/404.png"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center" style={{ backgroundImage: `url(${NotFoundImage})`, backgroundPosition:'0' }}>
      <h1 className="text-6xl font-bold text-orange-500">404</h1>
      <p className="text-xl text-gray-700 mt-4">Oops! The page you are looking for does not exist.</p>
      <Link
        to="/Home"
        className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg text-lg hover:bg-orange-600 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
