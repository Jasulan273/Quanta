import React, { useState, useEffect } from 'react';
import BlogImage from '../../Materials/Images/banner.png';
import { NavLink } from 'react-router-dom';
import { fetchBlogPosts } from '../../Api/blog';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const postsPerPage = 3;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchBlogPosts();
        setPosts(data);
        setFilteredPosts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blog posts');
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    let result = [...posts];
    
    if (searchTerm) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPosts(result);
    setCurrentPage(1);
  }, [searchTerm, posts]);

  const categories = [
    { id: 1, title: 'Commercial', count: '15' },
    { id: 2, title: 'Office', count: '15' },
    { id: 3, title: 'Shop', count: '15' },
    { id: 4, title: 'Academy', count: '15' },
    { id: 5, title: 'Single Family', count: '15' },
  ];

  const popularPosts = [
    { id: 1, title: 'How to Start Learning Programming', image: BlogImage },
    { id: 2, title: 'Top 5 Frameworks for Web Development', image: BlogImage },
    { id: 3, title: 'Most Popular Programming Languages in 2024', image: BlogImage },
    { id: 4, title: 'How AI is Changing the World', image: BlogImage },
  ];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-[1290px] mx-auto relative">
      <div className="w-full lg:w-[75%] bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-2xl">All Articles</h1>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-[200px] lg:w-[300px]"
            />
            <button 
              className="lg:hidden bg-primary text-white p-2 rounded" 
              onClick={() => setShowSidebar(true)}
            >
              Filters
            </button>
          </div>
        </div>
        
        <div className="space-y-8">
          {currentPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={post.image || BlogImage}
                  alt={post.title}
                  className="w-full md:w-1/3 h-60 md:h-auto object-cover"
                />
                <div className="p-6 flex flex-col justify-between w-full md:w-2/3">
                  <div>
                    <h2 className="font-bold text-xl text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-600 text-sm mb-2">
                      {post.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                    </p>
                    <div className="text-xs text-gray-500 mb-4">
                      <p>By {post.author_username} | {new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <NavLink to={`/BlogPage/${post.id}`} className="text-orange-500 hover:underline mt-4 w-max">
                    <button className="text-orange-500 font-semibold hover:underline transition-colors duration-300">
                      Read
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`p-2 rounded ${currentPage === page ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      <div className={`fixed top-0 right-0 z-50 bg-white shadow-lg w-[90%] max-w-[300px] h-full p-6 transition-transform duration-300 ease-in-out transform ${showSidebar ? 'translate-x-0' : 'translate-x-full'} lg:static lg:translate-x-0 lg:w-[25%] lg:block`}>
        <div className="flex justify-between items-center lg:hidden mb-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={() => setShowSidebar(false)} className="text-2xl">&times;</button>
        </div>

        <h2 className="font-bold text-xl mt-4 mb-6 hidden lg:block">Blog Filters</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Category</h2>
            {categories.map((category) => (
              <div className="flex justify-between items-center" key={category.id}>
                <p className="hover:cursor-pointer hover:text-primary transition">{category.title}</p>
                <p>{category.count}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Popular Posts</h2>
            {popularPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center w-full h-[90px] bg-white rounded-lg transition-transform duration-300 transform hover:scale-105"
              >
                <img src={post.image} alt={post.title} className="w-[90px] h-[90px] object-cover rounded-md mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm hover:cursor-pointer hover:text-primary transition">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500">Short description...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;