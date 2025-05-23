import React, { useState, useEffect } from 'react';
import { Settings, BookOpen, User, Edit, Calendar } from 'lucide-react';
import { fetchUserProfile, fetchCourses, updateCourse } from '../../Api/api';

const Sidebar = ({ setActiveComponent }) => (
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
        <button
          onClick={() => setActiveComponent('courses')}
          className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
        >
          <BookOpen size={20} /> My Courses
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

const UserProfile = ({ user }) => (
  <div className="p-6">
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold">
        {user?.username?.charAt(0).toUpperCase() || 'U'}
      </div>
      <div>
        <h2 className="text-xl font-bold">{user?.username || 'User Name'}</h2>
        <p className="text-gray-600">{user?.email || 'No email provided'}</p>
        <p className="text-gray-600">Role: {user?.role || 'Author'}</p>
        <p className="text-gray-600">Phone: {user?.phone_number || '+7 747 777 77 77'}</p>
      </div>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <User size={20} /> Gender
        </h3>
        <p>{user?.gender || 'Male'}</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Calendar size={20} /> Birthday
        </h3>
        <p>{user?.birthday || '12.03.2004'}</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg col-span-2">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BookOpen size={20} /> About Me
        </h3>
        <p>{user?.about || 'Hello! My name is Bakhtyar, and I am a passionate author...'}</p>
      </div>
    </div>
  </div>
);

const Courses = ({ courses }) => {
  const [editingCourse, setEditingCourse] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setUpdatedData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
    });
  };

  const handleSaveClick = async () => {
    if (!editingCourse) return;
    try {
      await updateCourse(editingCourse.id, updatedData);
      alert('Course updated successfully!');
      setEditingCourse(null);
      window.location.reload();
    } catch (error) {
      alert(`Failed to update course: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">My Courses</h2>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.id} className="p-4 border rounded-lg mb-4 shadow">
              {editingCourse?.id === course.id ? (
                <div>
                  <input
                    type="text"
                    value={updatedData.title}
                    onChange={(e) => setUpdatedData({ ...updatedData, title: e.target.value })}
                    className="w-full p-2 border rounded-lg mb-2"
                  />
                  <textarea
                    value={updatedData.description}
                    onChange={(e) => setUpdatedData({ ...updatedData, description: e.target.value })}
                    className="w-full p-2 border rounded-lg mb-2"
                  />
                  <input
                    type="text"
                    value={updatedData.duration}
                    onChange={(e) => setUpdatedData({ ...updatedData, duration: e.target.value })}
                    className="w-full p-2 border rounded-lg mb-2"
                  />
                  <input
                    type="text"
                    value={updatedData.level}
                    onChange={(e) => setUpdatedData({ ...updatedData, level: e.target.value })}
                    className="w-full p-2 border rounded-lg mb-2"
                  />
                  <button
                    onClick={handleSaveClick}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 flex items-center"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p>{course.description}</p>
                  <p>Duration: {course.duration}</p>
                  <p>Level: {course.level}</p>
                  <button
                    onClick={() => handleEditClick(course)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2 flex items-center"
                  >
                    <Edit size={16} className="mr-2" /> Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AuthorPanel = () => {
  const [activeComponent, setActiveComponent] = useState('info');
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await fetchUserProfile();
        console.log(profile.user)
        setUser(profile);
        const coursesData = await fetchCourses();
        const filteredCourses = coursesData.filter(course =>
        course.author === profile.username
);

       setCourses(filteredCourses);

      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  return (
    <div className='flex w-full min-h-screen'>
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className='flex-1 bg-gray-100 p-6'>
        {activeComponent === 'info' && <UserProfile user={user} />}
       {activeComponent === 'courses' && <Courses courses={courses} />}
      </div>
    </div>
  );
};

export default AuthorPanel;
