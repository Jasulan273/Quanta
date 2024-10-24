import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import courseBanner from '../../Materials/Images/course_banner.png';

const CoursePage = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="bg-black text-white py-16 px-4 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold w-[1000px]">The Ultimate Guide To The Best WordPress LMS Plugin</h1>
            <p className="text-lg text-gray-300 mt-4">Photography by DeterminedPoitras</p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4">
              <span>2 Weeks</span>
              <span>156 Students</span>
              <span>All Levels</span>
              <span>20 Lessons</span>
              <span>3 Quizzes</span>
            </div>
          </div>
          <img
            src={courseBanner}
            alt="Course Preview"
            className="w-[410px] h-[250px] object-contain  rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="flex space-x-8 border-b max-w-7xl mx-auto px-4 py-4">
        {['Overview', 'Curriculum', 'Reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`py-2 text-lg ${activeTab === tab ? 'border-b-2 border-orange-500' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4 }}
        className="py-8 max-w-7xl mx-auto px-4"
      >
        {activeTab === 'Overview' && <Overview />}
        {activeTab === 'Curriculum' && <Curriculum />}
        {activeTab === 'Reviews' && <Reviews />}
      </motion.div>
    </div>
  );
};

const Overview = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Course Overview</h2>
    <p className="text-lg text-gray-600">
      LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress LMS Plugins which
      can be used to easily create & sell courses online.
    </p>
    <p className="text-lg text-gray-600">
      It’s easy to use, and offers many flexible features. This plugin allows you to create educational courses right on
      your WordPress website.
    </p>
  </div>
);

const Curriculum = () => {
  const [openModules, setOpenModules] = useState([]);

  const toggleModule = (moduleId) => {
    if (openModules.includes(moduleId)) {
      setOpenModules(openModules.filter((id) => id !== moduleId));
    } else {
      setOpenModules([...openModules, moduleId]);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Curriculum</h2>
      {[
        { 
          id: 1, 
          title: 'Module 1 - Basics of WordPress', 
          lessons: [
            { title: 'Introduction', link: '/Lesson' },
            { title: 'Setting Up WordPress', link: '/Lesson' },
            { title: 'Plugins', link: '/Lesson' }
          ]
        },
        { 
          id: 2, 
          title: 'Module 2 - WordPress Themes', 
          lessons: [
            { title: 'Choosing a Theme', link: '/Lesson' },
            { title: 'Installing Themes', link: '/Lesson' },
            { title: 'Customizing', link: '/Lesson' }
          ]
        },
        { 
          id: 3, 
          title: 'Module 3 - Advanced Features', 
          lessons: [
            { title: 'SEO Optimization', link: '/Lesson' },
            { title: 'Security Plugins', link: '/Lesson' },
            { title: 'Backups', link: '/Lesson' }
          ]
        }
      ].map((module) => (
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



const Reviews = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Reviews</h2>

    <div className="flex items-center space-x-4 mb-8">
      <div className="text-5xl font-bold">4.0</div>
      <div className="flex items-center">
        <div className="flex space-x-1 text-yellow-400">
        <span className="text-yellow-400 text-xl">⭐</span>
        </div>
        <p className="text-gray-500">(148,953 ratings)</p>
      </div>
    </div>
   <div className='bg-gray-100 my-8 py-8 px-8 rounded-[20px]'>
   <div className='flex flex-row items-center ml-4 my-8'>
        {[1, 2, 3, 4, 5].map((num) => (
                <span className="text-yellow-400 text-xl">⭐</span>
         ))}
         <h3 className='ml-2'>90%</h3>
         <div className='bg-gray-200 w-[800px] h-[15px] ml-4 rounded-md'>
         <hr className='bg-yellow-400 w-[500px] h-[15px] border-none rounded-md'/>
         </div>
      
    </div>
    <div className='flex flex-row items-center ml-4 my-8'>
        {[1, 2, 3, 4].map((num) => (
                <span className="text-yellow-400 text-xl">⭐</span>
         ))}
         <span className="text-gray-400 text-xl text-transparent shadow:0 0 0 blue;">⭐</span>
         <h3 className='ml-2'>60%</h3>
         <div className='bg-gray-200 w-[800px] h-[15px] ml-4 rounded-md'>
         <hr className='bg-yellow-400 w-[500px] h-[15px] border-none rounded-md'/>
         </div>
      
    </div>
    <div className='flex flex-row items-center ml-4 my-8'>
        {[1, 2, 3].map((num) => (
                <span className="text-yellow-400 text-xl">⭐</span>
         ))}
          {[1, 2].map((num) => (
                <span className="text-gray-400 text-xl text-transparent shadow:0 0 0 blue;">⭐</span>
         ))}
      
         <h3 className='ml-2'>30%</h3>
         <div className='bg-gray-200 w-[800px] h-[15px] ml-4 rounded-md'>
         <hr className='bg-yellow-400 w-[500px] h-[15px] border-none rounded-md'/>
         </div>
      
    </div>
    <div className='flex flex-row items-center ml-4 my-8'>
        {[1, 2].map((num) => (
                <span className="text-yellow-400 text-xl">⭐</span>
         ))}
           {[1, 2, 3].map((num) => (
                <span className="text-gray-400 text-xl text-transparent shadow:0 0 0 blue;">⭐</span>
         ))}
         <h3 className='ml-2'>20%</h3>
         <div className='bg-gray-200 w-[800px] h-[15px] ml-4 rounded-md'>
         <hr className='bg-yellow-400 w-[500px] h-[15px] border-none rounded-md'/>
         </div>
      
    </div>
    <div className='flex flex-row items-center ml-4 my-8'>
        {[1].map((num) => (
                <span className="text-yellow-400 text-xl">⭐</span>
         ))}
           {[1, 2, 3, 4].map((num) => (
                <span className="text-gray-400 text-xl text-transparent shadow:0 0 0 blue;">⭐</span>
         ))}
         <h3 className='ml-2'>10%</h3>
         <div className='bg-gray-200 w-[800px] h-[15px] ml-4 rounded-md'>
         <hr className='bg-yellow-400 w-[500px] h-[15px] border-none rounded-md'/>
         </div>
      
    </div>
   </div>
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h4 className="font-bold">Laura Hipster</h4>
        <div className='flex flex-row items-center my-2'><h2>Rating:</h2><span className="text-yellow-400 text-xl">⭐</span></div>
        <p className="text-sm text-gray-500 my-2">October 03, 2022</p>
        <p>Great course! Learned a lot from it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis impedit nesciunt ut, nisi quia quis culpa fugiat libero, odit cupiditate quaerat, tenetur consectetur voluptatem quo! Mollitia magni quo error voluptate! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque iure, ullam corrupti quidem accusamus veniam error ex deserunt animi illum incidunt iste, aliquid quaerat! Enim rerum iure sapiente corporis et. </p>
        <button className="text-orange-500 text-sm mt-4">Reply</button>
      </div>
    </div>

    <div className="border rounded-lg p-8 mt-8">
      <h3 className="text-xl font-bold mb-6">Add Your Review</h3>
      <form>
        <label htmlFor="rating" className="block text-lg mb-2">Your Rating (1 to 5):</label>
        <div className="flex items-center space-x-4 mb-4">
          <select id="rating" className="border p-2 rounded-lg text-lg">
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span className="text-yellow-400 text-3xl">⭐</span>
        </div>
        <textarea
          id="review"
          className="border w-full p-4 rounded-lg mb-6"
          rows="6"
          placeholder="Write your review..."
        ></textarea>
        <button type="submit" className="bg-orange-500 text-white py-3 px-6 rounded-lg w-full text-lg">Submit Review</button>
      </form>
    </div>
  </div>
);

export default CoursePage;
