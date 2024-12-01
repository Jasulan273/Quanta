import React, { useState } from "react";
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
  const categoriesToShow = showAll
    ? fakeCategories
    : fakeCategories.slice(0, 10);

  return (
   
      <div className="w-container mx-auto mt-16">
        <div className="flex justify-between mb-16">
          <div>
            <h2 className="text-2xl font-exo font-bold">Top Categories</h2>
            <p className="text-grey">Explore our Popular Categories</p>
          </div>
          <button
            className="w-[161px] h-[48px] bg-white text-black border-2 border-grey rounded-[24px] hover:bg-gray-200 transition"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "All Categories"}
          </button>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 transition-all ${
            showAll ? "max-h-full" : "max-h-[600px]"
          }`}
        >
          {categoriesToShow.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center justify-center w-[234px] h-[234px] p-4 border border-lightgrey rounded-[24px] hover:shadow-lg hover:cursor-pointer transition"
            >
              <img
                src={category.icon}
                alt={category.title}
                className="w-[32px] h-[32px] mb-4"
              />
              <h3 className="mt-2 text-lg font-bold text-darkgrey">
                {category.title}
              </h3>
              <p className="text-grey">{category.courses} Courses</p>
            </div>
          ))}
        </div>
      </div>
  
  );
};

export default Categories;
