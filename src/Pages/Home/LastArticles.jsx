import { useState, useEffect, useRef } from "react";
import BlogImage from '../../Materials/Images/banner.png';
import CalendarIcon from '../../Materials/Icons/Calendartoday.png';
import { NavLink, Link } from 'react-router-dom';
import { fetchBlogPosts } from '../../Api/blog';

const LastArticles = () => {
  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchBlogPosts();
        setPosts(data.slice(0, 3));
      } catch {
        setError('Failed to load articles');
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sectionPosition = sectionRef.current?.getBoundingClientRect().top;
      if (sectionPosition <= window.innerHeight) {
        setLoaded(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (error) return <div>{error}</div>;

  const stripHtmlAndTruncate = (html, maxWords = 15) => {
    const text = html.replace(/<[^>]+>/g, '');
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-20 sm:mt-32 mb-12 sm:mb-16 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-exo font-bold">Latest Articles</h2>
          <p className="text-grey text-sm sm:text-base">Explore our Free Articles</p>
        </div>
        <NavLink
          to="/Blog"
          className="inline-flex justify-center items-center w-36 sm:w-40 h-10 sm:h-12 bg-white text-black border-2 border-grey rounded-3xl hover:bg-gray-200 transition text-sm sm:text-base"
        >
          All Articles
        </NavLink>
      </div>
      <div
        ref={sectionRef}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all`}
      >
        {posts.map((post) => {
          const imageUrl = post.image || BlogImage;
          return (
            <Link
              to={`/BlogPage/${post.id}`}
              key={post.id}
              className={`max-w-sm h-[450px] sm:h-[474px] bg-white rounded-3xl shadow-md overflow-hidden hover:scale-105 hover:shadow-xl transition duration-300 block ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div
                className="h-56 sm:h-60 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <div className="p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-gray-500 mb-2 flex items-center gap-2">
                  <img src={CalendarIcon} alt="calendar" className="w-4 h-4" />
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <h3 className="font-bold font-exo text-base sm:text-lg mb-2">{post.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{stripHtmlAndTruncate(post.content)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LastArticles;