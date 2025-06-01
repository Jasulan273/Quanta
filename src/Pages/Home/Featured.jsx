import { useState, useEffect, useRef } from "react";
import durationIcon from "../../Materials/Icons/Watchlater.png";
import studentIcon from "../../Materials/Icons/Student.png";
import levelIcon from "../../Materials/Icons/Signalcellular alt.png";
import styles from "./Home.module.css";
import { fetchCourses } from '../../Api/courses';
import { NavLink } from "react-router-dom";

const Featured = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        const latestCourses = data.slice(-6).reverse();
        setCourses(latestCourses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) return <p className="text-center">Loading courses...</p>;
  if (error) return <p className="text-center">{error}</p>;

  return (
    <div className="w-full max-w-7xl mx-auto h-auto mt-12 sm:mt-16 px-4">
      <div className="flex justify-between items-center mb-8 sm:mb-12">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-exo font-bold">Featured Courses</h2>
          <p className="text-grey text-sm sm:text-base">Explore our Popular Courses</p>
        </div>
      </div>

      <div
        ref={sectionRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-all"
      >
        {courses.map((course) => {
          const shortDescription = course.description
            ? course.description.split(' ').slice(0, 20).join(' ') + (course.description.split(' ').length > 20 ? '...' : '')
            : 'No description available.';

          return (
            <div
              key={course.id}
              className={`max-w-sm h-full bg-white rounded-3xl shadow-md overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 ${styles.fadeIn}`}
            >
              <div className="h-52 sm:h-60 bg-gray-300 overflow-hidden">
                <img 
                  src={course.course_image ? course.course_image : '/course_placeholder.jpg'}
                  alt={course.title || 'Course Image'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 sm:p-5 flex flex-col h-full">
                <div className="text-left">
                  <h5 className="text-xs sm:text-sm text-gray-600">by {course.author || 'Unknown Author'}</h5>
                  <h4 className="mt-2 text-base sm:text-lg font-bold text-gray-800">{course.title || 'Untitled Course'}</h4>
                  <p className="mt-2 text-sm text-gray-600">{shortDescription}</p>
                  <p className="text-sm text-gray-600 mt-1">Rating: {course.average_mark || 'N/A'}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center">
                    <img src={durationIcon} className="mr-1 w-4" alt="Duration Icon" />
                    <span>{course.duration || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <img src={studentIcon} className="mr-1 w-4" alt="Student Icon" />
                    <span>{course.students || 0} students</span>
                  </div>
                  <div className="flex items-center">
                    <img src={levelIcon} className="mr-1 w-4" alt="Level Icon" />
                    <span>{course.level || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <NavLink 
                    to={`/courses/${course.id}`} 
                    className="text-black font-semibold hover:underline text-sm sm:text-base"
                  >
                    View More
                  </NavLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Featured;