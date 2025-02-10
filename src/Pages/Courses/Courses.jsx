import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchCourses } from '../../Api/api';
import courseImagePlaceholder from '../../Materials/Images/course_banner.png';
import Time from '../../Materials/Icons/Watchlater.png';
import Students from '../../Materials/Icons/Student.png';
import Level from '../../Materials/Icons/Signalcellular alt.png';
import Lessons from '../../Materials/Icons/Filecopy.png';


export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex w-container mx-auto">
      <div className="w-[75%] bg-white p-4">
        <h1 className="font-bold text-2xl mb-4">Courses</h1>
        <div>
          {courses.map((course) => {
        
            const shortDescription = course.description
              ? course.description.split(' ').slice(0, 20).join(' ') + (course.description.split(' ').length > 20 ? '...' : '')
              : 'No description available.';

            return (
              <div className="border flex w-full h-[250px] rounded-[20px] mb-16" key={course.id}>
                <div className="w-[410px] h-[250px] bg-gray-300 rounded-l-[20px]">
                  <img 
                    src={'https://quant.up.railway.app' + course.course_image || courseImagePlaceholder} 
                    alt={course.title || 'Course Image'} 
                    className="w-full h-full object-fit bg-center rounded-l-[18px]"
                  />
                </div>

                <div className="flex flex-col justify-between w-[580px] p-4">
                  <div>
                    <p className="text-sm text-gray-500">by {course.author_username || 'Unknown Author'}</p>
                    <h2 className="text-xl font-bold mt-2">{course.title || 'Untitled Course'}</h2>
                    <p className='text-p2 max-h-15 overflow-hidden'>{shortDescription}</p>
                  </div>

                  <div className="flex items-center justify-between border-t mt-2 border-gray-300 pt-2">
                    <div className="flex flex-row items-center text-sm  text-gray-600">
                      <img src={Time} className='mr-1' alt="Time Icon" /> 
                      <p className='text-p2'>{course.duration || 'Unknown duration'} hours</p>
                    </div>
                    <div className="flex flex-row items-center text-sm  text-gray-600">
                      <img src={Students} className='mr-1' alt="Students Icon" />
                      <p className='text-p2'>{course.students_count || 0} students</p>
                    </div>
                    <div className="flex flex-row items-center text-sm  text-gray-600">
                      <img src={Level} className='mr-1' alt="Level Icon" />
                      <p className='text-p2'>{course.level || 'N/A'}</p>
                    </div>
                    <div className="flex flex-row items-center text-sm  text-gray-600">
                      <img src={Lessons} className='mr-1' alt="Lessons Icon" />
                      <p className='text-p2'>20 lessons</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 pt-2 flex justify-end">
  {course.id ? (
    <NavLink to={`/courses/${course.id}`} className="text-orange-500 hover:underline">
      <button className="text-black font-semibold hover:underline">View More</button>
    </NavLink>
  ) : (
    <span className="text-gray-500">Details not available</span>
  )}
</div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-[25%] p-6 rounded-lg">
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
              className="border p-2 rounded w-[115px]"
            />
            <span>-</span>
            <input 
              type="date" 
              className="border p-2 rounded w-[115px]"
            />
          </div>

          <button 
            className="mt-4 w-full bg-primary text-white p-2 rounded-lg hover:translate-y-[-2px] transition"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
