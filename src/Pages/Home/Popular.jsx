import React, { useState, useEffect, useRef } from "react";
import styles from './Home.module.css';
import { NavLink } from "react-router-dom";
import { API_URL } from '../../Api/api';
import PopularBanner from '../../Materials/Images/PopularBannerFull.jpeg';

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
      className={`w-full max-w-7xl mx-auto h-64 sm:h-80 bg-cover bg-center rounded-3xl my-12 sm:my-16 border-gray-200 border-2 transition-all ${loaded ? styles.fadeIn : styles.initial}`}
      style={{ backgroundImage: `url(${PopularBanner})` }}
    >
      <div className={`flex flex-col items-center justify-center w-full max-w-3xl mx-auto pt-8 sm:pt-12 px-4 text-center transition-all ${loaded ? styles.textFadeIn : styles.textInitial}`}>
        <h5 className={`text-sm sm:text-base transition-all ${loaded ? styles.fadeInText : ''}`}>Most Popular Course</h5>
        <h2 className={`font-bold text-lg sm:text-2xl mt-1 mb-4 transition-all ${loaded ? styles.fadeInText : ''}`}>{course.title}</h2>
        <p className={`text-sm sm:text-base text-center transition-all ${loaded ? styles.fadeInText : ''}`}>{truncateDescription(course.description, 50)}</p>
        <NavLink
          to={`/courses/${course.id}`}
          className="bg-primary w-40 sm:w-44 text-white font-semibold text-sm sm:text-base mt-4 py-3 px-6 rounded-3xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50 border border-transparent"
        >
          View More
        </NavLink>
      </div>
    </div>
  );
};

export default Popular;