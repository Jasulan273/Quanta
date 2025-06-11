import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../Api/api';

const FinalExam = ({ user }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Access token not found");
          return;
        }

        const examRes = await fetch(`${API_URL}/courses/${courseId}/final-exam/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!examRes.ok) throw new Error("Unauthorized");
        const examJson = await examRes.json();
        setExamData(examJson);

        const attemptsRes = await fetch(`${API_URL}/courses/${courseId}/final-exam/attempts/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!attemptsRes.ok) throw new Error("Unauthorized");
        const attemptsJson = await attemptsRes.json();
        setAttempts(attemptsJson);

        const activeAttempt = attemptsJson.find((a) => !a.is_completed);
        if (activeAttempt) {
          setAttempt(activeAttempt);
          const startTime = new Date(activeAttempt.started_at).getTime();
          const duration = examJson.duration_minutes * 60 * 1000;
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, duration - elapsed);
          setTimeLeft(Math.floor(remaining / 1000));
        }
      } catch {
        setError("Session error or API unavailable");
      }
    };

    if (user) fetchAll();
  }, [user, courseId]);

  const handleSubmit = useCallback(async () => {
    if (!attempt || attempt.is_completed) return;
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/courses/${courseId}/final-exam/submit-answer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit answers');
      }
      const data = await response.json();
      setAttempt({ ...attempt, is_completed: true, score: data.score });
      setTimeLeft(0);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [attempt, courseId, answers]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || !attempt || attempt.is_completed) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, attempt, handleSubmit]);

  const handleStartAttempt = async () => {
    if (attempts.length >= examData.max_attempts) {
      setInfoMsg('No more attempts available');
      return;
    }
    if (attempt && !attempt.is_completed) {
      setInfoMsg('You already have an unfinished attempt');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/courses/${courseId}/final-exam/start/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      if (!response.ok) throw new Error("Failed to start attempt");
      const data = await response.json();
      setAttempt(data);
      setTimeLeft(examData.duration_minutes * 60);
      setAnswers({});
      setError(null);
      setInfoMsg(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: [optionId] }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (error) return <div className="text-center text-red-600 p-6 min-h-[200px]">{error}</div>;
  if (!examData) return <div className="p-8 text-gray-500">Loading exam...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-4">Final Exam: {examData.title}</h2>

      {infoMsg && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded">
          {infoMsg}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Past Attempts:</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">#</th>
              <th className="border px-4 py-2 text-left">Completed</th>
              <th className="border px-4 py-2 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a, index) => (
                <tr key={a.id} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{a.is_completed ? 'Yes' : 'No'}</td>
                  <td className="border px-4 py-2">{typeof a.score === 'number' ? a.score : '-'}/100</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {attempt && !attempt.is_completed && (
        <div className="space-y-6">
          <div className="mb-6 text-right text-sm text-gray-600">
            Time Left: <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>
          {examData.questions.map((question) => (
            <div key={question.id} className="p-4 border rounded">
              <p className="font-medium text-gray-800 mb-2">{question.text}</p>
              {question.options.map((option) => (
                <label key={option.id} className="block mb-1">
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={option.id}
                    checked={answers[question.id]?.includes(option.id)}
                    onChange={() => handleAnswerChange(question.id, option.id)}
                    disabled={isSubmitting}
                    className="mr-2"
                  />
                  {option.text}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
            disabled={isSubmitting}
          >
            Submit Exam
          </button>
        </div>
      )}

      {attempt && attempt.is_completed && (
        <div className="mb-6 border p-4 rounded bg-green-50">
          <p className="font-semibold text-green-700 text-lg">Exam Completed!</p>
          <p className="text-gray-800">Score: <span className="font-bold">{attempt.score} / {examData.max_score}</span></p>
          {attempts.length < examData.max_attempts && (
            <button
              onClick={handleStartAttempt}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isSubmitting}
            >
              Retry Exam
            </button>
          )}
        </div>
      )}

      {!attempt && (
        <button
          onClick={handleStartAttempt}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          Start Exam
        </button>
      )}

      <button
        onClick={() => navigate(`/courses/${courseId}`)}
        className="w-full mt-8 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
      >
        Back to Course
      </button>
    </div>
  );
};

export default FinalExam;
