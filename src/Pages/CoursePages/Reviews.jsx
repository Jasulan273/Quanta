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
  const [localReviews, setLocalReviews] = useState(reviews);
  console.log(user)
  useEffect(() => {
    setLocalReviews(reviews);
    console.log(reviews)
  }, [reviews]);

  const userReview = localReviews.find((r) => r.user_username === user);
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
      const response = await axios.post(
        `${API_URL}/courses/${courseId}/reviews/`,
        { rating, feedback },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newReview = response.data;

      setLocalReviews([newReview, ...localReviews]);
      setRating(0);
      setFeedback('');
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
      await axios.delete(`${API_URL}/courses/${courseId}/reviews/${userReview.id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLocalReviews(localReviews.filter((r) => r.id !== userReview.id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <div className="flex items-center space-x-4 mb-8">
        <div className="text-5xl font-bold">{averageRating}</div>
        <p className="text-gray-500 ml-2">
          ({totalReviews} {totalReviews === 1 ? 'rating' : 'ratings'})
        </p>
      </div>

      <div className="bg-gray-100 my-8 py-8 px-8 rounded-[20px]">
        {[5, 4, 3, 2, 1].map((starRating) => (
          <div key={starRating} className="flex items-center ml-4 my-4">
            <span className="text-yellow-400 text-xl w-[120px]">
              {'⭐'.repeat(starRating)}
            </span>
            <h3 className="ml-6">{ratingPercentages[starRating - 1]}%</h3>
            <div className="bg-gray-200 w-[800px] h-[15px] ml-4 rounded-md">
              <div
                className="bg-yellow-400 h-[15px] border-none rounded-md"
                style={{ width: `${(ratingPercentages[starRating - 1] / 100) * 800}px` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Your Review</h3>
        {userReview ? (
          <div className="border rounded-lg p-4 bg-white shadow">
            <h4 className="font-bold">{userReview.user_username}</h4>
            <div className="flex items-center my-2">
              <div className="text-yellow-400 text-xl mr-2">
                {'⭐'.repeat(userReview.rating)}
              </div>
              <span className="text-gray-500 text-sm">({userReview.rating})</span>
            </div>
            <p className="text-sm text-gray-500 my-2">{userReview.created_at}</p>
            <p>{userReview.feedback}</p>
            <button
              onClick={handleDelete}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Delete Review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rating">Rating (1–5):</label>
              <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                min="1"
                max="5"
                className="block w-20 border rounded px-2 py-1"
              />
            </div>
            <div>
              <label htmlFor="feedback">Feedback:</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        )}
      </div>
      <div>
  <h3 className="text-xl font-bold mb-4">All Reviews</h3>
  <div className="space-y-4">
    {localReviews
      .filter((r) => r.user_username !== user) // исключаем свой
      .map((review) => (
        <div key={review.id} className="border rounded-lg p-4 bg-white shadow">
          <h4 className="font-bold">{review.user_username}</h4>
          <div className="flex items-center my-2">
            <div className="text-yellow-400 text-xl mr-2">
              {'⭐'.repeat(review.rating)}
            </div>
            <span className="text-gray-500 text-sm">({review.rating})</span>
          </div>
          <p className="text-sm text-gray-500 my-2">{review.created_at}</p>
          <p>{review.feedback}</p>
        </div>
      ))}
  </div>
</div>

    </div>
  );
};

export default Reviews;
