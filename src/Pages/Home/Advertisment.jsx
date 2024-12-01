import React, { useState, useEffect, useRef } from "react";
import AdvertismentBanner from '../../Materials/Images/AdvertismentBanner.png';
import styles from './Home.module.css';

const Advertisment = () => {

  const [loaded, setLoaded] = useState(false);
  const bannerRef = useRef(null);

  const handleScroll = () => {
    const bannerPosition = bannerRef.current.getBoundingClientRect().top;
    if (bannerPosition <= window.innerHeight) {
      setLoaded(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={bannerRef}
      className={`w-container mx-auto h-[324px] bg-cover bg-center rounded-[24px] my-20 transition-all ${loaded ? styles.fadeIn : styles.initial}`}
      style={{ backgroundImage: `url(${AdvertismentBanner})` }}>
        <div className={`pt-16 pl-16 transition-all`}>
        <h5>New Course</h5>
        <h2 className='font-bold mt-1 mb-4'>Python Middle Developer</h2>
        <p>The next level of LearnPress - LMS WordPress Plugin. <br /> More Powerful, Flexible and Magical Inside.</p>
        <button className="bg-primary text-white font-semibold mt-8 py-4 px-8 rounded-[24px] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50">
          Explore Course
        </button>
      </div>
    </div>
  );
};

export default Advertisment;
