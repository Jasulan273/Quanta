import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { refreshToken } from '../../Api/auth'; 
import { API_URL } from '../../Api/api';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [visibleComments, setVisibleComments] = useState(2);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

  const fetchComments = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const response = await axios.get(`${API_URL}/blog/posts/${postId}/comments/`, config);
      console.log('Fetch comments response:', response.data);
      setComments(response.data.comments || []);
    } catch (err) {
      if (err.response?.status === 401 && isAuthenticated) {
        try {
          const refreshData = await refreshToken();
          localStorage.setItem('accessToken', refreshData.access);
          setIsAuthenticated(true);
          fetchComments();
        } catch (refreshErr) {
          setError('Session expired. Please log in again.');
          setIsAuthenticated(false);
          localStorage.removeItem('accessToken');
        }
      } else {
        setError('Failed to fetch comments: ' + (err.response?.data?.detail || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [postId, isAuthenticated]);

  const handleSubmit = async (e, parentId = null) => {
    e.preventDefault();
    const text = parentId ? replyContent[parentId]?.trim() : content.trim();
    if (!text) {
      setError('Comment cannot be empty.');
      return;
    }

    if (!isAuthenticated) {
      setError('Please log in to post a comment.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');

      const payload = { post: postId, content: text, parent: parentId };
      console.log('Posting comment:', { url: `${API_URL}/blog/posts/${postId}/comments/`, payload });
      const response = await axios.post(
        `${API_URL}/blog/posts/${postId}/comments/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Comment posted:', response.data);

      if (parentId) {
        setReplyContent({ ...replyContent, [parentId]: '' });
      } else {
        setContent('');
      }
      fetchComments();
    } catch (err) {
      console.error('Comment post failed:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      if (err.response?.status === 401) {
        try {
          const refreshData = await refreshToken();
          localStorage.setItem('accessToken', refreshData.access);
          handleSubmit(e, parentId);
        } catch (refreshErr) {
          setError('Session expired. Please log in again.');
          setIsAuthenticated(false);
          localStorage.removeItem('accessToken');
        }
      } else if (err.response?.status === 405) {
        setError('Posting comments is not allowed. Please check the API configuration.');
      } else {
        setError(err.response?.data?.detail || 'Failed to post comment.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleShowMore = () => {
    setVisibleComments(comments.length);
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const renderComment = (comment, level = 0) => {
    const isReply = comment.parent !== null;
    return (
      <li
        key={comment.id}
        className={`border p-4 rounded-md shadow-sm bg-white ${isReply ? `ml-${level * 4}` : ''}`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">{comment.user_username}</span>
          <span className="text-sm text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-800">{comment.content}</p>
        <div className="mt-2 text-sm text-gray-500">
          👍 {comment.likes}   👎 {comment.dislikes}  
          {isAuthenticated && (
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setReplyContent({ ...replyContent, [comment.id]: replyContent[comment.id] || '' })}
            >
              Reply
            </button>
          )}
        </div>
        {replyContent[comment.id] !== undefined && isAuthenticated && (
          <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-4 space-y-2">
            <textarea
              rows="2"
              className="w-full border rounded-md p-2 shadow-sm focus:outline-none focus:ring"
              placeholder="Write your reply..."
              value={replyContent[comment.id] || ''}
              onChange={(e) => setReplyContent({ ...replyContent, [comment.id]: e.target.value })}
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition duration-200"
              >
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
              <button
                type="button"
                className="text-gray-500 hover:underline"
                onClick={() => {
                  const { [comment.id]: _, ...rest } = replyContent;
                  setReplyContent(rest);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {comment.replies.length > 0 && (
          <ul className="mt-4 space-y-4">
            {comment.replies.map((reply) => renderComment(reply, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  const topLevelComments = comments.filter((comment) => comment.parent === null);
  const displayedComments = topLevelComments.slice(0, visibleComments);

  return (
    <div className="mt-16 container mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold mb-4">Comments</h2>

      {loading ? (
        <p>Loading comments...</p>
      ) : topLevelComments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      ) : (
        <>
          <ul className="space-y-6">
            {displayedComments.map((comment) => renderComment(comment))}
          </ul>
          {topLevelComments.length > visibleComments && (
            <button
              className="mt-4 text-blue-500 hover:underline"
              onClick={toggleShowMore}
            >
              Show more comments ({topLevelComments.length - visibleComments})
            </button>
          )}
        </>
      )}

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <textarea
            rows="4"
            className="w-full border rounded-md p-3 shadow-sm focus:outline-none focus:ring"
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition duration-200"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="mt-8 text-gray-500">
          Please <a href="/login" className="text-blue-500 hover:underline">log in</a> to leave a comment.
        </p>
      )}
      {error && isAuthenticated && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Comments;
