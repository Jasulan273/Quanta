import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchCourses } from '../../Api/courses';
import courseImagePlaceholder from '../../Materials/Images/course_banner.png';
import Time from '../../Materials/Icons/Watchlater.png';
import Students from '../../Materials/Icons/Student.png';
import Level from '../../Materials/Icons/Signalcellular alt.png';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const coursesPerPage = 3;

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
        setFilteredCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    let result = [...courses];

    if (searchQuery) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLanguages.length > 0) {
      result = result.filter(course => selectedLanguages.includes(course.language));
    }

    if (selectedLevels.length > 0) {
      result = result.filter(course => selectedLevels.includes(course.level));
    }

    if (selectedRating !== null) {
      result = result.filter(course => course.average_mark >= selectedRating);
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => (b.average_mark || 0) - (a.average_mark || 0));
    } else if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredCourses(result);
    setCurrentPage(1);
  }, [searchQuery, selectedLanguages, selectedLevels, selectedRating, sortBy, courses]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleLevelChange = (level) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating === 'all' ? null : parseFloat(rating));
  };

  const handleSortChange = (type) => {
    setSortBy(type);
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-[1290px] mx-auto relative">
      <div className="w-full lg:w-[75%] bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-2xl">Courses</h1>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 rounded w-[200px] lg:w-[300px]"
            />
            <button className="lg:hidden bg-primary text-white p-2 rounded" onClick={() => setShowSidebar(true)}>
              Filters
            </button>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleSortChange('rating')}
            className={`p-2 rounded ${sortBy === 'rating' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Sort by Rating
          </button>
          <button
            onClick={() => handleSortChange('date')}
            className={`p-2 rounded ${sortBy === 'date' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Sort by Date
          </button>
        </div>
        <div>
          {currentCourses.map((course) => {
            const shortDescription = course.description
              ? course.description.split(' ').slice(0, 20).join(' ') + (course.description.split(' ').length > 20 ? '...' : '')
              : 'No description available.';
            return (
              <div className="border flex flex-col lg:flex-row w-full rounded-[20px] mb-10" key={course.id}>
                <div className="w-full lg:w-[410px] h-[200px] lg:h-[250px] bg-gray-300 rounded-t-[20px] lg:rounded-l-[20px] lg:rounded-tr-none overflow-hidden">
                  <img
                    src={course.course_image ?  course.course_image : courseImagePlaceholder}
                    alt={course.title || 'Course Image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between w-full lg:w-[580px] p-4">
                  <div>
                    <p className="text-sm text-gray-500">by {course.author || 'Unknown Author'}</p>
                    <h2 className="text-xl font-bold mt-2">{course.title || 'Untitled Course'}</h2>
                    <p className="text-p2 max-h-15 overflow-hidden">{shortDescription}</p>
                    <p className="text-sm text-gray-600">Rating: {course.average_mark || 'N/A'}</p>
                  </div>
                  <div className="flex items-center justify-between border-t mt-2 border-gray-300 pt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <img src={Time} className="mr-1" alt="Time Icon" />
                      <p>{course.duration || 'Unknown duration'}</p>
                    </div>
                    <div className="flex items-center">
                      <img src={Students} className="mr-1" alt="Students Icon" />
                      <p>{course.students ?? 0} students</p>
                    </div>
                    <div className="flex items-center">
                      <img src={Level} className="mr-1" alt="Level Icon" />
                      <p>{course.level || 'N/A'}</p>
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
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`p-2 rounded ${currentPage === page ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      <div className={`fixed top-0 right-0 bg-white shadow-lg w-[90%] max-w-[300px] h-full p-6 transition-transform duration-300 ease-in-out transform ${showSidebar ? 'translate-x-0' : 'translate-x-full'} lg:static lg:translate-x-0 lg:w-[25%] lg:block`}>
        <div className="flex justify-between items-center lg:hidden mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={() => setShowSidebar(false)} className="text-2xl">&times;</button>
        </div>

        <h2 className="font-bold text-xl mt-4 mb-6 hidden lg:block">Filter Courses</h2>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Programming Languages</h3>
          <ul className="space-y-2">
            {['Python', 'Javascript', 'Java', 'C#', 'Golang'].map(lang => (
              <li key={lang} className="flex justify-between items-center">
                <div>
                  <input
                    type="checkbox"
                    id={lang}
                    checked={selectedLanguages.includes(lang)}
                    onChange={() => handleLanguageChange(lang)}
                  />
                  <label htmlFor={lang} className="ml-2">{lang}</label>
                </div>
                <p>{courses.filter(course => course.language === lang).length}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Difficulty Level</h3>
          <ul className="space-y-2">
            {['beginner', 'intermediate', 'advanced', 'all'].map(level => (
              <li key={level}>
                <input
                  type="checkbox"
                  id={level}
                  checked={selectedLevels.includes(level)}
                  onChange={() => handleLevelChange(level)}
                />
                <label htmlFor={level} className="ml-2">{level.charAt(0).toUpperCase() + level.slice(1)}</label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Reviews</h3>
          <ul className="space-y-2">
            {['4', '3', '2', '1', 'all'].map(rating => (
              <li key={rating}>
                <input
                  type="radio"
                  name="reviews"
                  id={`${rating}stars`}
                  checked={selectedRating === (rating === 'all' ? null : parseFloat(rating))}
                  onChange={() => handleRatingChange(rating)}
                />
                <label htmlFor={`${rating}stars`} className="ml-2">
                  {rating === 'all' ? 'All reviews' : `${rating}⭐ & above`}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
