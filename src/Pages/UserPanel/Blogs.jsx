import React from 'react';
import { Link } from 'react-router-dom';
import { deleteBlog } from '../../Api/blog';

const Blogs = ({ blogs }) => {
  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(blogId);
        window.location.reload();
      } catch (err) {
        alert(`Failed to delete blog: ${err.message}`);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Blogs</h2>
        <Link
          to="/create-blog"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Create Blog
        </Link>
      </div>
      {blogs.length === 0 ? (
        <p className="text-gray-600">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
              <p className="text-gray-600 mt-2">{blog.short_description}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/edit-blog/${blog.id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all duration-300"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;