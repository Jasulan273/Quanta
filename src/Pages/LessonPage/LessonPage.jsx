import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../../Api/api';
import ScrollProgress from '../../Components/ScrollProgress';
import LessonCompiler from '../../AI/Compiler/LessonCompiler';
import Chat from '../../AI/Сhat/Chat';

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);
  
  const tasks = [
    {
      id: 1,
      name: "Sum of Two Numbers",
      description: "Write a function that takes two numbers and returns their sum.",
      input: "3, 5",
      expected_output: "8"
    },
  ];

  const task = tasks.find(task => task.id === Number(lessonId)) || null;

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

  useEffect(() => {
    if (lessonData?.content && contentRef.current) {
      if (!contentRef.current.shadowRoot) {
        const shadowRoot = contentRef.current.attachShadow({ mode: 'open' });

        const fixedContent = fixImageUrls(lessonData.content);
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = fixedContent;
        shadowRoot.appendChild(contentDiv);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://quant.up.railway.app/static/ckeditor/contents.css';
        shadowRoot.appendChild(link);

        setTimeout(() => {
          contentDiv.querySelectorAll('img').forEach((img) => {
            img.style.removeProperty('aspect-ratio');
            img.removeAttribute('width');
            img.removeAttribute('height');
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.objectFit = 'contain';
          });
        }, 100);
      }
    }
  }, [lessonData]);

  const fixImageUrls = (htmlContent) => {
    return htmlContent.replace(/src="\/media\//g, `src="https://quant.up.railway.app/media/`);
  };

  if (loading) return <p>Loading lesson data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!lessonData) return <p>Lesson not found.</p>;

  const { name, description, video_url, uploaded_video } = lessonData;

  return (
    <div>
      <ScrollProgress />
      <div className="container mx-auto my-16 px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">{name} - Lesson {lessonId}</h1>
          <div className="text-gray-600 text-lg">
            <p><strong>Description:</strong> {description || 'No description available.'}</p>
          </div>
        </div>

        {(video_url || uploaded_video) && (
          <div className="relative mb-12">
            <video
              src={uploaded_video ? `${API_URL}${uploaded_video}` : video_url}
              controls
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        <div ref={contentRef} className="bg-white p-10 rounded-lg shadow-xl content_block" />

        <div className="mt-12">
          <LessonCompiler task={task} />
        </div>

        <Chat />

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
