import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../Api/api';

const CreateCourse = () => {
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    duration: '',
  });
  const [courseId, setCourseId] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState({ module: '', duration: '' });
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState({
    name: '',
    short_description: '',
    video_url: '',
    uploaded_video: null,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: courseData.title,
        description: courseData.description,
        duration: courseData.duration,
      };
      const response = await fetch(`${API_URL}/author/courses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create course');
      }
      const data = await response.json();
      setCourseId(data.id);
      setStep(2);
      setError(null);
    } catch (err) {
      setError(`Failed to create course: ${err.message}`);
    }
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/author/courses/${courseId}/modules/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(currentModule),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create module');
      }
      const data = await response.json();
      setModules([...modules, { ...currentModule, module_id: data.module_id }]);
      setCurrentModule({ module: '', duration: '' });
      setError(null);
    } catch (err) {
      setError(`Failed to create module: ${err.message}`);
    }
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', currentLesson.name);
      formData.append('short_description', currentLesson.short_description);
      if (currentLesson.video_url) formData.append('video_url', currentLesson.video_url);
      if (currentLesson.uploaded_video) formData.append('uploaded_video', currentLesson.uploaded_video);

      const response = await fetch(
        `${API_URL}/author/courses/${courseId}/modules/${currentModuleId}/lessons/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create lesson');
      }
      const data = await response.json();
      setLessons([...lessons, { ...currentLesson, lesson_id: data.lesson_id }]);
      setCurrentLesson({ name: '', short_description: '', video_url: '', uploaded_video: null });
      setError(null);
    } catch (err) {
      setError(`Failed to create lesson: ${err.message}`);
    }
  };

  const handleAddAnotherModule = () => {
    setCurrentModule({ module: '', duration: '' });
    setLessons([]);
    setCurrentModuleId(null);
    setStep(2);
  };

  const handleAddLessonToModule = (moduleId) => {
    setCurrentModuleId(moduleId);
    setLessons([]);
    setStep(3);
  };

  const handleFinish = () => {
    navigate('/courses');
  };

  return (
  <div className="max-w-[90%] mx-auto p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
  <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
    {step === 1 ? 'Create a New Course' : step === 2 ? 'Add Course Modules' : 'Add Lessons'}
  </h2>
  {error && (
    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
      {error}
    </div>
  )}

  {step === 1 && (
    <form onSubmit={handleCourseSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Course Title
        </label>
        <input
          type="text"
          id="title"
          value={courseData.title}
          onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={courseData.description}
          onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
          rows="5"
          required
        />
      </div>
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Duration (e.g., 4 weeks)
        </label>
        <input
          type="text"
          id="duration"
          value={courseData.duration}
          onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
      >
        Create Course
      </button>
    </form>
  )}

  {step === 2 && (
    <div className="space-y-8">
      <form onSubmit={handleModuleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-2">
            Module Name
          </label>
          <input
            type="text"
            id="module"
            value={currentModule.module}
            onChange={(e) => setCurrentModule({ ...currentModule, module: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="moduleDuration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            id="moduleDuration"
            value={currentModule.duration}
            onChange={(e) => setCurrentModule({ ...currentModule, duration: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
        >
          Add Module
        </button>
      </form>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Added Modules</h3>
        {modules.length === 0 ? (
          <p className="text-gray-500">No modules added yet.</p>
        ) : (
          <ul className="space-y-4">
            {modules.map((module) => (
              <li
                key={module.module_id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
              >
                <span className="text-lg font-medium text-gray-800">
                  {module.module} ({module.duration})
                </span>
                <button
                  onClick={() => handleAddLessonToModule(module.module_id)}
                  className="text-blue-600 font-semibold hover:text-blue-800 transition-all"
                >
                  Add Lessons
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={handleFinish}
        className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md"
      >
        Finish
      </button>
    </div>
  )}

  {step === 3 && (
    <div className="space-y-8">
      <form onSubmit={handleLessonSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="lessonName" className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Name
          </label>
          <input
            type="text"
            id="lessonName"
            value={currentLesson.name}
            onChange={(e) => setCurrentLesson({ ...currentLesson, name: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            id="shortDescription"
            value={currentLesson.short_description}
            onChange={(e) => setCurrentLesson({ ...currentLesson, short_description: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            rows="4"
            required
          />
        </div>
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Video URL (optional)
          </label>
          <input
            type="text"
            id="videoUrl"
            value={currentLesson.video_url}
            onChange={(e) => setCurrentLesson({ ...currentLesson, video_url: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
          />
        </div>
        <div>
          <label htmlFor="uploadedVideo" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Video (optional)
          </label>
          <input
            type="file"
            id="uploadedVideo"
            onChange={(e) => setCurrentLesson({ ...currentLesson, uploaded_video: e.target.files[0] })}
            className="w-full p-4 border border-gray-300 rounded-lg file:bg-blue-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
        >
          Add Lesson
        </button>
      </form>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Added Lessons</h3>
        {lessons.length === 0 ? (
          <p className="text-gray-500">No lessons added yet.</p>
        ) : (
          <ul className="space-y-4">
            {lessons.map((lesson) => (
              <li
                key={lesson.lesson_id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
              >
                <span className="text-lg font-medium text-gray-800">
                  {lesson.name} - {lesson.short_description}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleAddAnotherModule}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
        >
          Add Another Module
        </button>
        <button
          onClick={handleFinish}
          className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md"
        >
          Finish
        </button>
      </div>
    </div>
  )}
</div>
  );
};

export default CreateCourse;