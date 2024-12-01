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
    <div className="w-container mx-auto my-40">
      <div id="advantages-section" className={`flex justify-between items-center`}>

        <img
          src={AdvantagesImage}
          alt="Advantages"
          className={`${styles.imageLeft} w-1/2 transition-all duration-1000 ${isVisible ? styles.imageLeftActive : ''}`}
        />
        <div className={`w-[520px] ${isVisible ? styles.textRightActive : styles.textRight}`}>
          <h2 className={`${styles.fadeInText} font-bold leading-9`}>Grow Us Your Skill <br /> With Quanta</h2>
          <p className="mt-6">
            We denounce with righteous indignation and dislike men who are so beguiled and demoralized that cannot trouble.
          </p>
          <div className="mt-8">
            <p className="flex flex-row mt-2"><img src={Check} alt="" />Best LMS 2024</p>
            <p className="flex flex-row mt-2"><img src={Check} alt="" />Most powerful platform</p>
            <p className="flex flex-row mt-2"><img src={Check} alt="" />All courses are free</p>
            <p className="flex flex-row mt-2"><img src={Check} alt="" />For all levels</p>
          </div>
          <button className="bg-primary text-white font-semibold mt-8 py-4 px-8 rounded-[24px] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50">
            Explore Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default Advantages;
