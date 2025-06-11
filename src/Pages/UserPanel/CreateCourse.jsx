import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../Api/api';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    durationValue: '',
    durationUnit: '',
    language: '',
    level: ''
  });
  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const programmingLanguages = ['R', 'Ruby', 'PHP', 'Golang', 'Java', 'Javascript', 'C++', 'Python'];
  const durationValues = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  const courseDurationUnits = ['day', 'week'];
  const courseLevels = ['beginner', 'intermediate', 'expert', 'all'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseData.title.trim() || !courseData.description.trim() || !courseData.durationValue || !courseData.durationUnit || !courseData.language || !courseData.level) {
      setError('All fields are required');
      return;
    }
    try {
      setIsSubmitting(true);
      const duration = `${courseData.durationValue} ${courseData.durationUnit}${parseInt(courseData.durationValue) > 1 ? 's' : ''}`;
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('duration', duration);
      formData.append('language', courseData.language);
      formData.append('level', courseData.level);
      console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
      if (courseImage) {
        formData.append('course_image', courseImage);
      }
      const response = await fetch(`${API_URL}/author/courses/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create course');
      }
      navigate('/courses');
    } catch (err) {
      setError(`Failed to create course: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[90%] mx-auto p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Create Course</h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
          <input
            type="text"
            id="title"
            value={courseData.title}
            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            id="description"
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            rows="5"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="durationValue" className="block text-sm font-medium text-gray-700 mb-2">Duration Value</label>
            <select
              id="durationValue"
              value={courseData.durationValue}
              onChange={(e) => setCourseData({ ...courseData, durationValue: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>Select duration value</option>
              {durationValues.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="durationUnit" className="block text-sm font-medium text-gray-700 mb-2">
              Duration Unit</label>
            <select id="durationUnit"
              value={courseData.durationUnit}
              onChange={(e) => setCourseData({ ...courseData, durationUnit: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>Select duration unit</option>
              {courseDurationUnits.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">Programming Language</label>
          <select
            id="language"
            value={courseData.language}
            onChange={(e) => setCourseData({ ...courseData, language: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>Select a programming language</option>
            {programmingLanguages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">Course Level</label>
          <select
            id="level"
            value={courseData.level}
            onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>Select course level</option>
            {courseLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="courseImage" className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
          <input
            type="file"
            id="courseImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-4 border border-gray-300 rounded-lg text-lg"
            disabled={isSubmitting}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Course Preview" className="mt-4 max-w-xs rounded-lg shadow-md" />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
          disabled={isSubmitting}
        >Create Course</button>
      </form>
      <button
        onClick={() => navigate('/courses')}
        className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md mt-8"
        disabled={isSubmitting}
      >Back to Courses</button>
    </div>
  );
};

export default CreateCourse;