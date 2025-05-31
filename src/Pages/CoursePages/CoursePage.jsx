import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Overview from './Overview';
import Curriculum from './Curriculum';
import Reviews from './Reviews';
import courseBannerPlaceholder from '../../Materials/Images/course_banner.png';
import { API_URL } from '../../Api/api';
import { enrollInCourse, unenrollFromCourse, fetchMyCourses } from '../../Api/courses';

const CoursePage = ({ user }) => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [enrolled, setEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
     
        const courseResponse = await axios.get(`${API_URL}/courses/${courseId}`);
        setCourseData(courseResponse.data);

     
        const myCourses = await fetchMyCourses();
        const isEnrolled = myCourses.some(course => course.id === parseInt(courseId));
        setEnrolled(isEnrolled);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [courseId]);

  const handleEnrollToggle = async () => {
    setEnrollLoading(true);
    try {
      if (enrolled) {
        await unenrollFromCourse(courseId);
        setEnrolled(false);
      } else {
        await enrollInCourse(courseId);
        setEnrolled(true);
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('Ошибка при изменении статуса подписки');
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) return <p>Loading course data...</p>;
  if (error) return <p>Error: {error}</p>;

  const {
    Overview: {
      title = 'Untitled Course',
      description = 'No description available.',
      duration = 'Unknown duration',
      students = 0, 
      level = 'All Levels',
      course_image = courseBannerPlaceholder,
    } = {},
    Curriculum: curriculumData = [],
    Author: { username = 'Unknown Author' } = {},
    Reviews: { existing_reviews = [] } = {},
  } = courseData || {};

  return (
    <div>
      <div className="bg-black text-white py-16 px-4 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex-1">
            <h1 className="text-5xl font-bold">{title}</h1>
            <p className="text-lg text-gray-300 mt-4">Author: {username}</p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400 mt-4">
              <span>⏱ {duration}</span>
              <span>👥 {students} Students</span> 
              <span>🎯 {level}</span>
            </div>

            <button
              onClick={handleEnrollToggle}
              disabled={enrollLoading}
              className={`mt-6 px-6 py-2 rounded-md text-white font-semibold transition 
                ${enrolled ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-600 hover:bg-gray-700'}`}
            >
              {enrollLoading ? 'Loading...' : enrolled ? 'Unenroll' : 'Enroll'}
            </button>
          </div>

          <img
            src={
              course_image && course_image.startsWith('http')
                ? course_image
                : `${API_URL}${course_image || courseBannerPlaceholder}`
            }
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
        {activeTab === 'Reviews' && <Reviews reviews={existing_reviews} user={user} />}
      </motion.div>
    </div>
  );
};

export default CoursePage;
