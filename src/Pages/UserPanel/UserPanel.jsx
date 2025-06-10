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
import ModeratorPanel from './ModeratorPanel';

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));

        if (
          profile.role &&
          ['author', 'author_journalist'].includes(profile.role.toLowerCase())
        ) {
          const authorCourses = await fetchAuthorCourses();
          setCourses(authorCourses);
        }

        if (profile.is_journalist) {
          const authorBlogs = await fetchAuthorBlogs();
          setBlogs(authorBlogs);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  const canViewCourses =
    user && ['author', 'author_journalist'].includes(user.role?.toLowerCase());
  const isModerator = user && user.role?.toLowerCase() === 'moderator';

  return (
    <div className='flex w-full min-h-screen'>
      <Sidebar setActiveTab={setActiveTab} user={user} />
      <div className='flex-1 bg-gray-100 p-6'>
        {activeTab === 'info' && <UserProfile user={user} />}
        {activeTab === 'courses' && canViewCourses && (
          <Courses courses={courses} />
        )}
        {activeTab === 'mycourses' && !isModerator && <MyCourses />}
        {activeTab === 'blogs' && !isModerator && user?.is_journalist && <Blogs blogs={blogs} />}
        {activeTab === 'applications' && !isModerator && (
          <Applications user={user} fetchUserProfile={fetchUserProfile} />
        )}
        {activeTab === 'applications' && isModerator && <ModeratorPanel activeTab={activeTab} />}
        {activeTab === 'users' && isModerator && <ModeratorPanel activeTab={activeTab} />}
        {activeTab === 'ads' && isModerator && <ModeratorPanel activeTab={activeTab} />}
        {activeTab === 'settings' && <div>Settings Content</div>}
      </div>
    </div>
  );
};

export default UserPanel;