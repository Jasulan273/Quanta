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
    return <p>No modules available.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Curriculum</h2>
      {modules.map((module) => (
        <div key={module.module_id} className="border rounded-lg p-4">
          <button
            onClick={() => toggleModule(module.module_id)}
            className="flex justify-between w-full text-left font-bold text-lg"
          >
            {module.module} ({module.duration || 'Unknown duration'})
            <span>{openModules.includes(module.module_id) ? '-' : '+'}</span>
          </button>
          <AnimatePresence>
            {openModules.includes(module.module_id) && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="pl-4 mt-4"
              >
                {module.lessons && module.lessons.length > 0 ? (
                  module.lessons.map((lesson) => (
                    <li key={lesson.lesson_id} className="flex justify-between py-4 border-t border-gray-300">
                      <Link
                        to={`/courses/${courseId}/lesson/${lesson.lesson_id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {lesson.name}
                      </Link>

                    </li>
                  ))
                ) : (
                  <p>No lessons available</p>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default Curriculum;

