import React, { useState, useEffect, useRef } from "react";
import Palette from "../../Materials/Icons/palette.png";
import Development from "../../Materials/Icons/web-development.png";
import Communication from "../../Materials/Icons/community.png";
import Videography from "../../Materials/Icons/video-editing.png";
import Videocam from "../../Materials/Icons/videography.png";
import Marketing from "../../Materials/Icons/goal.png";
import Content from "../../Materials/Icons/content-writing.png";
import Finance from "../../Materials/Icons/finance.png";
import Science from "../../Materials/Icons/Signalcellular alt.png";
import Cloud from "../../Materials/Icons/cloud.png";
import styles from "./Home.module.css";

const fakeCategories = [
  { id: 1, icon: Palette, title: "Art & Design", courses: 38 },
  { id: 2, icon: Development, title: "Development", courses: 38 },
  { id: 3, icon: Communication, title: "Communication", courses: 38 },
  { id: 4, icon: Videography, title: "Videography", courses: 38 },
  { id: 5, icon: Videocam, title: "Photography", courses: 38 },
  { id: 6, icon: Marketing, title: "Marketing", courses: 38 },
  { id: 7, icon: Content, title: "Content Writing", courses: 38 },
  { id: 8, icon: Finance, title: "Finance", courses: 38 },
  { id: 9, icon: Science, title: "Science", courses: 38 },
  { id: 10, icon: Cloud, title: "Network", courses: 38 },
  { id: 11, icon: Development, title: "Engineering", courses: 20 },
  { id: 12, icon: Communication, title: "Education", courses: 25 },
];

const Categories = () => {
  const [showAll, setShowAll] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const categoriesRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categoriesToShow = showAll
    ? fakeCategories
    : fakeCategories.slice(0, windowWidth < 768 ? 3 : 10);

  const handleScroll = () => {
    const categoriesPosition = categoriesRef.current.getBoundingClientRect().top;
    if (categoriesPosition <= window.innerHeight) {
      setLoaded(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 sm:mt-16 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-exo font-bold">Top Categories</h2>
          <p className="text-grey text-sm sm:text-base">Explore our Popular Categories</p>
        </div>
        <button
          className="w-36 sm:w-40 h-10 sm:h-12 bg-white text-black border-2 border-grey rounded-3xl hover:bg-gray-200 transition text-sm sm:text-base"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show Less" : "All Categories"}
        </button>
      </div>

      <div
        ref={categoriesRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 transition-all"
      >
        {categoriesToShow.map((category) => (
          <div
            key={category.id}
            className={`flex flex-col items-center justify-center w-full max-w-[200px] h-48 sm:h-56 p-4 border border-lightgrey rounded-3xl hover:shadow-lg hover:cursor-pointer transition mx-auto ${loaded ? styles.fadeIn : styles.initial}`}
          >
            <img
              src={category.icon}
              alt={category.title}
              className="w-8 h-8 mb-4"
            />
            <h3
              className={`text-base sm:text-lg font-bold text-darkgrey ${loaded ? styles.fadeInText : styles.initial}`}
            >
              {category.title}
            </h3>
            <p className={`text-grey text-sm ${loaded ? styles.fadeInText : styles.initial}`}>
              {category.courses} Courses
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
