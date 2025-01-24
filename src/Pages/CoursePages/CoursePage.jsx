import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../Api/api';
import { motion } from 'framer-motion';
import Overview from './Overview';
import Curriculum from './Curriculum';
import Reviews from './Reviews';
import courseBannerPlaceholder from '../../Materials/Images/course_banner.png';

const CoursePage = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_URL}/courses/${courseId}`);
        if (!response.ok) throw new Error('Failed to fetch course data');
        const data = await response.json();
        setCourseData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <p>Loading course data...</p>;
  if (error) return <p>Error: {error}</p>;

  const {
    Overview: {
      title = 'Untitled Course',
      description = 'No description available.',
      duration = 'Unknown duration',
      students_count = '0 Students',
      level = 'All Levels',
      course_image = courseBannerPlaceholder,
    } = {},
    Curriculum: curriculumData = [],
    Author: { username = 'Unknown Author' } = {},
  } = courseData || {};

  return (
    <div>
      <div className="bg-black text-white py-16 px-4 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold">{title}</h1>
            <p className="text-lg text-gray-300 mt-4">Author: {username}</p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4">
              <span>{duration}</span>
              <span>{students_count} Students</span>
              <span>{level}</span>
            </div>
          </div>
          <img
            src={`${API_URL}${course_image}`}
            alt="Course Preview"
            className="w-[410px] h-[250px] object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="flex space-x-8 border-b max-w-7xl mx-auto px-4 py-4">
        {['Overview', 'Curriculum', 'Reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 text-lg ${activeTab === tab ? 'border-b-2 border-orange-500' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4 }}
        className="py-8 max-w-7xl mx-auto px-4"
      >
        {activeTab === 'Overview' && <Overview description={description} />}
        {activeTab === 'Curriculum' && <Curriculum modules={curriculumData} courseId={courseId} />}
        {activeTab === 'Reviews' && <Reviews reviews={Reviews} />}
      </motion.div>
    </div>
  );
};

export default CoursePage;
