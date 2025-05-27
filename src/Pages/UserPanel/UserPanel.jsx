import React, { useState, useEffect } from 'react';
import { Settings, BookOpen, User, Edit, Calendar, Save  } from 'lucide-react';
import { fetchUserProfile, fetchCourses, updateCourse, updateUserProfile, fetchAuthorCourses } from '../../Api/api';
import MyCourses from './MyCourses';

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


const getChangedFields = (original, updated) => {
  let out = {};
  for (let key in updated) {
    if (updated[key] !== original[key]) {
      out[key] = updated[key] === '' ? null : updated[key];
    }
  }
  return out;
};

const UserProfile = ({ user, setUser }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    email: '',
    about: '',
    birthday: '',
    phone_number: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email ?? '',
        about: user.about ?? '',
        birthday: user.birthday ?? '',
        phone_number: user.phone_number ?? '',
        gender: user.gender ?? '',
      });
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    setLoading(true);
    let patchData = {};
    Object.keys(form).forEach(key => {
      if ((user[key] ?? '') !== form[key]) {
        patchData[key] = form[key] === '' ? null : form[key];
      }
    });
    try {
      if (Object.keys(patchData).length > 0) {
        await updateUserProfile(patchData);
        setUser(prev => ({
          ...prev,
          ...patchData
        }));
      }
      setEditing(false);
    } catch (error) {
      window.location.reload()

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{user?.username || 'User Name'}</h2>
            {!editing ? (
              <button
                onClick={handleEdit}
                className="ml-2 flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                title="Edit profile"
              >
                <Edit size={16} /> Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading}
                className="ml-2 flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                title="Save profile"
              >
                <Save size={16} /> {loading ? "Saving..." : "Save"}
              </button>
            )}
          </div>
          {editing ? (
            <>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input w-full mt-1 mb-1 p-1 border rounded"
                placeholder="Email"
              />
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="input w-full mt-1 mb-1 p-1 border rounded"
                placeholder="Phone"
              />
            </>
          ) : (
            <>
              <p className="text-gray-600">{user?.email || 'No email provided'}</p>
              <p className="text-gray-600">Role: {user?.role || 'No role'}</p>
              <p className="text-gray-600">Phone: {user?.phone_number || '+7 747 777 77 77'}</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <User size={20} /> Gender
          </h3>
          {editing ? (
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input w-full mt-1 mb-1 p-1 border rounded"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p>{user?.gender || 'Не указано'}</p>
          )}
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Calendar size={20} /> Birthday
          </h3>
          {editing ? (
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              className="input w-full mt-1 mb-1 p-1 border rounded"
            />
          ) : (
            <p>{user?.birthday || 'Не указано'}</p>
          )}
        </div>
        <div className="p-4 bg-white shadow rounded-lg col-span-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BookOpen size={20} /> About Me
          </h3>
          {editing ? (
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              className="input w-full mt-1 mb-1 p-1 border rounded"
              placeholder="About you"
            />
          ) : (
            <p>{user?.about || 'Hello! My name is Bakhtyar, and I am a passionate author...'}</p>
          )}
        </div>
      </div>
    </div>
  );
};


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
        setUser(profile);
        // Только если это автор — грузим курсы автора
        if (profile.role && profile.role.toLowerCase() === 'author') {
          const authorCourses = await fetchAuthorCourses();
          setCourses(authorCourses);
        }
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
      <Sidebar setActiveComponent={setActiveComponent} user={user} />
<div className='flex-1 bg-gray-100 p-6'>
  {activeComponent === 'info' && <UserProfile user={user} setUser={setUser} />}
  {activeComponent === 'courses' && user?.role === "author" && <Courses courses={courses} />}
  {activeComponent === 'mycourses' && <MyCourses />}
</div>

    </div>
  );
};

export default AuthorPanel;
