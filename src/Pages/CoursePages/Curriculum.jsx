import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Curriculum = () => {
  const [openModules, setOpenModules] = useState([]);

  const toggleModule = (moduleId) => {
    if (openModules.includes(moduleId)) {
      setOpenModules(openModules.filter((id) => id !== moduleId));
    } else {
      setOpenModules([...openModules, moduleId]);
    }
  };

  const modules = [
    {
      id: 1,
      title: 'Module 1 - Basics of WordPress',
      lessons: [
        { title: 'Introduction', link: '/Quanta/Lesson' },
        { title: 'Setting Up WordPress', link: '/Quanta/Lesson' },
        { title: 'Plugins', link: '/Quanta/Lesson' },
      ],
    },
    {
      id: 2,
      title: 'Module 2 - WordPress Themes',
      lessons: [
        { title: 'Choosing a Theme', link: '/Quanta/Lesson' },
        { title: 'Installing Themes', link: '/Quanta/Lesson' },
        { title: 'Customizing', link: '/Quanta/Lesson' },
      ],
    },
    {
      id: 3,
      title: 'Module 3 - Advanced Features',
      lessons: [
        { title: 'SEO Optimization', link: '/Quanta/Lesson' },
        { title: 'Security Plugins', link: '/Quanta/Lesson' },
        { title: 'Backups', link: '/Quanta/Lesson' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Curriculum</h2>
      {modules.map((module) => (
        <div key={module.id} className="border rounded-lg p-4">
          <button onClick={() => toggleModule(module.id)} className="flex justify-between w-full text-left font-bold text-lg">
            {module.title}
            <span>{openModules.includes(module.id) ? '-' : '+'}</span>
          </button>
          <AnimatePresence>
            {openModules.includes(module.id) && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="pl-4 mt-4"
              >
                {module.lessons.map((lesson, index) => (
                  <li key={index} className="flex justify-between py-4 border-t border-gray-300">
                    <a href={lesson.link} className="text-blue-500 hover:underline">
                      {lesson.title}
                    </a>
                    <p className="text-orange-500">25:32</p>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default Curriculum;
