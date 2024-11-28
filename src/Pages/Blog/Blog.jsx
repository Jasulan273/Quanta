import React, { useState } from 'react';
import BlogImage from '../../Materials/Images/banner.png';
import { NavLink } from 'react-router-dom';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const posts = [
    {
      id: 1,
      title: 'How AI is Changing the World',
      description: 'A brief overview of how AI is influencing various industries.',
      date: 'October 1, 2024',
      author: 'John Doe',
      reads: 150,
      comments: 10,
      likes: 25,
      image: BlogImage
    },
    {
      id: 2,
      title: 'Top 10 Programming Languages',
      description: 'A rundown of the most popular programming languages in 2024.',
      date: 'October 2, 2024',
      author: 'Jane Smith',
      reads: 200,
      comments: 20,
      likes: 30,
      image: BlogImage
    },
    {
      id: 3,
      title: 'The Future of Work with AI',
      description: 'How AI will change the job market.',
      date: 'October 3, 2024',
      author: 'Alice Johnson',
      reads: 175,
      comments: 15,
      likes: 18,
      image: BlogImage
    },
    {
      id: 4,
      title: 'Innovations in Programming',
      description: 'Overview of new technologies and their applications.',
      date: 'October 4, 2024',
      author: 'Michael Brown',
      reads: 90,
      comments: 5,
      likes: 10,
      image: BlogImage
    },
    {
      id: 5,
      title: 'Mobile App Development',
      description: 'Tips and recommendations for beginner developers.',
      date: 'October 5, 2024',
      author: 'Emily Davis',
      reads: 120,
      comments: 8,
      likes: 14,
      image: BlogImage
    },
    {
      id: 6,
      title: 'Web Application Security',
      description: 'How to protect your data and applications.',
      date: 'October 6, 2024',
      author: 'Robert Wilson',
      reads: 80,
      comments: 3,
      likes: 7,
      image: BlogImage
    },
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
        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex">
                <img src={post.image} alt={post.title} className="w-1/3 h-[200px] object-cover transition-transform duration-300 ease-in-out transform hover:scale-110" />
                <div className="p-6 flex flex-col justify-between w-2/3">
                  <div>
                    <h2 className="font-bold text-xl text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-600 text-sm mb-2">{post.description}</p>
                    <div className="text-xs text-gray-500 mb-4">
                      <p>By {post.author} | {post.date}</p>
                      <p>{post.reads} Reads | {post.comments} Comments | {post.likes} Likes</p>
                    </div>
                  </div>
                  <NavLink to="/BlogPage" className="text-orange-500 hover:underline">
                <button className="text-orange-500 font-semibold hover:underline mt-4 transition-colors duration-300">Read</button>
          </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/4 h-full bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-xl mb-4">Popular Posts</h2>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <div key={post.id} className="flex items-center bg-white p-4 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105">
              <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded-md mr-4" />
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{post.title}</h3>
                <p className="text-xs text-gray-500">Short description...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;
