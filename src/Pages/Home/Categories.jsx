import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import Development from "../../Materials/Icons/web-development.png";
import styles from "./Home.module.css";

const topLanguages = [
  { id: 1, icon: Development, title: "Python" },
  { id: 2, icon: Development, title: "Javascript" },
  { id: 3, icon: Development, title: "Java" },
  { id: 4, icon: Development, title: "C#" },
  { id: 5, icon: Development, title: "Golang" },
  { id: 6, icon: Development, title: "Ruby" },
  { id: 7, icon: Development, title: "PHP" },
  { id: 8, icon: Development, title: "C++" },
  { id: 9, icon: Development, title: "Swift" },
  { id: 10, icon: Development, title: "Kotlin" },
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

  const languagesToShow = showAll
    ? topLanguages
    : topLanguages.slice(0, windowWidth < 768 ? 3 : 10);

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
          <h2 className="text-xl sm:text-2xl font-exo font-bold">Top Programming Languages</h2>
          <p className="text-grey text-sm sm:text-base">Explore our Top 10 Programming Languages</p>
        </div>
        <button
          className="w-36 sm:w-40 h-10 sm:h-12 bg-white text-black border-2 border-grey rounded-3xl hover:bg-gray-200 transition text-sm sm:text-base"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show Less" : "All Languages"}
        </button>
      </div>

      <div
        ref={categoriesRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 transition-all"
      >
        {languagesToShow.map((language) => (
          <NavLink
            to={`/courses?language=${language.title}`}
            key={language.id}
            className="no-underline"
          >
            <div
              className={`flex flex-col items-center justify-center w-full max-w-[200px] h-48 sm:h-56 p-4 border border-lightgrey rounded-3xl hover:shadow-lg hover:cursor-pointer transition mx-auto ${
                loaded ? styles.fadeIn : styles.initial
              }`}
            >
              <img
                src={language.icon}
                alt={language.title}
                className="w-8 h-8 mb-4"
              />
              <h3
                className={`text-base sm:text-lg font-bold text-darkgrey ${
                  loaded ? styles.fadeInText : styles.initial
                }`}
              >
                {language.title}
              </h3>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Categories;