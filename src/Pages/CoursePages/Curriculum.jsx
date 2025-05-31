import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Curriculum = ({ modules, courseId }) => {
  const [openModules, setOpenModules] = useState([]);

  const toggleModule = (moduleId) => {
    setOpenModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  if (!Array.isArray(modules) || modules.length === 0) {
    return <p className="text-gray-500">No modules available.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Curriculum</h2>
      {modules.map((module) => {
        const lessons = Array.isArray(module.lessons) ? module.lessons : [];

        // ✅ Удалим undefined/null и проверим lesson_id
        const sortedLessons = lessons
          .filter((lesson) => lesson && lesson.lesson_id !== undefined)
          .sort((a, b) => a.lesson_id - b.lesson_id);

        return (
          <div key={module.module_id} className="border rounded-lg p-6 bg-white shadow-sm">
            <button
              onClick={() => toggleModule(module.module_id)}
              className="flex justify-between w-full text-left font-bold text-lg text-gray-800 hover:text-orange-500 transition duration-200"
            >
              <span>{module.module}</span>
              <span className="text-gray-500">
                {openModules.includes(module.module_id) ? '−' : '+'}
              </span>
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
                        <Link
                          to={`/courses/${courseId}/modules/${module.module_id}/lesson/${lesson.lesson_id}`}
                          className="text-blue-500 hover:underline text-base font-medium"
                        >
                          {lesson.name}
                        </Link>
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
    </div>
  );
};

export default Curriculum;
