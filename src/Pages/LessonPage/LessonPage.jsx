import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../../Api/api';
import ScrollProgress from '../../Components/ScrollProgress';
import LessonCompiler from '../../AI/Compiler/LessonCompiler';

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await fetch(`${API_URL}/courses/${courseId}/${lessonId}`);
        if (!response.ok) throw new Error('Failed to fetch lesson data');
        const data = await response.json();
        setLessonData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [courseId, lessonId]);

  if (loading) return <p>Loading lesson data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!lessonData) return <p>Lesson not found.</p>;

  const { name, description, content, duration, video_url, uploaded_video } = lessonData;

  return (
    <div>
      <ScrollProgress />
      <div className="container mx-auto my-16 px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">{name} - Lesson {lessonId}</h1>
          <div className="text-gray-600 text-lg">
            <p><strong>Duration:</strong> {duration || 'N/A'}</p>
            <p><strong>Description:</strong> {description || 'No description available.'}</p>
          </div>
        </div>

        {video_url || uploaded_video ? (
          <div className="relative mb-12">
            <video
              src={`${API_URL}${uploaded_video}` || video_url}
              controls
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        ) : (
          <p>No video available for this lesson.</p>
        )}

        <div
          className="bg-white p-10 rounded-lg shadow-xl"
          dangerouslySetInnerHTML={{ __html: content || '<p>No content available.</p>' }}
        />

        <div className="mt-12">
          <LessonCompiler />
        </div>

        <div className="flex justify-between my-8 text-xl">
          {parseInt(lessonId) > 1 && (
            <Link
              to={`/courses/${courseId}/lesson/${parseInt(lessonId) - 1}`}
              className="text-orange-500 font-bold"
            >
              &larr; Previous Lesson
            </Link>
          )}
          <Link
            to={`/courses/${courseId}/lesson/${parseInt(lessonId) + 1}`}
            className="text-orange-500 font-bold"
          >
            Next Lesson &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
