import React, { useEffect, useState } from 'react';
import styles from "./Home.module.css";

const Banner = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex items-center justify-between w-full min-h-[500px]`}>
      <div className={`w-full h-[700px] ${styles.banner}`}>
        <div className="w-container mx-auto mt-[220px] h-auto">
          <h1
            className={`font-bold text-[48px] ${isLoaded ? styles.fadeInLeftActive : styles.fadeInLeft}`}
          >
            Build Skills With <br /> Online Course
          </h1>
          <p
            className={`text-[18px] ${isLoaded ? styles.fadeInLeftActive : styles.fadeInLeft}`}
          >
            We denounce with righteous indignation and dislike men who are <br />
            so beguiled and demoralized that cannot trouble.
          </p>
          <button
            className={`bg-primary text-white font-semibold mt-8 py-4 px-8 rounded-[24px] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50 ${isLoaded ? styles.fadeInLeftActive : styles.fadeInLeft}`}
          >
            Posts comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
