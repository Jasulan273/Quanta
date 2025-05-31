import { Settings, BookOpen, User } from 'lucide-react';

const Sidebar = ({ setActiveComponent, user }) => (
  <div className='bg-gray-900 text-white w-1/5 min-h-screen p-4 flex flex-col justify-between'>
    <div>
      <h2 className='text-xl font-bold mb-6'>Author Panel</h2>
      <nav className='space-y-4'>
        <button
          onClick={() => setActiveComponent('info')}
          className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
        >
          <User size={20} /> About Me
        </button>
        {user?.role === "author" && (
          <button
            onClick={() => setActiveComponent('courses')}
            className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
          >
            <BookOpen size={20} /> My Courses
          </button>
        )}
        <button
          onClick={() => setActiveComponent('mycourses')}
          className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
        >
          <BookOpen size={20} /> Enrolled
        </button>
        <button
          onClick={() => setActiveComponent('settings')}
          className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
        >
          <Settings size={20} /> Settings
        </button>
      </nav>
    </div>
  </div>
);

export default Sidebar;