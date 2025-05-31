import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../Api/api';
import { Edit, Trash2 } from 'lucide-react';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    duration: '',
  });
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ module: '', duration: '' });
  const [editingModule, setEditingModule] = useState(null);
  const [lessons, setLessons] = useState({});
  const [newLesson, setNewLesson] = useState({ name: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModuleId, setDeleteModuleId] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_URL}/author/courses/${courseId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Course not found');
        }
        const data = await response.json();
        setCourseData({
          title: data.title,
          description: data.description,
          duration: data.duration,
        });
      } catch (err) {
        setError(`Failed to fetch course: ${err.message}`);
        navigate('/courses');
      }
    };

    const fetchModules = async () => {
      try {
        const response = await fetch(`${API_URL}/author/courses/${courseId}/modules/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch modules');
        }
        const data = await response.json();
        setModules(data);
      } catch (err) {
        setError(`Failed to fetch modules: ${err.message}`);
      }
    };

    fetchCourse();
    fetchModules();
  }, [courseId, navigate]);

  const fetchLessons = async (moduleId) => {
    try {
      const response = await fetch(`${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch lessons');
      }
      const data = await response.json();
      setLessons((prev) => ({ ...prev, [moduleId]: data }));
      setExpandedModules((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(moduleId)) {
          newSet.delete(moduleId);
        } else {
          newSet.add(moduleId);
        }
        return newSet;
      });
    } catch (err) {
      setError(`Failed to fetch lessons: ${err.message}`);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseData.title.trim() || !courseData.description.trim() || !courseData.duration.trim()) {
      setError('Title, description, and duration are required');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/author/courses/${courseId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(courseData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update course');
      }
      setError(null);
    } catch (err) {
      setError(`Failed to update course: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    if (!newModule.module.trim() || !newModule.duration.trim()) {
      setError('Module name and duration are required');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/author/courses/${courseId}/modules/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(newModule),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create module');
      }
      const data = await response.json();
      setModules([...modules, { ...newModule, module_id: data.module_id }]);
      setNewModule({ module: '', duration: '' });
      setError(null);
    } catch (err) {
      setError(`Failed to create module: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModuleUpdate = async (moduleId) => {
    if (!newModule.module.trim() || !newModule.duration.trim()) {
      setError('Module name and duration are required');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/author/courses/${courseId}/modules/${moduleId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(newModule),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update module');
      }
      setModules(modules.map((mod) => 
        mod.module_id === moduleId ? { ...newModule, module_id: moduleId } : mod
      ));
      setEditingModule(null);
      setNewModule({ module: '', duration: '' });
      setError(null);
    } catch (err) {
      setError(`Failed to update module: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLessonSubmit = async (e, moduleId) => {
    e.preventDefault();
    if (!newLesson.name.trim()) {
      setError('Lesson name is required');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ name: newLesson.name }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create lesson');
      }
      const data = await response.json();
      setLessons((prev) => ({
        ...prev,
        [moduleId]: [...(prev[moduleId] || []), { name: newLesson.name, lesson_id: data.lesson_id }],
      }));
      setNewLesson({ name: '' });
      setError(null);
    } catch (err) {
      setError(`Failed to create lesson: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (type, id, moduleId = null) => {
    setDeleteType(type);
    setDeleteId(id);
    setDeleteModuleId(moduleId);
    setConfirmInput('');
    setModalError(null);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (confirmInput !== 'DELETE') {
      setModalError('Please type "DELETE" to confirm');
      return;
    }
    try {
      setIsSubmitting(true);
      let url;
      if (deleteType === 'course') {
        url = `${API_URL}/author/courses/${deleteId}/`;
      } else if (deleteType === 'module') {
        url = `${API_URL}/author/courses/${courseId}/modules/${deleteId}/`;
      } else if (deleteType === 'lesson') {
        url = `${API_URL}/author/courses/${courseId}/modules/${deleteModuleId}/lessons/${deleteId}/`;
      }
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to delete ${deleteType}`);
      }
      if (deleteType === 'course') {
        navigate('/courses');
      } else if (deleteType === 'module') {
        setModules(modules.filter((mod) => mod.module_id !== deleteId));
        setLessons((prev) => {
          const updated = { ...prev };
          delete updated[deleteId];
          return updated;
        });
        setExpandedModules((prev) => {
          const newSet = new Set(prev);
          newSet.delete(deleteId);
          return newSet;
        });
      } else if (deleteType === 'lesson') {
        setLessons((prev) => ({
          ...prev,
          [deleteModuleId]: prev[deleteModuleId].filter((lesson) => lesson.lesson_id !== deleteId),
        }));
      }
      setShowDeleteModal(false);
      setError(null);
    } catch (err) {
      setModalError(`Failed to delete ${deleteType}: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[90%] mx-auto p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Edit Course</h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          {error}
        </div>
      )}

      <form onSubmit={handleCourseSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Course Title
          </label>
          <input
            type="text"
            id="title"
            value={courseData.title}
            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            rows="5"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            id="duration"
            value={courseData.duration}
            onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            Save Course
          </button>
          <button
            type="button"
            onClick={() => openDeleteModal('course', courseId)}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            Delete Course
          </button>
        </div>
      </form>

      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Modules</h3>
      <form onSubmit={handleModuleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg mb-8">
        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-2">
            Module Name
          </label>
          <input
            type="text"
            id="module"
            value={newModule.module}
            onChange={(e) => setNewModule({ ...newModule, module: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="moduleDuration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            id="moduleDuration"
            value={newModule.duration}
            onChange={(e) => setNewModule({ ...newModule, duration: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          Add Module
        </button>
      </form>

      {modules.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-lg text-gray-500 text-center">
          No modules available.
        </div>
      ) : (
        <ul className="space-y-4">
          {modules.map((module) => (
            <li key={module.module_id} className="bg-white p-6 rounded-xl shadow-lg">
              {editingModule === module.module_id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newModule.module}
                    onChange={(e) => setNewModule({ ...newModule, module: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    value={newModule.duration}
                    onChange={(e) => setNewModule({ ...newModule, duration: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                    disabled={isSubmitting}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleModuleUpdate(module.module_id)}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
                      disabled={isSubmitting}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingModule(null)}
                      className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md disabled:bg-gray-400"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {module.module} ({module.duration})
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingModule(module.module_id);
                          setNewModule({ module: module.module, duration: module.duration });
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-all"
                        disabled={isSubmitting}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => openDeleteModal('module', module.module_id)}
                        className="text-red-600 hover:text-red-800 transition-all"
                        disabled={isSubmitting}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => fetchLessons(module.module_id)}
                    className="text-blue-600 font-semibold hover:text-blue-800 transition-all"
                    disabled={isSubmitting}
                  >
                    {expandedModules.has(module.module_id) ? 'Hide Lessons' : 'Show Lessons'}
                  </button>

                  {expandedModules.has(module.module_id) && (
                    <div className="mt-6">
                      <form
                        onSubmit={(e) => handleLessonSubmit(e, module.module_id)}
                        className="space-y-4 mb-6"
                      >
                        <div>
                          <label
                            htmlFor={`lessonName-${module.module_id}`}
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Lesson Name
                          </label>
                          <input
                            type="text"
                            id={`lessonName-${module.module_id}`}
                            value={newLesson.name}
                            onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
                          disabled={isSubmitting}
                        >
                          Add Lesson
                        </button>
                      </form>

                      {lessons[module.module_id]?.length === 0 ? (
                        <p className="text-gray-500">No lessons available.</p>
                      ) : (
                        <ul className="space-y-4">
                          {lessons[module.module_id]?.map((lesson) => (
                            <li
                              key={lesson.lesson_id}
                              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                            >
                              <div className="flex justify-between items-center">
                                <p className="text-lg font-medium text-gray-800">{lesson.name}</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      navigate(`/edit-lesson/${courseId}/${module.module_id}/${lesson.lesson_id}`)
                                    }
                                    className="text-blue-600 hover:text-blue-800 transition-all"
                                    disabled={isSubmitting}
                                  >
                                    <Edit size={20} />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal('lesson', lesson.lesson_id, module.module_id)}
                                    className="text-red-600 hover:text-red-800 transition-all"
                                    disabled={isSubmitting}
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => navigate('/courses')}
        className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md mt-8"
        disabled={isSubmitting}
      >
        Back to Courses
      </button>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm {deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              To permanently delete this {deleteType}, type "DELETE" below.
            </p>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type DELETE"
            />
            {modalError && (
              <p className="text-red-600 text-sm mb-2">{modalError}</p>
            )}
            <div className="flex gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCourse;
