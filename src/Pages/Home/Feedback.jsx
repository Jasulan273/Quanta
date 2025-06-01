import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Api/api";

const Feedback = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/site-reviews/`);
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch reviews");
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!rating || !feedbackText.trim()) {
      setError("Please provide both rating and feedback");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User not authenticated");

      const response = await axios.post(
        `${API_URL}/site-reviews/`,
        {
          rating,
          feedback: feedbackText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews([response.data, ...reviews]);
      setShowPopup(false);
      setRating(0);
      setFeedbackText("");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit review");
    }
  };

  // Проверка, писал ли пользователь отзыв
  const hasUserReviewed = user && reviews.some((r) => r.username === user.username);

  if (loading) return <div className="text-center py-10">Loading reviews...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-7xl mx-auto my-8 sm:my-10 px-4 pt-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl">Student feedbacks</h2>
          <p className="text-gray-500 text-sm sm:text-base">
            What Students Say About Academy LMS
          </p>
        </div>
        {user && !hasUserReviewed && (
          <button
            onClick={() => setShowPopup(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Leave Feedback
          </button>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10">No reviews yet. Be the first to leave feedback!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-100 p-6 rounded-3xl relative h-96 flex flex-col">
              <div className="absolute top-0 left-0 w-full h-12 flex justify-center items-center text-white"
                style={{
                  backgroundColor:
                    review.rating <= 2
                      ? "#ef4444" // red-500
                      : review.rating === 3
                      ? "#eab308" // yellow-500
                      : "#22c55e", // green-500
                }}
              >
                <h3>
                  {review.rating <= 2
                    ? "Needs Improvement"
                    : review.rating === 3
                    ? "Average"
                    : "Great Experience!"}
                </h3>
              </div>

              <div className="flex mb-4 mt-14">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 transition-colors duration-200 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm flex-grow">{review.feedback}</p>
              <div className="mt-4">
                <h4 className="font-bold">{review.username}</h4>
                <p className="text-sm text-gray-500 capitalize">{review.role}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Leave Your Feedback</h3>

            <div className="mb-4">
              <label className="block mb-2">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`text-2xl text-gray-300 relative transition-colors duration-200
                      ${hoverRating >= star ? "text-yellow-400" : ""}
                      ${!hoverRating && rating >= star ? "text-yellow-400" : ""}
                    `}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    type="button"
                    aria-label={`${star} Star`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2">Your Feedback</label>
              <textarea
                className="w-full p-2 border rounded"
                rows="4"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your experience..."
              ></textarea>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowPopup(false);
                  setError(null);
                  setRating(0);
                  setHoverRating(0);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={submitReview}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
