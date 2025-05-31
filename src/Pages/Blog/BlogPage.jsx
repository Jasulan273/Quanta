import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ScrollProgress from '../../Components/ScrollProgress';
import BlogImage from '../../Materials/Images/BlogImage.png';
import { fetchBlogPostById } from '../../Api/blog';
import Comments from './Comments';

const BlogPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        console.log('Attempting to fetch post with ID:', id);
        
        if (!id || isNaN(parseInt(id))) {
          throw new Error('Invalid post ID');
        }
        
        const postId = parseInt(id);
        console.log('Formatted post ID:', postId);
        
        const postData = await fetchBlogPostById(postId);
        console.log('Received post data:', postData);
        
        if (!postData) {
          throw new Error(`Post with ID ${postId} not found`);
        }
        
        setPost(postData);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', {
          message: err.message,
          response: err.response,
          stack: err.stack
        });
        setError(`Failed to load post: ${err.response?.status === 404 ? 'Post not found' : err.message}`);
        setLoading(false);
      }
    };
    
    loadPost();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not found</div>;

  return (
    <div>
      <ScrollProgress />
      <div className="container mx-auto my-16 px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 text-lg">
            <p><strong>Author:</strong> {post.author_username}</p>
            <p><strong>Date:</strong> {new Date(post.created_at).toLocaleDateString('en-US')}</p>
          </div>
        </div>

        <div className="relative mb-12">
          <img 
            src={post.image || BlogImage} 
            alt={post.title} 
            className="w-full h-[600px] object-cover rounded-lg shadow-lg" 
            onError={(e) => { e.target.src = BlogImage; }}
          />
        </div>
        
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      <Comments postId={post.id} />
    </div>
  );
};

export default BlogPage;