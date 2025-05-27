import React, { useState, useEffect } from 'react';
import { Settings, BookOpen, User, Edit, Calendar, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fetchUserProfile, fetchCourses, fetchEnrolledCourses, updateCourse, API_URL } from '../../Api/api';

const Sidebar = ({ setActiveComponent, isAuthor }) => (
  <div className='bg-gray-900 text-white w-1/5 min-h-screen p-4 flex flex-col justify-between'>
    <div>
      <h2 className='text-xl font-bold mb-6'>User Panel</h2>
      <nav className='space-y-4'>
        <button
          onClick={() => setActiveComponent('info')}
          className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
        >
          <User size={20} /> About Me
        </button>
        {isAuthor && (
          <button
            onClick={() => setActiveComponent('courses')}
            className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
          >
            <BookOpen size={20} /> My Courses
          </button>
        )}
        <button
          onClick={() => setActiveComponent('enrolled')}
          className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 w-full'
        >
          <Bookmark size={20} /> Enrolled Courses
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

const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    gender: user?.gender || '',
    birthday: user?.birthday || '',
    about: user?.about || '',
    avatar: null,
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    setUpdatedData({
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      gender: user?.gender || '',
      birthday: user?.birthday || '',
      about: user?.about || '',
      avatar: user?.avatar || null,
    });
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');

      const formData = new FormData();
      formData.append('email', updatedData.email);
      formData.append('phone_number', updatedData.phone_number);
      formData.append('gender', updatedData.gender);
      formData.append('birthday', updatedData.birthday);
      formData.append('about', updatedData.about);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await axios.patch(
        `${API_URL}/profile/edit/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Profile updated successfully!');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      alert(`Failed to update profile: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setUpdatedData({ ...updatedData, avatar: file.name }); // Update with file name for preview
    }
  };

  const genderDisplay = (gender) => {
    if (gender === 'M') return 'Male';
    if (gender === 'F') return 'Female';
    return gender || 'Not specified';
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        <label className="w-24 h-24 rounded-[30px] overflow-hidden">
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile) : user?.avatar ? `${API_URL}${user.avatar}` : 'https://via.placeholder.com/100'}
            width="100px"
            className='rounded-[30px]'
            alt="User Avatar"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
            />
          )}
        </label>
        <div>
          <h2 className="text-xl font-bold">{user?.username || 'User Name'}</h2>
          {isEditing ? (
            <>
              <input
                type="text"
                value={updatedData.email}
                onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Email"
              />
              <input
                type="text"
                value={updatedData.phone_number}
                onChange={(e) => setUpdatedData({ ...updatedData, phone_number: e.target.value })}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Phone Number"
              />
            </>
          ) : (
            <>
              <p className="text-gray-600">{user?.email || 'No email provided'}</p>
              <p className="text-gray-600">Role: {user?.role || 'User'}</p>
              <p className="text-gray-600">Phone: {user?.phone_number || 'No phone provided'}</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <User size={20} /> Gender
          </h3>
          {isEditing ? (
            <select
              value={updatedData.gender}
              onChange={(e) => setUpdatedData({ ...updatedData, gender: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Not specified</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          ) : (
            <p>{genderDisplay(user?.gender)}</p>
          )}
        </div>
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Calendar size={20} /> Birthday
          </h3>
          {isEditing ? (
            <input
              type="date"
              value={updatedData.birthday}
              onChange={(e) => setUpdatedData({ ...updatedData, birthday: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <p>{user?.birthday || 'Not specified'}</p>
          )}
        </div>
        <div className="p-4 bg-white shadow rounded-lg col-span-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BookOpen size={20} /> About Me
          </h3>
          {isEditing ? (
            <textarea
              value={updatedData.about}
              onChange={(e) => setUpdatedData({ ...updatedData, about: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
          ) : (
            <p>{user?.about || 'No information provided'}</p>
          )}
        </div>
      </div>
      {isEditing ? (
        <button
          onClick={handleSaveClick}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4 flex items-center"
        >
          Save
        </button>
      ) : (
        <button
          onClick={handleEditClick}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 flex items-center"
        >
          <Edit size={16} className="mr-2" /> Edit Profile
        </button>
      )}
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

const EnrolledCourses = ({ enrolledCourses }) => (
  <div className="p-6">
    <h2 className="text-xl font-bold">Enrolled Courses</h2>
    {enrolledCourses.length === 0 ? (
      <p>No enrolled courses available.</p>
    ) : (
      <ul>
        {enrolledCourses.map(course => (
          <li key={course.id} className="p-4 border rounded-lg mb-4 shadow">
            <Link to={`/courses/${course.id}/`} className="text-lg font-semibold text-blue-500 hover:underline">
              {course.title}
            </Link>
            <p>{course.description}</p>
            <p>Duration: {course.duration}</p>
            <p>Level: {course.level}</p>
            <p>Author: {course.author}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AuthorPanel = () => {
  const [activeComponent, setActiveComponent] = useState('info');
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [user, setUser] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
        const coursesData = await fetchCourses();
        const filteredCourses = coursesData.filter(course => course.author === profile.username);
        setCourses(filteredCourses);
        const enrolledData = await fetchEnrolledCourses();
        setEnrolledCourses(enrolledData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  const isAuthor = user?.role === 'author';

  return (
    <div className='flex w-full min-h-screen'>
      <Sidebar setActiveComponent={setActiveComponent} isAuthor={isAuthor} />
      <div className='flex-1 bg-gray-100 p-6'>
        {activeComponent === 'info' && <UserProfile user={user} />}
        {activeComponent === 'courses' && isAuthor && <Courses courses={courses} />}
        {activeComponent === 'enrolled' && <EnrolledCourses enrolledCourses={enrolledCourses} />}
      </div>
    </div>
  );
};

export default AuthorPanel;