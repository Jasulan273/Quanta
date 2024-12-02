import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Overview from './Overview';
import Curriculum from './Curriculum';
import Reviews from './Reviews';
import courseBanner from '../../Materials/Images/course_banner.png';

const CoursePage = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-black text-white py-16 px-4 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold w-[1000px]">The Ultimate Guide To The Best WordPress LMS Plugin</h1>
            <p className="text-lg text-gray-300 mt-4">Photography by DeterminedPoitras</p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4">
              <span>2 Weeks</span>
              <span>156 Students</span>
              <span>All Levels</span>
              <span>20 Lessons</span>
              <span>3 Quizzes</span>
            </div>
          </div>
          <img
            src={courseBanner}
            alt="Course Preview"
            className="w-[410px] h-[250px] object-contain  rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b max-w-7xl mx-auto px-4 py-4">
        {['Overview', 'Curriculum', 'Reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`py-2 text-lg ${activeTab === tab ? 'border-b-2 border-orange-500' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4 }}
        className="py-8 max-w-7xl mx-auto px-4"
      >
        {activeTab === 'Overview' && <Overview />}
        {activeTab === 'Curriculum' && <Curriculum />}
        {activeTab === 'Reviews' && <Reviews />}
      </motion.div>
    </div>
  );
};

export default CoursePage;
