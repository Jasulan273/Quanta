import React, { useState, useEffect, useRef } from "react";
import styles from './Home.module.css';
import { API_URL } from '../../Api/api';
import PopularBanner from '../../Materials/Images/PopularBannerFull.jpeg'

const Popular = () => {
  const [loaded, setLoaded] = useState(false);
  const [course, setCourse] = useState(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/mostpopularcourse/`)
      .then(response => response.json())
      .then(data => setCourse(data))
      .catch(error => console.error("Error fetching course data:", error));
  }, []);

  const handleScroll = () => {
    if (bannerRef.current) {
      const bannerPosition = bannerRef.current.getBoundingClientRect().top;
      if (bannerPosition <= window.innerHeight) {
        setLoaded(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!course) return null;

  const truncateDescription = (text, limit) => {
  if (!text) return '';
  return text.split(" ").slice(0, limit).join(" ") + (text.split(" ").length > limit ? "..." : "");
};


  return (

    
    <div
      ref={bannerRef}
      className={`w-container mx-auto h-[324px] bg-cover bg-center rounded-[24px] my-20 border-gray-200 border-2 transition-all ${loaded ? styles.fadeIn : styles.initial}`}
      style={{ backgroundImage: `url(${PopularBanner})` }}
    >
      <div className={`flex flex-col w-[90%] mx-auto items-center pt-10 transition-all ${loaded ? styles.textFadeIn : styles.textInitial}`}>
        <h5 className={`transition-all ${loaded ? styles.fadeInText : ''}`}>Most Popular Course</h5>
        <h2 className={`font-bold mt-1 mb-4 transition-all ${loaded ? styles.fadeInText : ''}`}>{course.title}</h2>
        <p className={`text-center transition-all ${loaded ? styles.fadeInText : ''}`}>{truncateDescription(course.description, 50)}</p>
        <button className="bg-primary w-[177px] text-white font-semibold mt-4 py-4 px-8 rounded-[24px] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50">
          Explore Course
        </button>
      </div>
    </div>
  );
};

export default Popular;
