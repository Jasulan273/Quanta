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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken || !courseId || !moduleId || !lessonId) return;

      try {
        const [courseResponse, lessonResponse, tasksResponse] = await Promise.all([
          axios.get(`${API_URL}/courses/${courseId}`),
          axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
        ]);

        setCourseData(courseResponse.data);
        setLessonData(lessonResponse.data);
        setTasks(tasksResponse.data || []);
      } catch (err) {
        if (err.response?.status === 401) navigate('/Auth');
        else setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, moduleId, lessonId]);

  useEffect(() => {
    if (lessonData?.content && contentRef.current && !contentRef.current.shadowRoot) {
      const shadowRoot = contentRef.current.attachShadow({ mode: 'open' });
      const fixedContent = lessonData.content.replace(/src="\/media\//g, `src="${API_URL}/media/`);
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = fixedContent;
      contentDiv.className = 'selectable-content';
      shadowRoot.appendChild(contentDiv);

      const style = document.createElement('style');
      style.textContent = `
        .selectable-content { user-select: text; }
        .selectable-content ::selection { background: #3b82f6; color: white; }
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
  }, [lessonData]);

  const getLessonNavigation = () => {
    if (!Array.isArray(courseData?.Curriculum)) return { prev: null, next: null };
    let prev = null, next = null, found = false;

    for (const module of courseData.Curriculum) {
      const sorted = [...(module.lessons || [])].sort((a, b) => a.lesson_id - b.lesson_id);
      for (let i = 0; i < sorted.length; i++) {
        const l = sorted[i];
        if (l.lesson_id === parseInt(lessonId) && module.module_id === parseInt(moduleId)) {
          found = true;
          if (i > 0) prev = { moduleId: module.module_id, lessonId: sorted[i - 1].lesson_id };
          else if (courseData.Curriculum.indexOf(module) > 0) {
            const prevModule = courseData.Curriculum[courseData.Curriculum.indexOf(module) - 1];
            const lessons = [...(prevModule.lessons || [])].sort((a, b) => a.lesson_id - b.lesson_id);
            if (lessons.length > 0) prev = { moduleId: prevModule.module_id, lessonId: lessons[lessons.length - 1].lesson_id };
          }
          if (i < sorted.length - 1) next = { moduleId: module.module_id, lessonId: sorted[i + 1].lesson_id };
          else if (courseData.Curriculum.indexOf(module) < courseData.Curriculum.length - 1) {
            const nextModule = courseData.Curriculum[courseData.Curriculum.indexOf(module) + 1];
            const lessons = [...(nextModule.lessons || [])].sort((a, b) => a.lesson_id - b.lesson_id);
            if (lessons.length > 0) next = { moduleId: nextModule.module_id, lessonId: lessons[0].lesson_id };
          }
          break;
        }
      }
      if (found) break;
    }

    return { prev, next };
  };

  const codeTasks = tasks.filter(t => t.type === 'code');
  const mcqTasks = tasks.filter(t => t.type === 'mcq');
  const { prev, next } = getLessonNavigation();
  const { name, description, video_url, uploaded_video } = lessonData || {};
  const videoSrc = uploaded_video ? `${API_URL}${uploaded_video}` : video_url;

  return loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
    <div>
      <ScrollProgress />
      <div className="container mx-auto my-16 px-4">
        <h1 className="text-4xl font-bold mb-4">{name}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        {(video_url || uploaded_video) && (
          <div className="mb-10">
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              onError={() => setVideoError('Failed to load video')}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {videoError && <p className="text-red-500 mt-2">{videoError}</p>}
          </div>
        )}
        <div ref={contentRef} className="bg-white p-10 rounded-lg shadow-xl" />
        <HighlightChat contentRef={contentRef} />
        {codeTasks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">Coding Exercises</h2>
            <LessonCompiler
              tasks={codeTasks}
              courseId={courseId}
              moduleId={moduleId}
              lessonId={lessonId}
              hintData={hintData}
              onHintRequest={() => {}}
            />
          </div>
        )}
        {mcqTasks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">MCQs</h2>
            {mcqTasks.map((task) => (
              <div key={task.id} className="mb-6 bg-gray-100 p-4 rounded-xl">
                <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                <p className="mb-3">{task.description}</p>
                {task.options.map((option) => (
                  <button
                    key={option.id}
                    className="block w-full text-left p-3 mb-2 rounded border border-gray-300 hover:bg-blue-50"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between mt-10">
          {prev && <Link to={`/courses/${courseId}/modules/${prev.moduleId}/lesson/${prev.lessonId}`} className="text-orange-500">← Previous</Link>}
          {next && <Link to={`/courses/${courseId}/modules/${next.moduleId}/lesson/${next.lessonId}`} className="text-orange-500">Next →</Link>}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
