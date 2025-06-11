import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScrollProgress from '../../Components/ScrollProgress';
import LessonCompiler from '../../AI/Compiler/LessonCompiler';
import HighlightChat from './HighlightChat';
import { API_URL } from '../../Api/api';

const LessonPage = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [hintData, setHintData] = useState({});
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        if (!accessToken) {
          navigate('/Auth');
          return;
        }

        const courseRes = await axios.get(`${API_URL}/courses/${courseId}`);
        const lessonRes = await axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const tasksRes = await axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const codeTasks = tasksRes.data.filter(task => task.type === 'code');
        const hintData = {};
        const hintPromises = codeTasks.map(async (task) => {
          try {
            const hintRes = await axios.get(
              `${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/${task.id}/hint`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            hintData[task.id] = hintRes.data;
          } catch (err) {
            hintData[task.id] = { remaining: 0, limit: 0, next_available_in_minutes: 0 };
          }
        });
        await Promise.all(hintPromises);

        setCourseData(courseRes.data);
        setLessonData(lessonRes.data);
        setTasks(tasksRes.data || []);
        setHintData(hintData);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/Auth');
        } else {
          setError(err.response?.data?.detail || err.message || 'Failed to fetch lesson data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (lessonId && moduleId && courseId) {
      fetchData();
    }
  }, [courseId, moduleId, lessonId, navigate]);

  useEffect(() => {
    if (lessonData?.content && contentRef.current) {
      if (!contentRef.current.shadowRoot) {
        const shadowRoot = contentRef.current.attachShadow({ mode: 'open' });
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = fixImageUrls(lessonData.content);
        contentDiv.className = 'selectable-content';
        shadowRoot.appendChild(contentDiv);

        const style = document.createElement('style');
        style.textContent = `
          .selectable-content {
            user-select: text;
          }
          .selectable-content ::selection {
            background: #3b82f6;
            color: white;
          }
        `;
        shadowRoot.appendChild(style);

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

  const fixImageUrls = (html) => html.replace(/src="\/media\//g, `src="${API_URL}/media/`);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:.*v=|v\/|embed\/)||youtu\.be\/)([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const getLessonNavigation = () => {
    if (!Array.isArray(courseData?.Curriculum)) return { prev: null, next: null };
    let prev = null, next = null, found = false;

    for (const module of courseData.Curriculum) {
      const lessons = [...(module.lessons || [])].sort((a, b) => a.lesson_id - b.lesson_id);
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        if (lesson.lesson_id === parseInt(lessonId)) {
          found = true;
          if (i > 0) prev = { moduleId: module.module_id, lessonId: lessons[i - 1].lesson_id };
          if (i < lessons.length - 1) next = { moduleId: module.module_id, lessonId: lessons[i + 1].lesson_id };
          break;
        }
      }
      if (found) break;
    }

    return { prev, next };
  };

  const handleVideoError = () => setVideoError('Failed to load video. Please try again later.');

  const handleAnswerChange = (exercise_id, selected_option) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.exercise_id !== exercise_id);
      return [...filtered, { exercise_id, selected_option }];
    });
  };

  const handleBulkSubmit = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.post(
        `${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/submit-answer/`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.results || [];
      const resultMap = {};
      data.forEach(r => {
        resultMap[r.exercise_id] = r;
      });
      setResults(resultMap);
    } catch (err) {
      console.error('Bulk submission failed', err);
    }
  };

  const handleHintRequest = async (taskId, includeCode, submittedCode) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.post(
        `${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/${taskId}/hint/`,
        { include_code: includeCode, submitted_code: submittedCode },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setHintData((prev) => ({
        ...prev,
        [taskId]: {
          remaining: response.data.remaining || prev[taskId]?.remaining,
          limit: response.data.limit || prev[taskId]?.limit,
          next_available_in_minutes: response.data.next_available_in_minutes || prev[taskId]?.next_available_in_minutes,
        },
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const codeTasks = tasks.filter(task => task.type === 'code');
  const mcqTasks = tasks.filter(task => task.type === 'mcq');
  const { prev, next } = getLessonNavigation();

  if (loading) return <p>Loading lesson data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!lessonData) return <p>Lesson not found.</p>;

  const { name, description, video_url, uploaded_video } = lessonData;
  const videoSrc = uploaded_video ? `${API_URL}${uploaded_video}` : video_url;
  const youtubeEmbedUrl = getYouTubeEmbedUrl(video_url);

  return (
    <div>
      <ScrollProgress />
      <div className="container mx-auto my-16 px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">{name} - Lesson {lessonId}</h1>
          <div className="text-gray-600 text-lg">
            <div><strong>Description:</strong> {description || 'No description available.'}</div>
          </div>
        </div>
        {(video_url || uploaded_video) && (videoSrc || youtubeEmbedUrl) && (
          <div className="relative mb-12">
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-96 rounded-lg shadow-lg"
              />
            ) : (
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                onError={handleVideoError}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            )}
            {videoError && <p className="text-red-500 text-center mt-4">{videoError}</p>}
          </div>
        )}
        <div ref={contentRef} className="bg-white p-10 rounded-lg shadow-xl content_block" />
        <HighlightChat contentRef={contentRef} />

        {tasks.length > 0 && (
          <div className="mt-12">
            {codeTasks.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-orange-500">Coding Exercises</h2>
                <LessonCompiler
                  tasks={codeTasks}
                  courseId={courseId}
                  moduleId={moduleId}
                  lessonId={lessonId}
                  hintData={hintData}
                  onHintRequest={handleHintRequest}
                />
              </div>
            )}
            {mcqTasks.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-orange-500">Multiple Choice Questions</h2>
                {mcqTasks.map((task) => (
                  <div key={task.id} className="bg-gray-100 p-6 rounded-xl shadow mb-6">
                    <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                    {task.description && <p className="mb-4">{task.description}</p>}
                    <QuizTask task={task} onAnswerChange={handleAnswerChange} result={results[task.id]} />
                  </div>
                ))}
                <button
                  onClick={handleBulkSubmit}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold"
                >
                  Submit All Answers
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between my-8 text-xl">
          {prev && (
            <Link
              to={`/courses/${courseId}/modules/${prev.moduleId}/lesson/${prev.lessonId}`}
              className="text-orange-500 font-bold"
            >
              ← Previous Lesson
            </Link>
          )}
          {next && (
            <Link
              to={`/courses/${courseId}/modules/${next.moduleId}/lesson/${next.lessonId}`}
              className="text-orange-500 font-bold"
            >
              Next Lesson →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

function QuizTask({ task, onAnswerChange, result }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id) => {
    if (!submitted) {
      setSelected(id);
      onAnswerChange(task.id, id);
    }
  };

  useEffect(() => {
    if (result) setSubmitted(true);
  }, [result]);

  return (
    <div>
      <div className="mb-4">
        {task.options.map((option) => {
          let className = 'block w-full text-left mb-2 p-3 rounded border ';
          if (submitted) {
            if (option.id === result?.selected_option && !result?.is_correct) {
              className += 'bg-red-200 border-red-500';
            } else if (option.is_correct) {
              className += 'bg-green-200 border-green-500';
            } else {
              className += 'border-gray-300';
            }
          } else {
            className += selected === option.id ? 'bg-blue-100 border-blue-400' : 'border-gray-300';
          }

          return (
            <button
              key={option.id}
              className={className}
              onClick={() => handleSelect(option.id)}
              disabled={submitted}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LessonPage;