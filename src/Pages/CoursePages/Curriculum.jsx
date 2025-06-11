import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../Api/api';

const Curriculum = ({ modules, courseId, enrolled, user }) => {
  const [openModules, setOpenModules] = useState([]);
  const [courseProgress, setCourseProgress] = useState(0);
  const [hasFinalExam, setHasFinalExam] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const [certificateError, setCertificateError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!enrolled && modules.length > 0) {
      setOpenModules([modules[0].module_id]);
    }

    const fetchCourseProgress = async () => {
      if (user && enrolled) {
        try {
          const response = await fetch(`${API_URL}/courses/${courseId}/progress/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setCourseProgress(data.progress_percent || 0);
          }
        } catch {}
      }
    };

    const checkFinalExam = async () => {
      try {
        const response = await fetch(`${API_URL}/courses/${courseId}/final-exam/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if (response.ok) {
          setHasFinalExam(true);
        }
      } catch {
        setHasFinalExam(false);
      }
    };

    fetchCourseProgress();
    checkFinalExam();
  }, [enrolled, modules, courseId, user]);

  const toggleModule = (moduleId) => {
    if (!user) {
      navigate('/Auth');
      return;
    }

    if (!enrolled && !openModules.includes(moduleId)) return;

    setOpenModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleGenerateCertificate = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/certificates/generate/${courseId}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        setCertificateGenerated(true);
        setCertificateError('');
      } else {
        const data = await response.json();
        setCertificateError(data.error || 'You must pass the final exam to receive a certificate.');
      }
    } catch {
      setCertificateError('Failed to generate certificate.');
    }
  };

  if (!Array.isArray(modules) || modules.length === 0) {
    return <p className="text-gray-500">No modules available.</p>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Curriculum</h2>
        {user && enrolled && (
          <div className="text-sm text-gray-600">
            Course Progress: {courseProgress.toFixed(1)}%
          </div>
        )}
      </div>
      {!enrolled && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">
            {user 
              ? 'Enroll in the course to access all content.' 
              : 'Sign in and enroll to access all content.'}
          </p>
        </div>
      )}
      {modules.map((module, index) => {
        const lessons = Array.isArray(module.lessons) ? module.lessons : [];
        const isLocked = !enrolled && index > 0;

        const sortedLessons = lessons
          .filter((lesson) => lesson && lesson.lesson_id !== undefined)
          .sort((a, b) => a.lesson_id - b.lesson_id);

        return (
          <div 
            key={module.module_id} 
            className={`border rounded-lg p-6 bg-white shadow-sm ${isLocked ? 'opacity-60' : ''}`}
          >
            <button
              onClick={() => toggleModule(module.module_id)}
              className={`flex justify-between w-full text-left font-bold text-lg ${isLocked ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 hover:text-orange-500'} transition duration-200`}
              disabled={isLocked}
            >
              <span>
                {module.module}
                {isLocked && <span className="ml-2 text-sm">🔒</span>}
              </span>
              {!isLocked && (
                <span className="text-gray-500">
                  {openModules.includes(module.module_id) ? '−' : '+'}
                </span>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-1">
              Duration: {module.duration || 'Unknown duration'}
            </p>
            <AnimatePresence>
              {openModules.includes(module.module_id) && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 space-y-4"
                >
                  {sortedLessons.length > 0 ? (
                    sortedLessons.map((lesson) => (
                      <li key={lesson.lesson_id} className="flex flex-col py-4 border-t border-gray-200">
                        {isLocked ? (
                          <span className="text-gray-400 text-base font-medium">
                            {lesson.name}
                          </span>
                        ) : (
                          <Link
                            to={user ? `/courses/${courseId}/modules/${module.module_id}/lesson/${lesson.lesson_id}` : '/Auth'}
                            className="text-blue-500 hover:underline text-base font-medium"
                          >
                            {lesson.name}
                          </Link>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          {lesson.short_description || 'No description available.'}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No lessons available.</li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      {hasFinalExam && enrolled && user && (
        <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
          <Link
            to={`/courses/${courseId}/final-exam`}
            target="_blank"
            className="text-blue-500 hover:underline text-lg font-semibold"
          >
            Final Exam
          </Link>
          <p className="text-sm text-gray-500">
            Complete the final exam to earn your certificate.
          </p>
          <button
            onClick={handleGenerateCertificate}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Generate Certificate
          </button>
          {certificateGenerated && (
            <div className="bg-green-100 text-green-800 p-4 rounded-md border border-green-300 shadow">
              <p className="font-semibold text-sm">Certificate successfully generated and added to your profile.</p>
            </div>
          )}
          {certificateError && (
            <div className="bg-red-100 text-red-800 p-4 rounded-md border border-red-300 shadow">
              <p className="font-semibold text-sm">{certificateError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Curriculum;
