import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScrollProgress from '../../Components/ScrollProgress';
import LessonCompiler from '../../AI/Compiler/LessonCompiler';
import Chat from '../../AI/Сhat/Chat';
import { API_URL } from '../../Api/api';

const LessonPage = () => {
  const { courseId, modulesId, lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check for accessToken
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.warn('No access token found. Redirecting to Auth.');
          navigate('/Auth');
          return;
        }

        // Fetch course data for navigation
        const courseResponse = await axios.get(`${API_URL}/courses/${courseId}`);
        console.log('Course data:', courseResponse.data);
        setCourseData(courseResponse.data);

        // Fetch lesson data
        const response = await axios.get(
          `${API_URL}/courses/${courseId}/modules/${modulesId}/lessons/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log('Lesson data:', response.data);
        setLessonData(response.data);
      } catch (err) {
        console.error('Fetch error:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        if (err.response?.status === 401) {
          console.warn('Unauthorized. Redirecting to Auth.');
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
  }, [courseId, modulesId, lessonId, navigate]);

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

  // Find previous and next lessons, respecting sorted order
  const getLessonNavigation = () => {
    if (!courseData?.Curriculum) {
      console.warn('No curriculum data available for navigation.');
      return { prev: null, next: null };
    }

    let prev = null;
    let next = null;
    let foundCurrent = false;

    for (const module of courseData.Curriculum) {
      // Sort lessons by lesson_id
      const sortedLessons = [...module.lessons].sort((a, b) => a.lesson_id - b.lesson_id);
      console.log('Sorted lessons for module', module.module_id, ':', sortedLessons);

      for (let i = 0; i < sortedLessons.length; i++) {
        const lesson = sortedLessons[i];
        if (
          lesson.lesson_id === parseInt(lessonId) &&
          module.module_id === parseInt(modulesId)
        ) {
          foundCurrent = true;
          // Previous lesson
          if (i > 0) {
            prev = {
              moduleId: module.module_id,
              lessonId: sortedLessons[i - 1].lesson_id,
            };
          } else if (courseData.Curriculum.indexOf(module) > 0) {
            const prevModule = courseData.Curriculum[courseData.Curriculum.indexOf(module) - 1];
            const prevSortedLessons = [...prevModule.lessons].sort(
              (a, b) => a.lesson_id - b.lesson_id
            );
            prev = {
              moduleId: prevModule.module_id,
              lessonId: prevSortedLessons[prevSortedLessons.length - 1].lesson_id,
            };
          }
          // Next lesson
          if (i < sortedLessons.length - 1) {
            next = {
              moduleId: module.module_id,
              lessonId: sortedLessons[i + 1].lesson_id,
            };
          } else if (courseData.Curriculum.indexOf(module) < courseData.Curriculum.length - 1) {
            const nextModule = courseData.Curriculum[courseData.Curriculum.indexOf(module) + 1];
            const nextSortedLessons = [...nextModule.lessons].sort(
              (a, b) => a.lesson_id - b.lesson_id
            );
            next = {
              moduleId: nextModule.module_id,
              lessonId: nextSortedLessons[0].lesson_id,
            };
          }
          break;
        }
      }
      if (foundCurrent) break;
    }

    console.log('Navigation:', { prev, next });
    return { prev, next };
  };

  const { prev, next } = getLessonNavigation();

  if (loading) return <p>Loading lesson data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!lessonData) return <p>Lesson not found.</p>;

  const { name, description, video_url, uploaded_video } = lessonData;

  // Placeholder tasks
  const tasks = [
    {
      id: 1,
      name: "Sum of Two Numbers",
      description: "Write a function that takes two numbers and returns their sum.",
      input: "3, 5",
      expected_output: "8",
    },
  ];

  const task = tasks.find((task) => task.id === Number(lessonId)) || null;

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

export default LessonPage;