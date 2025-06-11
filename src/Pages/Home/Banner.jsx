import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from "./Home.module.css";

const Banner = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex items-center justify-center w-full min-h-[400px] sm:min-h-[500px]`}>
      <div className={`w-full h-[500px] sm:h-[600px] ${styles.banner} bg-cover bg-center`}>
        <div className="w-full max-w-7xl mx-auto px-4 mt-24 sm:mt-40 h-auto">
          <h1
            className={`font-bold text-2xl sm:text-4xl md:text-5xl ${isLoaded ? styles.fadeInLeftActive : styles.fadeInLeft}`}
          >
            Build Skills With <br /> Online Course
          </h1>
          <p
            className={`text-sm sm:text-lg md:text-xl max-w-xl mt-4 ${isLoaded ? styles.fadeInLeftActive : styles.fadeInLeft}`}
          >
            We denounce with righteous indignation and dislike men who are <br />
            so beguiled and demoralized that cannot trouble.
          </p>
       <NavLink to="/presentation">
          <button
            className={`bg-primary text-white font-semibold mt-6 py-3 px-6 sm:py-4 sm:px-8 rounded-3xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50 text-sm sm:text-base ${isLoaded ? styles.fadeInLeftActive : styles.fadeInLeft}`}
          >
            Presentation
          </button>
       </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Banner;