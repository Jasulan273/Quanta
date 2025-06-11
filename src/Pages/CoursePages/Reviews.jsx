import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../Api/api';

const Reviews = ({ reviews, user }) => {
  const { courseId } = useParams();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [localReviews, setLocalReviews] = useState(reviews || []);

  useEffect(() => {
    setLocalReviews(reviews || []);
  }, [reviews]);
  
  const userReview = user?.username
    ? localReviews.find((r) => r.user_username?.trim() === user.username.trim())
    : null;

  console.log('User:', user);
  console.log('User Review:', userReview);
  console.log('Reviews:', localReviews);

  const totalReviews = localReviews.length;
  const averageRating = totalReviews
    ? (localReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const ratingCounts = [1, 2, 3, 4, 5].map(
    (star) => localReviews.filter((r) => r.rating === star).length
  );
  const ratingPercentages = ratingCounts.map((count) =>
    totalReviews ? ((count / totalReviews) * 100).toFixed(0) : 0
  );

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!rating || !feedback.trim()) {
    setError('Please provide a rating and feedback.');
    return;
  }
  setSubmitting(true);
  setError(null);

  try {
    const accessToken = localStorage.getItem('accessToken');
    await axios.post(
      `${API_URL}/courses/${courseId}/`,
      { rating, feedback },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );


    window.location.reload();
  } catch (err) {
    setError('Failed to submit review.');
  } finally {
    setSubmitting(false);
  }
};


  const handleDelete = async () => {
    if (!userReview) return;
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/courses/${courseId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLocalReviews(localReviews.filter((r) => r.id !== userReview.id));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete review.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <div className="text-5xl font-bold">{averageRating}</div>
          <div>
            <div className="text-yellow-400 text-2xl">
              {'⭐'.repeat(Math.round(averageRating))}
            </div>
            <p className="text-gray-500">
              ({totalReviews} {totalReviews === 1 ? 'rating' : 'ratings'})
            </p>
          </div>
        </div>

        <div className="w-full md:w-2/3 bg-gray-100 p-4 sm:p-6 rounded-xl">
          {[5, 4, 3, 2, 1].map((starRating) => (
            <div key={starRating} className="flex items-center my-2">
              <span className="text-yellow-400 text-sm w-16">
                {starRating} ⭐
              </span>
              <div className="flex-1 mx-2 bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-yellow-400 h-3 rounded-full"
                  style={{ width: `${ratingPercentages[starRating - 1]}%` }}
                />
              </div>
              <span className="text-sm w-10 text-right">
                {ratingPercentages[starRating - 1]}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4">Your Review</h3>
        {user ? (
          userReview ? (
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{userReview.user_username}</h4>
                  <div className="flex items-center my-1">
                    <div className="text-yellow-400 text-lg">
                      {'⭐'.repeat(userReview.rating)}
                    </div>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(userReview.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2 text-gray-700">{userReview.feedback}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-auto">
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="block w-full sm:w-32 border rounded-md px-3 py-2"
                  >
                    <option value="0">Select</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} ⭐
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback
                  </label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="3"
                    className="block w-full border rounded-md px-3 py-2"
                    placeholder="Share your experience..."
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          )
        ) : (
          <p className="text-gray-500">Please log in to submit a review.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">All Reviews</h3>
        {localReviews.filter((r) => r.user_username !== user?.username).length === 0 ? (
          <p className="text-gray-500">No other reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {localReviews
              .filter((r) => r.user_username !== user?.username)
              .map((review) => (
                <div key={review.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between">
                    <h4 className="font-bold">{review.user_username}</h4>
                    <span className="text-gray-500 text-sm">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-yellow-400 text-lg my-1">
                    {'⭐'.repeat(review.rating)}
                  </div>
                  <p className="text-gray-700 mt-1">{review.feedback}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;