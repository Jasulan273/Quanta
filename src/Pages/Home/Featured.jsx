import React, { useState, useEffect, useRef } from "react";
import courseBanner from "../../Materials/Images/course_banner.png";
import duration from "../../Materials/Icons/Watchlater.png";
import student from "../../Materials/Icons/Student.png";
import styles from "./Home.module.css";

const cardData = [
  {
    id: 1,
    image: courseBanner,
    author: "Determined-Poitras",
    title: "Create an LMS Website with LearnPress",
    duration: "2 Weeks",
    students: "156 Students",
  },
  {
    id: 2,
    image: courseBanner,
    author: "Creative-Thinker",
    title: "Master Web Development with React",
    duration: "3 Weeks",
    students: "200 Students",
  },
  {
    id: 3,
    image: courseBanner,
    author: "Innovative-Writer",
    title: "Build a Blogging Platform in Django",
    duration: "4 Weeks",
    students: "120 Students",
  },
  {
    id: 4,
    image: courseBanner,
    author: "Innovative-Writer",
    title: "Build a Blogging Platform in Django",
    duration: "4 Weeks",
    students: "120 Students",
  },
  {
    id: 5,
    image: courseBanner,
    author: "Innovative-Writer",
    title: "Build a Blogging Platform in Django",
    duration: "4 Weeks",
    students: "120 Students",
  },
  {
    id: 6,
    image: courseBanner,
    author: "Innovative-Writer",
    title: "Build a Blogging Platform in Django",
    duration: "4 Weeks",
    students: "120 Students",
  }
];

const Featured = () => {
  const [showAll, setShowAll] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);
  const coursesToShow = showAll ? cardData : cardData.slice(0, 6);

  const handleScroll = () => {
    const sectionPosition = sectionRef.current.getBoundingClientRect().top;
    if (sectionPosition <= window.innerHeight) {
      setLoaded(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-container mx-auto h-[80vw] mt-40">
      <div className="flex justify-between mb-16">
        <div>
          <h2 className="text-2xl font-exo font-bold">Featured courses</h2>
          <p className="text-grey">Explore our Popular Courses</p>
        </div>
        <button
          className="w-[161px] h-[48px] bg-white text-black border-2 border-grey rounded-[24px] hover:bg-gray-200 transition"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show Less" : "All Courses"}
        </button>
      </div>

      <div
        ref={sectionRef}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all ${
          showAll ? "max-h-full" : "max-h-[600px]"
        }`}
      >
        {coursesToShow.map((course) => (
          <div
            key={course.id}
            className={`max-w-sm h-full bg-white rounded-[24px] shadow-md overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 ${
              loaded ? styles.fadeIn : styles.initial
            }`}
          >
            <div
              className="h-[250px] bg-cover bg-center"
              style={{ backgroundImage: `url(${course.image})` }}
            ></div>

            <div className="p-5 flex flex-col h-full">
              <div className="text-left">
                <h5 className="text-sm font-medium text-gray-600">{course.author}</h5>
                <h4 className="mt-2 text-xl font-bold text-gray-800">{course.title}</h4>
              </div>

              <div className="mt-4 text-left">
                <p className="flex flex-row items-center text-[16px] text-gray-600">
                  <img src={duration} className="mr-1 w-[18px]" alt="Duration Icon" />
                  {course.duration} | <img src={student} className="mx-1 w-[18px]" alt="Student Icon" />{course.students}
                </p>
              </div>

              <h2 className="mt-4 text-sm text-primary font-bold text-right cursor-pointer hover:underline transition">
                View More
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
