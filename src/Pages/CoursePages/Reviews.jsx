import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Api/api';

const Reviews = ({ reviews }) => {
  const { courseId } = useParams();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [localReviews, setLocalReviews] = useState(reviews);

  // Placeholder for current user's username (backend should provide)
  const currentUser = 'Current User'; // TODO: Fetch from /auth/me/ or similar

  // Check if user has already reviewed
  const hasReviewed = localReviews.some((review) => review.user_username === currentUser);

  // Compute average rating and star distribution
  const totalReviews = localReviews.length;
  const averageRating = totalReviews
    ? (localReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : 0;
  const ratingCounts = Array(5)
    .fill(0)
    .map((_, i) => localReviews.filter((review) => review.rating === 5 - i).length);
  const ratingPercentages = ratingCounts.map((count) =>
    totalReviews ? ((count / totalReviews) * 100).toFixed(0) : 0
  );

  const handleRating = (star) => {
    setRating(star);
  };

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
      if (!accessToken) {
        setError('Please log in to submit a review.');
        window.location.href = '/Auth';
        return;
      }

      const response = await axios.post(
        `${API_URL}/courses/${courseId}/`,
        { rating, feedback },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Review submitted:', response.data);

      // Optimistic update
      const newReview = response.data.id
        ? response.data
        : {
            id: Date.now(),
            user_username: currentUser,
            rating,
            feedback,
            created_at: new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          };
      setLocalReviews([newReview, ...localReviews]);
      setRating(0);
      setFeedback('');
    } catch (err) {
      console.error('Submit error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in.');
        window.location.href = '/Auth';
      } else {
        setError(
          err.response?.data?.detail ||
            err.message ||
            'Failed to submit review. Please try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      <div className="flex items-center space-x-4 mb-8">
        <div className="text-5xl font-bold">{averageRating}</div>
        <div className="flex items-center">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xl ${
                  i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-400'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
          <p className="text-gray-500">
            ({totalReviews} {totalReviews === 1 ? 'rating' : 'ratings'})
          </p>
        </div>
      </div>

      <div className="bg-gray-100 my-8 py-8 px-8 rounded-[20px]">
        {[5, 4, 3, 2, 1].map((starRating, index) => (
          <div key={index} className="flex flex-row items-center ml-4 my-8">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xl ${
                  i < starRating ? 'text-yellow-400' : 'text-gray-400'
                }`}
              >
                ⭐
              </span>
            ))}
            <h3 className="ml-2">{ratingPercentages[5 - starRating]}%</h3>
            <div className="bg-gray-200 w-[800px] h-[15px] ml-4 rounded-md">
              <div
                className="bg-yellow-400 h-[15px] border-none rounded-md"
                style={{ width: `${(ratingPercentages[5 - starRating] / 100) * 800}px` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
        {hasReviewed ? (
          <p className="text-gray-500">You have already submitted a review.</p>
        ) : (
          <>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-4">
                <label className="mr-4">Rating:</label>
                {[...Array(5)].map((_, i) => {
                  const star = i + 1;
                  return (
                    <span
                      key={star}
                      className={`text-xl cursor-pointer ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-400'
                      }`}
                      onClick={() => handleRating(star)}
                    >
                      ⭐
                    </span>
                  );
                })}
              </div>
              <textarea
                className="w-full p-4 border rounded-lg mb-4"
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about the course..."
                disabled={submitting}
              />
              <button
                type="submit"
                className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </>
        )}
      </div>

      <div className="space-y-4">
        {totalReviews ? (
          localReviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <h4 className="font-bold">{review.user_username}</h4>
              <div className="flex flex-row items-center my-2">
                <h2>Rating:</h2>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-400'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 my-2">{review.created_at}</p>
              <p>{review.feedback}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;