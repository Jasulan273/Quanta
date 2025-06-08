import { useState, useEffect } from 'react';
import { fetchAuthorCourses } from '../../Api/courses';
import { fetchAuthorBlogs } from '../../Api/blog';
import { fetchUserProfile } from '../../Api/profile';
import Sidebar from './Sidebar';
import UserProfile from './UserProfile';
import Courses from './Courses';
import MyCourses from './MyCourses';
import Blogs from './Blogs';
import Applications from './Applications';

const UserPanel = () => {
  const [activeComponent, setActiveComponent] = useState('info');
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
        if (profile.role && profile.role.toLowerCase() === 'author') {
          const authorCourses = await fetchAuthorCourses();
          setCourses(authorCourses);
        }
        if (profile.is_journalist) {
          const authorBlogs = await fetchAuthorBlogs();
          setBlogs(authorBlogs);
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
        {activeComponent === 'blogs' && user?.is_journalist && <Blogs blogs={blogs} />}
        {activeComponent === 'applications' && <Applications user={user} setUser={setUser} />}
      </div>
    </div>
  );
};

export default UserPanel;