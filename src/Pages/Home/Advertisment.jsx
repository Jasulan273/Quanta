import React, { useState, useEffect, useRef } from "react";
import styles from './Home.module.css';
import { API_URL } from '../../Api/api';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Advertisment = () => {
  const [loaded, setLoaded] = useState(false);
  const [ads, setAds] = useState([]);
  const bannerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/advertisement/`)
      .then(response => response.json())
      .then(data => setAds(data))
      .catch(error => console.error("Error fetching advertisement data:", error));
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

  const CustomPrevArrow = (props) => (
    <button {...props} className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-[80%] opacity-75 hover:opacity-100 z-10">
      ◀
    </button>
  );

  const CustomNextArrow = (props) => (
    <button {...props} className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-[80%] opacity-75 hover:opacity-100 z-10">
      ▶
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    prevArrow: <CustomPrevArrow />, 
    nextArrow: <CustomNextArrow />
  };

  return (
    <div ref={bannerRef} className={`w-container mx-auto max-h-[324px] overflow-hidden my-32 transition-all ${loaded ? styles.fadeIn : styles.initial}`}>
      <Slider {...settings}>
        {ads.map(ad => (
            <div key={ad.id} className="w-container mx-auto h-[324px] rounded-[24px] transition-all flex items-center relative">
              <img src={ad.image} alt={ad.name} className="absolute inset-0 w-full h-full object-cover rounded-[24px]" />
              <div className="absolute pt-16 pl-16">
              <h5>New Course</h5>
                <h1 className="mt-4 font-bold">{ad.name}</h1>
                <p className="mt-2 w-[70%]">{ad.content.replace(/<[^>]*>/g, '').split(" ").slice(0, 15).join(" ") + (ad.content.split(" ").length > 15 ? "..." : "")}</p>
                {ad.url && (
                  <a href={ad.url} target="_blank" rel="noopener noreferrer">
                    <button className="bg-primary w-[177px] text-white font-semibold mt-4 py-3 px-4 rounded-[24px] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lightgrey focus:ring-opacity-50">
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
