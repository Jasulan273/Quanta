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
    durationValue: '',
    durationUnit: '',
    language: '',
    level: ''
  });
  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ module: '', durationValue: '', durationUnit: '' });
  const [editingModule, setEditingModule] = useState(null);
  const [lessons, setLessons] = useState({});
  const [newLesson, setNewLesson] = useState({ name: '' });
  const [finalExam, setFinalExam] = useState({
    title: '',
    description: '',
    duration_minutes: '',
    max_attempts: '',
    questions: [{ text: '', options: [{ text: '', is_correct: false }] }]
  });
  const [editingFinalExam, setEditingFinalExam] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModuleId, setDeleteModuleId] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');
  const [modalError, setModalError] = useState(null);
  const programmingLanguages = ['R', 'Ruby', 'PHP', 'Golang', 'Java', 'Javascript', 'C++', 'Python'];
  const durationValues = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  const courseDurationUnits = ['day', 'week'];
  const moduleDurationUnits = ['hour', 'minute'];
  const courseLevels = ['beginner', 'intermediate', 'expert', 'all'];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_URL}/author/courses/${courseId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Course not found');
        }
        const data = await response.json();
        const [value, unit] = data.duration ? data.duration.split(' ') : ['', ''];
        setCourseData({
          title: data.title || '',
          description: data.description || '',
          durationValue: value,
          durationUnit: unit.replace(/s$/, ''),
          language: data.language || '',
          level: data.level || ''
        });
        if (data.course_image) {
          setImagePreview(data.course_image);
        }
      } catch (err) {
        setError(`Failed to fetch course: ${err.message}`);
        navigate('/courses');
      }
    };

    const fetchModules = async () => {
      try {
        const response = await fetch(`${API_URL}/author/courses/${courseId}/modules/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch modules');
        }
        const data = await response.json();
        setModules(data.map(mod => {
          const [value, unit] = mod.duration ? mod.duration.split(' ') : ['', ''];
          return { ...mod, durationValue: value, durationUnit: unit.replace(/s$/, '') };
        }));
      } catch (err) {
        setError(`Failed to fetch modules: ${err.message}`);
      }
    };

    const fetchFinalExam = async () => {
      try {
        const response = await fetch(`${API_URL}/courses/${courseId}/final-exam`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFinalExam({
            title: data.title || '',
            description: data.description || '',
            duration_minutes: data.duration_minutes || '',
            max_attempts: data.max_attempts || '',
            questions: data.questions || [{ text: '', options: [{ text: '', is_correct: false }] }]
          });
          setEditingFinalExam(!!data.id);
        }
      } catch (err) {
        setFinalExam({
          title: '',
          description: '',
          duration_minutes: '',
          max_attempts: '',
          questions: [{ text: '', options: [{ text: '', is_correct: false }] }]
        });
      }
    };

    fetchCourse();
    fetchModules();
    fetchFinalExam();
  }, [courseId, navigate]);

  const fetchLessons = async (moduleId) => {
    try {
      const response = await fetch(`${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseData.title.trim() || !courseData.description.trim() || !courseData.durationValue || !courseData.durationUnit || !courseData.language || !courseData.level) {
      setError('All fields are required');
      return;
    }
    try {
      setIsSubmitting(true);
      const duration = `${courseData.durationValue} ${courseData.durationUnit}${parseInt(courseData.durationValue) > 1 ? 's' : ''}`;
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('duration', duration);
      formData.append('language', courseData.language);
      formData.append('level', courseData.level);
      if (courseImage) {
        formData.append('course_image', courseImage);
      }
      const response = await fetch(`${API_URL}/author/courses/${courseId}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
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
    if (!newModule.module.trim() || !newModule.durationValue || !newModule.durationUnit) {
      setError('Module name and duration are required');
      return;
    }
    try {
      setIsSubmitting(true);
      const duration = `${newModule.durationValue} ${newModule.durationUnit}${parseInt(newModule.durationValue) > 1 ? 's' : ''}`;
      const response = await fetch(`${API_URL}/author/courses/${courseId}/modules/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          module: newModule.module,
          duration: duration
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create module');
      }
      const data = await response.json();
      setModules([...modules, {
        module: newModule.module,
        duration: duration,
        durationValue: newModule.durationValue,
        durationUnit: newModule.durationUnit,
        module_id: data.module_id
      }]);
      setNewModule({ module: '', durationValue: '', durationUnit: '' });
      setError(null);
    } catch (err) {
      setError(`Failed to create module: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModuleUpdate = async (moduleId) => {
    if (!newModule.module.trim() || !newModule.durationValue || !newModule.durationUnit) {
      setError('Module name and duration are required');
      return;
    }
    try {
      setIsSubmitting(true);
      const duration = `${newModule.durationValue} ${newModule.durationUnit}${parseInt(newModule.durationValue) > 1 ? 's' : ''}`;
      const response = await fetch(`${API_URL}/author/courses/${courseId}/modules/${moduleId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          module: newModule.module,
          duration: duration
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update module');
      }
      setModules(modules.map((mod) =>
        mod.module_id === moduleId ? {
          ...newModule,
          module_id: moduleId,
          duration: duration
        } : mod
      ));
      setEditingModule(null);
      setNewModule({ module: '', durationValue: '', durationUnit: '' });
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
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ name: newLesson.name })
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create lesson');
      }
      const data = await response.json();
      setLessons((prev) => ({
        ...prev,
        [moduleId]: [...(prev[moduleId] || []), { name: newLesson.name, lesson_id: data.lesson_id }]
      }));
      setNewLesson({ name: '' });
      setError(null);
    } catch (err) {
      setError(`Failed to create lesson: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalExamSubmit = async (e) => {
    e.preventDefault();
    if (!finalExam.title.trim() || !finalExam.description.trim() || !finalExam.duration_minutes || !finalExam.max_attempts || !finalExam.questions[0].text) {
      setError('All final exam fields are required');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/courses/${courseId}/final-exam/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(finalExam)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create/update final exam');
      }
      setError(null);
      setEditingFinalExam(true);
    } catch (err) {
      setError(`Failed to create/update final exam: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    setFinalExam({
      ...finalExam,
      questions: [...finalExam.questions, { text: '', options: [{ text: '', is_correct: false }] }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...finalExam.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFinalExam({ ...finalExam, questions: updatedQuestions });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...finalExam.questions];
    updatedQuestions[questionIndex].options = [
      ...updatedQuestions[questionIndex].options,
      { text: '', is_correct: false }
    ];
    setFinalExam({ ...finalExam, questions: updatedQuestions });
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...finalExam.questions];
    updatedQuestions[questionIndex].options[optionIndex] = {
      ...updatedQuestions[questionIndex].options[optionIndex],
      [field]: value
    };
    setFinalExam({ ...finalExam, questions: updatedQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...finalExam.questions];
    if (updatedQuestions[questionIndex].options.length > 1) {
      updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
      setFinalExam({ ...finalExam, questions: updatedQuestions });
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
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
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
          [deleteModuleId]: prev[deleteModuleId].filter((lesson) => lesson.lesson_id !== deleteId)
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
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">{error}</div>
      )}
      <form onSubmit={handleCourseSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="durationValue" className="block text-sm font-medium text-gray-700 mb-2">Duration Value</label>
            <select
              id="durationValue"
              value={courseData.durationValue}
              onChange={(e) => setCourseData({ ...courseData, durationValue: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>Select duration value</option>
              {durationValues.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="durationUnit" className="block text-sm font-medium text-gray-700 mb-2">Duration Unit</label>
            <select
              id="durationUnit"
              value={courseData.durationUnit}
              onChange={(e) => setCourseData({ ...courseData, durationUnit: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>Select duration unit</option>
              {courseDurationUnits.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">Programming Language</label>
          <select
            id="language"
            value={courseData.language}
            onChange={(e) => setCourseData({ ...courseData, language: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>Select a programming language</option>
            {programmingLanguages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">Course Level</label>
          <select
            id="level"
            value={courseData.level}
            onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
            disabled={isSubmitting}
          >
            <option value="" disabled>Select course level</option>
            {courseLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="courseImage" className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
          <input
            type="file"
            id="courseImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-4 border border-gray-300 rounded-lg text-lg"
            disabled={isSubmitting}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Course Preview" className="mt-4 max-w-xs rounded-lg shadow-md" />
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >Save Course</button>
          <button
            type="button"
            onClick={() => openDeleteModal('course', courseId)}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >Delete Course</button>
        </div>
      </form>
      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Modules</h3>
      <form onSubmit={handleModuleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg mb-8">
        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-2">Module Name</label>
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
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="moduleDurationValue" className="block text-sm font-medium text-gray-700 mb-2">Duration Value</label>
            <select
              id="moduleDurationValue"
              value={newModule.durationValue}
              onChange={(e) => setNewModule({ ...newModule, durationValue: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>Select duration value</option>
              {durationValues.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="moduleDurationUnit" className="block text-sm font-medium text-gray-700 mb-2">Duration Unit</label>
            <select
              id="moduleDurationUnit"
              value={newModule.durationUnit}
              onChange={(e) => setNewModule({ ...newModule, durationUnit: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>Select duration unit</option>
              {moduleDurationUnits.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
          disabled={isSubmitting}
        >Add Module</button>
      </form>
      {modules.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-lg text-gray-500 text-center">No modules available.</div>
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
                  <div className="flex gap-4">
                    <select
                      value={newModule.durationValue}
                      onChange={(e) => setNewModule({ ...newModule, durationValue: e.target.value })}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>Select duration value</option>
                      {durationValues.map((value) => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                    <select
                      value={newModule.durationUnit}
                      onChange={(e) => setNewModule({ ...newModule, durationUnit: e.target.value })}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>Select duration unit</option>
                      {moduleDurationUnits.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleModuleUpdate(module.module_id)}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
                      disabled={isSubmitting}
                    >Save</button>
                    <button
                      onClick={() => setEditingModule(null)}
                      className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md disabled:bg-gray-400"
                      disabled={isSubmitting}
                    >Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{module.module} ({module.duration})</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingModule(module.module_id);
                          setNewModule({
                            module: module.module,
                            durationValue: module.durationValue,
                            durationUnit: module.durationUnit
                          });
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-all"
                        disabled={isSubmitting}
                      ><Edit size={20} /></button>
                      <button
                        onClick={() => openDeleteModal('module', module.module_id)}
                        className="text-red-600 hover:text-red-800 transition-all"
                        disabled={isSubmitting}
                      ><Trash2 size={20} /></button>
                    </div>
                  </div>
                  <button
                    onClick={() => fetchLessons(module.module_id)}
                    className="text-blue-600 font-semibold hover:text-blue-800 transition-all"
                    disabled={isSubmitting}
                  >{expandedModules.has(module.module_id) ? 'Hide Lessons' : 'Show Lessons'}</button>
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
                          >Lesson Name</label>
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
                        >Add Lesson</button>
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
                                  ><Edit size={20} /></button>
                                  <button
                                    onClick={() => openDeleteModal('lesson', lesson.lesson_id, module.module_id)}
                                    className="text-red-600 hover:text-red-800 transition-all"
                                    disabled={isSubmitting}
                                  ><Trash2 size={20} /></button>
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
      <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Final Exam</h3>
      <form onSubmit={handleFinalExamSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg mb-8">
        <div>
          <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-2">Exam Title</label>
          <input
            type="text"
            id="examTitle"
            value={finalExam.title}
            onChange={(e) => setFinalExam({ ...finalExam, title: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="examDescription" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            id="examDescription"
            value={finalExam.description}
            onChange={(e) => setFinalExam({ ...finalExam, description: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            rows="4"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-2">Duration (Minutes)</label>
            <input
              type="number"
              id="durationMinutes"
              value={finalExam.duration_minutes}
              onChange={(e) => setFinalExam({ ...finalExam, duration_minutes: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
            <input
              type="number"
              id="maxAttempts"
              value={finalExam.max_attempts}
              onChange={(e) => setFinalExam({ ...finalExam, max_attempts: e.target.value })}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
          {finalExam.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4 p-4 border rounded-lg">
              <input
                type="text"
                value={question.text}
                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Question text"
                required
                disabled={isSubmitting}
              />
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                    placeholder="Option text"
                    required
                    disabled={isSubmitting}
                  />
                  <input
                    type="checkbox"
                    checked={option.is_correct}
                    onChange={(e) => updateOption(qIndex, oIndex, 'is_correct', e.target.checked)}
                    className="h-6 w-6 text-blue-600"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(qIndex, oIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg"
                    disabled={isSubmitting}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                disabled={isSubmitting}
              >
                Add Option
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={isSubmitting}
          >
            Add Question
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {editingFinalExam ? 'Update Final Exam' : 'Create Final Exam'}
        </button>
      </form>
      <button
        onClick={() => navigate('/courses')}
        className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-md mt-8"
        disabled={isSubmitting}
      >Back to Courses</button>
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
              >Confirm</button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all disabled:bg-gray-400"
                disabled={isSubmitting}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCourse;