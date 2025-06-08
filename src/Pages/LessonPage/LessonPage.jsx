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
      try {
        if (!accessToken) {
          navigate('/Auth');
          return;
        }

        const [courseResponse, lessonResponse, tasksResponse, ...hintResponses] = await Promise.all([
          axios.get(`${API_URL}/courses/${courseId}`),
          axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          ...tasks.map(task =>
            axios.get(`${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/${task.id}/hint/`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            }).catch(() => ({ data: { remaining: 0, limit: 5, next_available_in_minutes: 720 } }))
          ),
        ]);

        setCourseData(courseResponse.data);
        setLessonData(lessonResponse.data);
        setTasks(tasksResponse.data || []);
        const hintDataMap = tasks.reduce((acc, task, index) => ({
          ...acc,
          [task.id]: hintResponses[index]?.data || { remaining: 0, limit: 5, next_available_in_minutes: 720 },
        }), {});
        setHintData(hintDataMap);
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

    fetchData();
  }, [courseId, moduleId, lessonId, navigate, accessToken, tasks]);

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

    if (lessonData) {
      console.log('video_url:', lessonData.video_url);
      console.log('uploaded_video:', lessonData.uploaded_video);
    }
  }, [lessonData]);

  const fixImageUrls = (htmlContent) => {
    return htmlContent.replace(/src="\/media\//g, `src="${API_URL}/media/`);
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const getLessonNavigation = () => {
    if (!Array.isArray(courseData?.Curriculum)) return { prev: null, next: null };
    let prev = null, next = null, foundCurrent = false;

    for (const module of courseData.Curriculum) {
      if (!Array.isArray(module.lessons) || module.lessons.length === 0) continue;

      const sortedLessons = [...module.lessons].sort((a, b) => a.lesson_id - b.lesson_id);
      for (let i = 0; i < sortedLessons.length; i++) {
        const lesson = sortedLessons[i];
        if (lesson.lesson_id === parseInt(lessonId) && module.module_id === parseInt(moduleId)) {
          foundCurrent = true;

          if (i > 0) {
            prev = { moduleId: module.module_id, lessonId: sortedLessons[i - 1].lesson_id };
          } else if (courseData.Curriculum.indexOf(module) > 0) {
            const prevModule = courseData.Curriculum[courseData.Curriculum.indexOf(module) - 1];
            const prevSortedLessons = [...(prevModule.lessons || [])].sort((a, b) => a.lesson_id - b.lesson_id);
            if (prevSortedLessons.length > 0) {
              prev = { moduleId: prevModule.module_id, lessonId: prevSortedLessons[prevSortedLessons.length - 1].lesson_id };
            }
          }

          if (i < sortedLessons.length - 1) {
            next = { moduleId: module.module_id, lessonId: sortedLessons[i + 1].lesson_id };
          } else if (courseData.Curriculum.indexOf(module) < courseData.Curriculum.length - 1) {
            const nextModule = courseData.Curriculum[courseData.Curriculum.indexOf(module) + 1];
            const nextSortedLessons = [...(nextModule.lessons || [])].sort((a, b) => a.lesson_id - b.lesson_id);
            if (nextSortedLessons.length > 0) {
              next = { moduleId: nextModule.module_id, lessonId: nextSortedLessons[0].lesson_id };
            }
          }

          break;
        }
      }

      if (foundCurrent) break;
    }

    return { prev, next };
  };

  const handleVideoError = (e) => {
    console.error('Video error:', e);
    setVideoError('Failed to load video. Please check the video URL or try again later.');
  };

  const handleHintRequest = async (exerciseId, isCodeTask = false, submittedCode = '') => {
    try {
      const url = `${API_URL}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}/hint/`;
      const response = isCodeTask
        ? await axios.post(url, { submitted_code: submittedCode }, { headers: { Authorization: `Bearer ${accessToken}` } })
        : await axios.get(url, { headers: { Authorization: `Bearer ${accessToken}` } });

      setHintData(prev => ({ ...prev, [exerciseId]: response.data }));
      return response.data;
    } catch (err) {
      const errorData = err.response?.data || {};
      setHintData(prev => ({ ...prev, [exerciseId]: errorData }));
      return errorData;
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
              <>
                <video
                  ref={videoRef}
                  src={videoSrc}
                  controls
                  onError={handleVideoError}
                  type={uploaded_video ? 'video/mp4' : 'video/mp4'}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                {videoError && <p className="text-red-500 text-center mt-4">{videoError}</p>}
              </>
            )}
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
            {codeTasks.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-orange-500">Coding Exercises</h2>
                <LessonCompiler
                  tasks={codeTasks}
                  courseId={courseId}
                  moduleId={moduleId}
                  lessonId={lessonId}
                  onHintRequest={handleHintRequest}
                  hintData={hintData}
                />
              </div>
            )}
            {mcqTasks.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4 text-orange-500">Multiple Choice Questions</h2>
                {mcqTasks.map((task) => (
                  <div key={task.id} className="mb-10">
                    <QuizTask
                      task={task}
                      onHintRequest={() => handleHintRequest(task.id)}
                      hintData={hintData[task.id] || { remaining: 0, limit: 5 }}
                    />
                  </div>
                ))}
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

function QuizTask({ task, onHintRequest, hintData }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleSelect = (id) => {
    if (!submitted) setSelected(id);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const response = await axios.post(
        `${API_URL}/courses/${task.course_id}/modules/${task.module_id}/lessons/${task.lesson_id}/submit-answer/`,
        {
          answers: [{ exercise_id: task.id, selected_option: selected }],
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      setSubmissionResult(response.data.results[0].is_correct);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow relative">
      {hintData.remaining > 0 && (
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <span className="text-sm text-gray-600">Hints remaining:</span>
          <button
            onClick={onHintRequest}
            disabled={hintData.remaining === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
              hintData.remaining === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } transition-colors`}
            title={hintData.remaining === 0 ? `No hints available. Next hint in ${hintData.next_available_in_minutes} minutes.` : `${hintData.remaining} hints remaining`}
          >
            {hintData.remaining}
          </button>
        </div>
      )}
      <h3 className="text-lg font-bold mb-2">{task.title}</h3>
      {task.description && <p className="mb-4">{task.description}</p>}
      <div className="mb-4">
        {task.options.map((option) => (
          <button
            key={option.id}
            className={`block w-full text-left mb-2 p-3 rounded border ${
              submitted
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
          {submissionResult ? (
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