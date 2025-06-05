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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!accessToken) {
          navigate('/Auth');
          return;
        }

        const [courseResponse, lessonResponse, tasksResponse] = await Promise.all([
          axios.get(`${API_URL}/courses/${courseId}`),
          axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);
        setCourseData(courseResponse.data);
        setLessonData(lessonResponse.data);
        setTasks(tasksResponse.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/Auth');
        } else {
          setError(
            err.response?.data?.detail ||
              err.message ||
              'Failed to fetch lesson data. Please try again.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, moduleId, lessonId, navigate, accessToken]);

  useEffect(() => {
    if (lessonData?.content && contentRef.current) {
      if (!contentRef.current.shadowRoot) {
        const shadowRoot = contentRef.current.attachShadow({ mode: 'open' });

        const fixedContent = fixImageUrls(lessonData.content);
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = fixedContent;
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

  const fixImageUrls = (htmlContent) => {
    return htmlContent.replace(/src="\/media\//g, `src="${API_URL}/media/`);
  };

  const getLessonNavigation = () => {
    if (!Array.isArray(courseData?.Curriculum)) return { prev: null, next: null };
    let prev = null,
      next = null,
      foundCurrent = false;

    for (const module of courseData.Curriculum) {
      if (!Array.isArray(module.lessons) || module.lessons.length === 0) continue;

      const sortedLessons = [...module.lessons].sort((a, b) => a.lesson_id - b.lesson_id);
      for (let i = 0; i < sortedLessons.length; i++) {
        const lesson = sortedLessons[i];
        if (
          lesson.lesson_id === parseInt(lessonId) &&
          module.module_id === parseInt(moduleId)
        ) {
          foundCurrent = true;

          if (i > 0) {
            prev = {
              moduleId: module.module_id,
              lessonId: sortedLessons[i - 1].lesson_id,
            };
          } else if (courseData.Curriculum.indexOf(module) > 0) {
            const prevModule = courseData.Curriculum[courseData.Curriculum.indexOf(module) - 1];
            const prevSortedLessons = [...(prevModule.lessons || [])].sort(
              (a, b) => a.lesson_id - b.lesson_id
            );
            if (prevSortedLessons.length > 0) {
              prev = {
                moduleId: prevModule.module_id,
                lessonId: prevSortedLessons[prevSortedLessons.length - 1].lesson_id,
              };
            }
          }

          if (i < sortedLessons.length - 1) {
            next = {
              moduleId: module.module_id,
              lessonId: sortedLessons[i + 1].lesson_id,
            };
          } else if (courseData.Curriculum.indexOf(module) < courseData.Curriculum.length - 1) {
            const nextModule = courseData.Curriculum[courseData.Curriculum.indexOf(module) + 1];
            const nextSortedLessons = [...(nextModule.lessons || [])].sort(
              (a, b) => a.lesson_id - b.lesson_id
            );
            if (nextSortedLessons.length > 0) {
              next = {
                moduleId: nextModule.module_id,
                lessonId: nextSortedLessons[0].lesson_id,
              };
            }
          }

          break;
        }
      }

      if (foundCurrent) break;
    }

    return { prev, next };
  };

  const { prev, next } = getLessonNavigation();

  if (loading) return <p>Loading lesson data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!lessonData) return <p>Lesson not found.</p>;

  const { name, description, video_url, uploaded_video } = lessonData;

  return (
    <div>
      <ScrollProgress />
      <div className="container mx-auto my-16 px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">
            {name} - Lesson {lessonId}
          </h1>
          <div className="text-gray-600 text-lg">
            <p>
              <strong>Description:</strong> {description || 'No description available.'}
            </p>
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
        <div ref={contentRef} className="bg-white p-10 rounded-lg shadow-xl content_block">
          {lessonData?.content && (
            <div
              dangerouslySetInnerHTML={{ __html: fixImageUrls(lessonData.content) }}
              className="selectable-content"
            />
          )}
        </div>
        <HighlightChat contentRef={contentRef} />

        {tasks.length > 0 && (
          <div className="mt-12">
            {tasks.map((task) => (
              <div key={task.id} className="mb-10">
                {task.type === 'mcq' ? (
                  <QuizTask task={task} />
                ) : task.type === 'code' ? (
                  <LessonCompiler task={task} />
                ) : null}
              </div>
            ))}
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

function QuizTask({ task }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id) => {
    if (!submitted) setSelected(id);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-2">{task.title}</h3>
      {task.description && <p className="mb-2">{task.description}</p>}
      <div className="mb-4">
        {task.options.map((option) => (
          <button
            key={option.id}
            className={`block w-full text-left mb-2 p-3 rounded border 
              ${submitted
                ? option.is_correct
                  ? 'bg-green-200 border-green-500'
                  : selected === option.id
                  ? 'bg-red-200 border-red-500'
                  : ''
                : selected === option.id
                ? 'bg-blue-100 border-blue-400'
                : 'border-gray-300'
              }`}
            onClick={() => handleSelect(option.id)}
            disabled={submitted}
          >
            {option.text}
          </button>
        ))}
      </div>
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected == null}
          className="bg-orange-500 text-white px-4 py-2 rounded font-bold"
        >
          Submit
        </button>
      )}
      {submitted && (
        <div>
          {task.options.find((o) => o.is_correct)?.id === selected ? (
            <span className="text-green-600 font-bold">Correct!</span>
          ) : (
            <span className="text-red-600 font-bold">Incorrect</span>
          )}
        </div>
      )}
    </div>
  );
}

export default LessonPage;