import React, { useState, useEffect } from 'react';
import BlogImage from '../../Materials/Images/banner.png';
import { NavLink } from 'react-router-dom';
import { fetchBlogPosts } from '../../Api/blog';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchBlogPosts();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blog posts');
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

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

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-container mx-auto py-10 flex">
      <div className="flex-grow mr-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">All Articles</h1>
          <input 
            type="text" 
            placeholder="Search posts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-1/3"
          />
        </div>
        <div className="w-[100%] space-y-8">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex">
                <img 
                  src={post.image || BlogImage} 
                  alt={post.title} 
                  className="w-1/3 h-inherit object-cover transition-transform duration-300 ease-in-out transform" 
                />
                <div className="p-6 flex flex-col justify-between w-2/3">
                  <div>
                    <h2 className="font-bold text-xl text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-600 text-sm mb-2">
                      {post.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                    </p>
                    <div className="text-xs text-gray-500 mb-4">
                      <p>By {post.author_username} | {new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <NavLink to={`/BlogPage/${post.id}`} className="text-orange-500 hover:underline">
                    <button className="text-orange-500 font-semibold hover:underline mt-4 transition-colors duration-300">Read</button>
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[25%] h-full rounded-lg mt-6">
        <div className="space-y-4 mb-8">
          <h2 className="font-bold text-xl mb-4">Category</h2>
          {categories.map((category) => (
            <div className='flex justify-between items-center' key={category.id}>
              <p className='hover:cursor-pointer hover:text-primary transition'>{category.title}</p>
              <p>{category.count}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h2 className="font-bold text-xl mb-4">Popular Posts</h2>
          {popularPosts.map((post) => (
            <div key={post.id} className="flex items-center w-[270px] h-[90px] bg-white rounded-lg transition-transform duration-300 transform hover:scale-105">
              <img src={post.image} alt={post.title} className="w-[90px] h-[90px] object-cover rounded-md mr-4" />
              <div>
                <h3 className="font-semibold text-gray-800 text-sm hover:cursor-pointer hover:text-primary transition">{post.title}</h3>
                <p className="text-xs text-gray-500">Short description...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;