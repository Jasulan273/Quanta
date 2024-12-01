import React, { useState, useEffect, useRef } from "react";
import PopularBanner from "../../Materials/Images/PopularBannerFull.jpeg";
import styles from './Home.module.css';

const Popular = () => {
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
      className={`w-container mx-auto h-[324px] bg-cover bg-center rounded-[24px] my-20 border-gray-200 border-2 transition-all ${loaded ? styles.fadeIn : styles.initial}`}
      style={{ backgroundImage: `url(${PopularBanner})` }}
    >
      <div className={`flex flex-col items-center pt-16 pl-16 transition-all ${loaded ? styles.textFadeIn : styles.textInitial}`}>
        <h5 className={`transition-all ${loaded ? styles.fadeInText : ''}`}>Most Popular Course</h5>
        <h2 className={`font-bold mt-1 mb-4 transition-all ${loaded ? styles.fadeInText : ''}`}>Java Junior Developer</h2>
        <p className={`text-center transition-all ${loaded ? styles.fadeInText : ''}`}>
          The next level of LearnPress - LMS WordPress Plugin. <br /> More Powerful, Flexible and Magical Inside.
        </p>
        <button className="bg-primary w-[177px] text-white font-semibold mt-8 py-4 px-8 rounded-[24px] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50">
          Explore Course
        </button>
      </div>
    </div>
  );
};

export default Popular;
