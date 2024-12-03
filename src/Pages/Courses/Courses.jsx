import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import courseBanner from '../../Materials/Images/course_banner.png';
import Time from '../../Materials/Icons/Watchlater.png';
import Students from '../../Materials/Icons/Student.png';
import Level from '../../Materials/Icons/Signalcellular alt.png';
import Lessons from '../../Materials/Icons/Filecopy.png';

export default function Courses() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDateFilter = () => {
    console.log("Filtering courses from:", startDate, "to:", endDate);
  };

  return (
    <div className="flex w-container mx-auto">
      <div className="w-[990px] bg-white p-4">
        <h1 className="font-bold text-2xl mb-4">Courses</h1>
        <div className="">
          {[1, 2, 3, 4].map((_, index) => (
            <div className="border flex w-full h-[250px] rounded-[20px] mb-16" key={index}>
              <div className="w-[410px] h-[250px] bg-gray-300 rounded-l-[20px]">
                <img 
                  src={courseBanner}
                  alt="Course Thumbnail" 
                  className="w-full h-full object-fit rounded-[18px]"
                />
              </div>
              
              <div className="flex flex-col justify-between w-[580px] p-4">
                <div>
                  <p className="text-sm text-gray-500">by Author Name</p>
                  <h2 className="text-xl font-bold mt-2">Course Title</h2>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam repellendus non doloribus animi quidem cupiditate alias porro, saepe enim delectus!</p>
                </div>

                <div className="flex items-center border-t border-gray-300 pt-2">
                  <div className="flex flex-row items-center text-sm mr-6 text-gray-600">
                    <img src={Time} className='mr-1' alt="Time Icon" /> <p>10 hours</p>
                  </div>
                  <div className="flex flex-row items-center text-sm mr-6 text-gray-600">
                    <img src={Students} className='mr-1' alt="Students Icon" /><p>300 students</p>
                  </div>
                  <div className="flex flex-row items-center text-sm mr-6 text-gray-600">
                    <img src={Level} className='mr-1' alt="Level Icon" /> <p>Beginner</p>
                  </div>
                  <div className="flex flex-row items-center text-sm mr-6 text-gray-600">
                    <img src={Lessons} className='mr-1' alt="Lessons Icon" /><p>20 lessons</p>
                  </div>
                </div>

                <div className="border-t border-gray-300 mt-2 pt-2 flex justify-end">
                <NavLink to="/CoursePages" className="text-orange-500 hover:underline">
                <button className="text-black font-semibold hover:underline">View More</button>
          </NavLink>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[300px] p-6 rounded-lg">
        <h2 className="font-bold text-xl mt-4 mb-6">Filter Courses</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Programming Languages</h3>
          <ul className="space-y-2">
            <li className='flex justify-between items-center'><div><input type="checkbox" id="python" /> <label htmlFor="python">Python</label></div><p>15</p></li>
            <li className='flex justify-between items-center'><div><input type="checkbox" id="JavaScript" /> <label htmlFor="JavaScript">JavaScript</label></div><p>15</p></li>
            <li className='flex justify-between items-center'><div><input type="checkbox" id="Java" /> <label htmlFor="Java">Java</label></div><p>15</p></li>
            <li className='flex justify-between items-center'><div><input type="checkbox" id="C#" /> <label htmlFor="C#">C#</label></div><p>15</p></li>
            <li className='flex justify-between items-center'><div><input type="checkbox" id="Golang" /> <label htmlFor="Golang">Golang</label></div><p>15</p></li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mt-16 mb-2">Difficulty Level</h3>
          <ul className="space-y-2">
            <li><input type="checkbox" id="beginner" /> <label htmlFor="beginner">Beginner</label></li>
            <li><input type="checkbox" id="intermediate" /> <label htmlFor="intermediate">Intermediate</label></li>
            <li><input type="checkbox" id="advanced" /> <label htmlFor="advanced">Advanced</label></li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mt-16 mb-2">Reviews</h3>
          <ul className="space-y-2">
            <li><input type="radio" name="reviews" id="4stars" /> <label htmlFor="4stars">4⭐ & above</label></li>
            <li><input type="radio" name="reviews" id="3stars" /> <label htmlFor="3stars">3⭐ & above</label></li>
            <li><input type="radio" name="reviews" id="2stars" /> <label htmlFor="2stars">2⭐ & above</label></li>
            <li><input type="radio" name="reviews" id="1stars" /> <label htmlFor="1stars">1⭐ & above</label></li>
            <li><input type="radio" name="reviews" id="all" /> <label htmlFor="all">All reviews</label></li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mt-16 mb-2">Date Range</h3>
          <div className="flex items-center space-x-2">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded w-[115px]"
            />
            <span>-</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded w-[115px]"
            />
          </div>

          <button 
            onClick={handleDateFilter}
            className="mt-4 w-full bg-primary text-white p-2 rounded-lg hover:translate-y-[-2px] transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
