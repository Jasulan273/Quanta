import { useState } from 'react';
import { Settings, BookOpen, User, Shield, Image, Award } from 'lucide-react';

const Sidebar = ({ setActiveTab, user }) => {
  const [isModeratorOpen, setIsModeratorOpen] = useState(false);

  return (
    <div className='bg-gray-900 text-white w-1/5 min-h-screen p-4 flex flex-col justify-between'>
      <div>
        <h2 className='text-xl font-bold mb-6'>Author Panel</h2>
        <nav className='space-y-4'>
          <button
            onClick={() => { setActiveTab('info'); console.log('Set activeTab to info'); }}
            className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
          >
            <User size={20} /> About Me
          </button>
          {user?.role?.toLowerCase() !== 'moderator' && (
            <>
              {['author', 'author_journalist'].includes(user?.role?.toLowerCase()) && (
                <button
                  onClick={() => { setActiveTab('courses'); console.log('Set activeTab to courses'); }}
                  className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
                >
                  <BookOpen size={20} /> My Courses
                </button>
              )}
              {user?.is_journalist && (
                <button
                  onClick={() => { setActiveTab('blogs'); console.log('Set activeTab to blogs'); }}
                  className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
                >
                  <BookOpen size={20} /> My Posts
                </button>
              )}
              <button
                onClick={() => { setActiveTab('mycourses'); console.log('Set activeTab to mycourses'); }}
                className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
              >
                <BookOpen size={20} /> Enrolled
              </button>
              {['student', 'author', 'journalist', 'moderator'].includes(user?.role?.toLowerCase()) && (
                <button
                  onClick={() => { setActiveTab('applications'); console.log('Set activeTab to applications (non-moderator)'); }}
                  className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
                >
                  <BookOpen size={20} /> Applications
                </button>
              )}
              <button
                onClick={() => { setActiveTab('certificates'); console.log('Set activeTab to certificates'); }}
                className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
              >
                <Award size={20} /> My Certificates
              </button>
            </>
          )}
          {user?.role?.toLowerCase() === 'moderator' && (
            <div className='relative'>
              <button
                onClick={() => { setIsModeratorOpen(!isModeratorOpen); console.log('Toggled moderator dropdown:', !isModeratorOpen); }}
                className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
              >
                <Shield size={20} /> Moderator Panel
              </button>
              {isModeratorOpen && (
                <div className='absolute mt-1 w-full bg-gray-700 text-white rounded-md shadow-lg'>
                  <button
                    onClick={() => { setActiveTab('users'); setIsModeratorOpen(false); console.log('Set activeTab to users'); }}
                    className='flex items-center gap-2 p-2 w-full hover:bg-gray-600 rounded-md'
                  >
                    <User size={16} /> Users
                  </button>
                  <button
                    onClick={() => { setActiveTab('ads'); setIsModeratorOpen(false); console.log('Set activeTab to ads'); }}
                    className='flex items-center gap-2 p-2 w-full hover:bg-gray-600 rounded-md'
                  >
                    <Image size={16} /> Advertisements
                  </button>
                  <button
                    onClick={() => { setActiveTab('applications'); setIsModeratorOpen(false); console.log('Set activeTab to applications (moderator)'); }}
                    className='flex items-center gap-2 p-2 w-full hover:bg-gray-600 rounded-md'
                  >
                    <BookOpen size={16} /> Applications
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => { setActiveTab('settings'); console.log('Set activeTab to settings'); }}
            className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
          >
            <Settings size={20} /> Settings
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;