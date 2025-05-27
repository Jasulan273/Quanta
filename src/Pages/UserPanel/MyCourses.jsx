import React, { useEffect, useState } from 'react';
import { fetchMyCourses } from '../../Api/api';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMyCourses();
        setCourses(data);
      } catch (err) {
        setCourses([]);
      }
    };
    fetchData();
  }, []);
  

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map(course => (
            <li key={course.id} className="flex items-center bg-white shadow rounded-lg p-4">
              {course.course_image && (
                <img
                  src={process.env.REACT_APP_API_URL + course.course_image}
                  alt={course.title}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                />
              )}
              <div>
                <Link
                  to={`/courses/${course.id}`}
                  className="text-xl font-bold text-blue-600 hover:underline"
                >
                  {course.title}
                </Link>
                <p className="text-gray-600">{course.category} | By: {course.author}</p>
                <p className="text-gray-600">{course.description}</p>
                <p className="text-sm text-gray-400">
                  Duration: {course.duration} | Level: {course.level} | Students: {course.students}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCourses;
