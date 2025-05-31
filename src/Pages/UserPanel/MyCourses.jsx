import React, { useEffect, useState } from 'react';
import { fetchMyCourses } from '../../Api/courses';
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
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <ul className="space-y-6">
          {courses.map(course => (
            <li
              key={course.id}
              className="flex items-start bg-white shadow-md rounded-2xl p-6"
            >
              {course.course_image && (
                <img
                  src={process.env.REACT_APP_API_URL + course.course_image}
                  alt={course.title}
                  className="w-64 h-48 object-cover rounded-xl mr-6"
                />
              )}
              <div className="flex-1">
                <Link
                  to={`/courses/${course.id}`}
                  className="text-2xl font-semibold text-blue-700 hover:underline mb-3 block"
                >
                  {course.title}
                </Link>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Category:</span> {course.category}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Author:</span> {course.author}
                </p>
                <p className="text-gray-600 mb-3">{course.description}</p>
                <p className="text-sm text-gray-500">
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
