import React, { useState, useEffect, useRef } from "react";
import styles from './Home.module.css';
import { API_URL } from '../../Api/api';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BlogImage from '../../Materials/Images/banner.png';

const Advertisment = () => {
  const [loaded, setLoaded] = useState(false);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/advertisement/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const adsArray = Array.isArray(data.results) ? data.results : [];
        setAds(adsArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching advertisement data:", error);
        setError("Failed to load advertisements. Please try again later.");
        setAds([]);
        setLoading(false);
      }
    };
    fetchAds();
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

  const CustomPrevArrow = ({ className, onClick, style }) => (
    <button
      className={`absolute left-[-32px] sm:left-[-40px] top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full opacity-75 hover:opacity-100 z-10 ${className}`}
      onClick={onClick}
      style={style}
      aria-label="Previous Slide"
    >
      ◀
    </button>
  );

  const CustomNextArrow = ({ className, onClick, style }) => (
    <button
      className={`absolute right-[-32px] sm:right-[-40px] top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full opacity-75 hover:opacity-100 z-10 ${className}`}
      onClick={onClick}
      style={style}
      aria-label="Next Slide"
    >
      ▶
    </button>
  );

  const settings = {
    dots: true,
    infinite: ads.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: ads.length > 1,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    prevArrow: ads.length > 1 ? <CustomPrevArrow /> : null,
    nextArrow: ads.length > 1 ? <CustomNextArrow /> : null
  };

  if (loading) return <div className="text-center py-10">Loading advertisements...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!ads.length) return <div className="text-center py-10">No advertisements available</div>;

  return (
    <div ref={bannerRef} className={`w-full max-w-7xl mx-auto max-h-64 sm:max-h-80 overflow-hidden my-16 sm:my-24 px-4 transition-all ${loaded ? styles.fadeIn : styles.initial}`}>
      <Slider {...settings}>
        {ads.map(ad => (
          <div key={ad.id} className="w-full h-64 sm:h-80 rounded-3xl transition-all flex items-center relative">
            <img 
              src={ad.image || BlogImage} 
              alt={ad.name} 
              className="absolute inset-0 w-full h-full object-cover rounded-3xl" 
            />
            <div className="absolute pt-8 sm:pt-12 pl-4 sm:pl-8 text-center sm:text-left">
              <h5 className="text-white text-sm sm:text-base">New Course</h5>
              <h1 className="mt-2 sm:mt-4 font-bold text-lg sm:text-2xl text-white">{ad.name}</h1>
              <p className="mt-2 text-sm sm:text-base text-white max-w-[90%] sm:max-w-[70%]">
                {ad.content.replace(/<[^>]*>/g, '').split(" ").slice(0, 15).join(" ") + 
                 (ad.content.split(" ").length > 15 ? "..." : "")}
              </p>
              {ad.url && (
                <a href={ad.url} target="_blank" rel="noopener noreferrer">
                  <button className="bg-primary w-36 sm:w-44 text-white font-semibold mt-4 py-3 px-4 rounded-3xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50 text-sm sm:text-base">
                    Learn More
                  </button>
                </a>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Advertisment;