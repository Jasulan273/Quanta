import React, { useEffect, useState } from "react";
import styles from './Home.module.css';
import AdvantagesImage from "../../Materials/Images/Advantages.png";
import Check from '../../Materials/Icons/Check.png';

const Advantages = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const element = document.getElementById('advantages-section');
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto my-16 sm:my-24 px-4">
      <div id="advantages-section" className="flex flex-col md:flex-row justify-between items-center gap-8">
        <img
          src={AdvantagesImage}
          alt="Advantages"
          className={`${styles.imageLeft} w-full md:w-1/2 max-w-lg transition-all duration-1000 ${isVisible ? styles.imageLeftActive : ''}`}
        />
        <div className={`w-full md:w-[520px] text-center md:text-left ${isVisible ? styles.textRightActive : styles.textRight}`}>
          <h2 className={`${styles.fadeInText} font-bold text-xl sm:text-2xl leading-9`}>Grow Us Your Skill <br /> With Quanta</h2>
          <p className="mt-4 text-sm sm:text-base">
            We denounce with righteous indignation and dislike men who are so beguiled and demoralized that cannot trouble.
          </p>
          <div className="mt-6 space-y-2">
            <p className="flex flex-row items-center text-sm sm:text-base"><img src={Check} className="w-5 h-5 mr-2" alt="" />Best LMS 2024</p>
            <p className="flex flex-row items-center text-sm sm:text-base"><img src={Check} className="w-5 h-5 mr-2" alt="" />Most powerful platform</p>
            <p className="flex flex-row items-center text-sm sm:text-base"><img src={Check} className="w-5 h-5 mr-2" alt="" />All courses are free</p>
            <p className="flex flex-row items-center text-sm sm:text-base"><img src={Check} className="w-5 h-5 mr-2" alt="" />For all levels</p>
          </div>
          <button className="bg-primary text-white font-semibold mt-6 py-3 px-6 sm:py-4 sm:px-8 rounded-3xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50 text-sm sm:text-base">
            Explore Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default Advantages;