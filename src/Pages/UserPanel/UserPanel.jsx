import React, { useState, useEffect } from 'react';
import { Settings, BookOpen, User, Edit, Briefcase, Star, Calendar } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../Api/api';

const Sidebar = ({ setActiveComponent }) => (
  <div className='bg-gray-900 text-white w-1/5 min-h-screen p-4 flex flex-col justify-between'>
    <div>
      <h2 className='text-xl font-bold mb-6'>Author Panel</h2>
      <nav className='space-y-4'>
        <button onClick={() => setActiveComponent('info')} className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'>
          <User size={20} /> About Me
        </button>
        <button onClick={() => setActiveComponent('courses')} className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'>
          <BookOpen size={20} /> My Courses
        </button>
        <button onClick={() => setActiveComponent('settings')} className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'>
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
        {user?.name?.charAt(0) || 'U'}
      </div>
      <div>
        <h2 className="text-xl font-bold">{user?.name || 'User Name'}</h2>
        <p className="text-gray-600">{user?.bio || 'No bio available.'}</p>
      </div>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold flex items-center gap-2"><Briefcase size={20} /> Profession</h3>
        <p>{user?.profession || 'Not specified'}</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold flex items-center gap-2"><Calendar size={20} /> Joined</h3>
        <p>{user?.joined || 'Unknown date'}</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold flex items-center gap-2"><BookOpen size={20} /> Total Courses</h3>
        <p>{user?.courseCount || 0}</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold flex items-center gap-2"><Star size={20} /> Average Rating</h3>
        <p>{user?.rating || 'No ratings yet'}</p>
      </div>
    </div>
  </div>
);



const CourseEditor = ({ course, onClose }) => {
  const [name, setName] = useState(course.name);
  const [description, setDescription] = useState(course.description);
  const [content, setContent] = useState(course.content);

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/courses/${course.id}/`, {
        name, description, content
      });
      alert('Course updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Edit Course</h2>
      <input type="text" className="w-full p-2 border mt-2" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea className="w-full p-2 border mt-2" value={description} onChange={(e) => setDescription(e.target.value)} />
      <textarea className="w-full p-2 border mt-2" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded mt-4">Save</button>
      <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2">Cancel</button>
    </div>
  );
};

const Courses = ({ courses }) => {
  const [editingCourse, setEditingCourse] = useState(null);
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">My Courses</h2>
      {editingCourse ? (
        <CourseEditor course={editingCourse} onClose={() => setEditingCourse(null)} />
      ) : courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.id} className="p-4 border rounded-lg mb-4 shadow">
              <h3 className="text-lg font-semibold">{course.name}</h3>
              <p>{course.description}</p>
              <button onClick={() => setEditingCourse(course)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 flex items-center">
                <Edit size={16} className="mr-2" /> Edit
              </button>
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
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchAuthorCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses/`);
        const authorCourses = response.data.filter(course => course.author_username === username);
        setCourses(authorCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchAuthorCourses();
  }, [username]);

  return (
    <div className='flex w-full min-h-screen'>
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className='flex-1 bg-gray-100 p-6'>
      {activeComponent === 'info' && <UserProfile  />}
        {activeComponent === 'courses' && <Courses courses={courses} />}
      </div>
    </div>
  );
};

export default AuthorPanel;
