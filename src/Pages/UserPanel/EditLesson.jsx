import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { fetchLesson, updateLesson, fetchExercises, createExercise, updateMCQExercise, updateCodeExercise, deleteExercises } from '../../Api/lesson';
import { API_URL } from '../../Api/api';

const LessonEditor = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState({
    name: '',
    short_description: '',
    video_url: '',
    uploaded_video: null,
    content: '',
  });
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({
    type: 'mcq',
    title: '',
    description: '',
    options: [{ text: '', is_correct: false }],
    solution: { sample_input: '', expected_output: '', initial_code: '', language: 'javascript', hint: '' },
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  useEffect(() => {
    const loadLessonAndExercises = async () => {
      try {
        const [lesson, exerciseData] = await Promise.all([
          fetchLesson(courseId, moduleId, lessonId),
          fetchExercises(courseId, moduleId, lessonId),
        ]);
        setLessonData({
          name: lesson?.name || '',
          short_description: lesson?.short_description || '',
          video_url: lesson?.video_url || '',
          uploaded_video: null,
          content: lesson?.content || '',
        });
        setExercises(exerciseData.sort((a, b) => a.id - b.id));
        setEditorReady(true);
      } catch (err) {
        setError(err.message);
        navigate(`/edit-course/${courseId}`);
      }
    };
    loadLessonAndExercises();
  }, [courseId, moduleId, lessonId, navigate]);

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonData.name.trim() || !lessonData.short_description.trim()) {
      setError('Lesson title and description are required');
      return;
    }
    try {
      setIsSubmitting(true);
      await updateLesson(courseId, moduleId, lessonId, lessonData);
      setError(null);
      navigate(`/edit-course/${courseId}`);
    } catch (err) {
      setError(`Failed to update lesson: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExerciseSubmit = async (e) => {
    e.preventDefault();
    if (!newExercise.title.trim() || !newExercise.description.trim()) {
      setError('Exercise title and description are required');
      return;
    }
    if (newExercise.type === 'mcq' && newExercise.options.some(option => !option.text.trim())) {
      setError('All MCQ options must have text');
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        type: newExercise.type,
        title: newExercise.title,
        description: newExercise.description,
        ...(newExercise.type === 'mcq' ? { options: newExercise.options } : { solution: newExercise.solution }),
      };
      await createExercise(courseId, moduleId, lessonId, payload);
      const updatedExercises = await fetchExercises(courseId, moduleId, lessonId);
      setExercises(updatedExercises.sort((a, b) => a.id - b.id));
      setNewExercise({
        type: 'mcq',
        title: '',
        description: '',
        options: [{ text: '', is_correct: false }],
        solution: { sample_input: '', expected_output: '', initial_code: '', language: 'javascript', hint: '' },
      });
      setError(null);
    } catch (err) {
      setError(`Failed to create exercise: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (exercise) => {
    setEditingExercise({
      ...exercise,
      options: exercise.type === 'mcq' ? [...exercise.options] : [{ text: '', is_correct: false }],
      solution: exercise.type === 'code' ? { ...exercise.solution, language: exercise.solution.language || 'javascript', hint: exercise.solution.hint || '' } : { sample_input: '', expected_output: '', initial_code: '', language: 'javascript', hint: '' },
    });
  };

  const handleEditChange = (field, value) => {
    setEditingExercise((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditOptionChange = (index, field, value) => {
    const updatedOptions = [...editingExercise.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setEditingExercise((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const handleAddEditOption = () => {
    setEditingExercise((prev) => ({
      ...prev,
      options: [...prev.options, { text: '', is_correct: false }],
    }));
  };

  const handleRemoveEditOption = (index) => {
    if (editingExercise.options.length > 1) {
      setEditingExercise((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const handleEditSolutionChange = (field, value) => {
    setEditingExercise((prev) => ({
      ...prev,
      solution: { ...prev.solution, [field]: value },
    }));
  };

  const handleExerciseUpdate = async () => {
    if (!editingExercise.title.trim() || !editingExercise.description.trim()) {
      setError('Exercise title and description are required');
      return;
    }
    if (editingExercise.type === 'mcq' && editingExercise.options.some(option => !option.text.trim())) {
      setError('All MCQ options must have text');
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        exercise_id: editingExercise.id,
        title: editingExercise.title,
        description: editingExercise.description,
        ...(editingExercise.type === 'mcq' ? { options: editingExercise.options } : { solution: editingExercise.solution }),
      };
      if (editingExercise.type === 'mcq') {
        await updateMCQExercise(courseId, moduleId, lessonId, payload);
      } else {
        await updateCodeExercise(courseId, moduleId, lessonId, payload);
      }
      const updatedExercises = await fetchExercises(courseId, moduleId, lessonId);
      setExercises(updatedExercises.sort((a, b) => a.id - b.id));
      setEditingExercise(null);
      setError(null);
    } catch (err) {
      setError(`Failed to update exercise: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExerciseDelete = async (exerciseIds) => {
    try {
      setIsSubmitting(true);
      await deleteExercises(courseId, moduleId, lessonId, { exercise_ids: exerciseIds });
      const updatedExercises = await fetchExercises(courseId, moduleId, lessonId);
      setExercises(updatedExercises.sort((a, b) => a.id - b.id));
      setEditingExercise(null);
      setError(null);
    } catch (err) {
      setError(`Failed to delete exercise: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => {
    setNewExercise({
      ...newExercise,
      options: [...newExercise.options, { text: '', is_correct: false }],
    });
  };

  const updateOption = (index, field, value) => {
    const updatedOptions = [...newExercise.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setNewExercise({ ...newExercise, options: updatedOptions });
  };

  const removeOption = (index) => {
    if (newExercise.options.length > 1) {
      setNewExercise({
        ...newExercise,
        options: newExercise.options.filter((_, i) => i !== index),
      });
    }
  };

  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return loader.file.then((file) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('upload', file);
            fetch(`${API_URL}/image_upload/`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
              body: formData,
            })
              .then((response) => {
                if (!response.ok) {
                  return response.json().then((err) => reject(err));
                }
                return response.json();
              })
              .then((res) => {
                resolve({ default: res.url });
              })
              .catch((error) => {
                reject(error.message || 'Image upload failed');
              });
          });
        });
      },
    };
  };

  return (
    <div className="max-w-[90%] mx-auto p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Edit Lesson</h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">{error}</div>
      )}

      <form onSubmit={handleLessonSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Title
          </label>
          <input
            type="text"
            id="name"
            value={lessonData.name}
            onChange={(e) => setLessonData({ ...lessonData, name: e.target.value })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="short_description"
            value={lessonData.short_description}
            onChange={(e) => setLessonData({ ...lessonData, short_description: e.target.value })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
            rows="6"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          {editorReady && lessonData.content !== null ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <CKEditor
                editor={ClassicEditor}
                data={lessonData.content}
                onReady={(editor) => {
                  if (isSubmitting) {
                    editor.enableReadOnlyMode('edit-lesson');
                  } else {
                    editor.disableReadOnlyMode('edit-lesson');
                  }
                  editor.plugins.get('FileRepository').createUploadAdapter = uploadAdapter;
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setLessonData((prev) => ({ ...prev, content: data }));
                }}
                config={{
                  toolbar: [
                    'heading', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                    'imageUpload', 'insertTable', 'mediaEmbed', '|',
                    'undo', 'redo',
                  ],
                  image: {
                    toolbar: ['imageTextAlternative', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side'],
                  },
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
              <p className="text-gray-600">Loading editor...</p>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-2">
            Video URL (optional)
          </label>
          <input
            type="text"
            id="video_url"
            value={lessonData.video_url}
            onChange={(e) => setLessonData({ ...lessonData, video_url: e.target.value })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="uploaded_video" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Video (optional)
          </label>
          <input
            type="file"
            id="uploaded_video"
            onChange={(e) => setLessonData({ ...lessonData, uploaded_video: e.target.files[0] })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm file:bg-blue-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:cursor-pointer transition-all duration-300"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            Save Lesson
          </button>
          <button
            type="button"
            onClick={() => navigate(`/edit-course/${courseId}`)}
            className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Exercises</h3>
        {exercises.map((exercise) => (
          <div key={exercise.id} className="bg-white p-6 rounded-xl shadow-lg mb-4">
            <h4 className="text-lg font-semibold text-gray-800">{exercise.title} ({exercise.type.toUpperCase()})</h4>
            <p className="text-gray-600 mb-2">{exercise.description}</p>
            {exercise.type === 'mcq' ? (
              <ul className="list-disc pl-5">
                {exercise.options.map((option) => (
                  <li key={option.id} className="text-gray-700">
                    {option.text} {option.is_correct && <span className="text-green-600">(Correct)</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p className="text-gray-700">Sample Input: {exercise.solution.sample_input}</p>
                <p className="text-gray-700">Expected Output: {exercise.solution.expected_output}</p>
                <p className="text-gray-700">Initial Code: {exercise.solution.initial_code}</p>
                <p className="text-gray-700">Hint: {exercise.solution.hint}</p>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleStartEdit(exercise)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                disabled={isSubmitting}
              >
                Edit
              </button>
              <button
                onClick={() => handleExerciseDelete([exercise.id])}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
                disabled={isSubmitting}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleExerciseSubmit} className="mt-12 space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Exercise</h3>
        <div>
          <label htmlFor="exerciseType" className="block text-sm font-medium text-gray-700 mb-2">
            Exercise Type
          </label>
          <select
            id="exerciseType"
            value={newExercise.type}
            onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
            disabled={isSubmitting}
          >
            <option value="mcq">Multiple Choice Question</option>
            <option value="code">Code Exercise</option>
          </select>
        </div>
        <div>
          <label htmlFor="exerciseTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="exerciseTitle"
            value={newExercise.title}
            onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="exerciseDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="exerciseDescription"
            value={newExercise.description}
            onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
            rows="4"
            required
            disabled={isSubmitting}
          />
        </div>
        {newExercise.type === 'mcq' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            {newExercise.options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(index, 'text', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Option text"
                  required
                  disabled={isSubmitting}
                />
                <input
                  type="checkbox"
                  checked={option.is_correct}
                  onChange={(e) => updateOption(index, 'is_correct', e.target.checked)}
                  className="h-6 w-6 text-blue-600"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg"
                  disabled={isSubmitting || newExercise.options.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={isSubmitting}
            >
              Add Option
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="sampleInput" className="block text-sm font-medium text-gray-700 mb-2">
                Sample Input
              </label>
              <textarea
                id="sampleInput"
                value={newExercise.solution.sample_input}
                onChange={(e) => setNewExercise({ ...newExercise, solution: { ...newExercise.solution, sample_input: e.target.value } })}
                className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                rows="4"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="expectedOutput" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Output
              </label>
              <textarea
                id="expectedOutput"
                value={newExercise.solution.expected_output}
                onChange={(e) => setNewExercise({ ...newExercise, solution: { ...newExercise.solution, expected_output: e.target.value } })}
                className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                rows="4"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="initialCode" className="block text-sm font-medium text-gray-700 mb-2">
                Initial Code
              </label>
              <textarea
                id="initialCode"
                value={newExercise.solution.initial_code}
                onChange={(e) => setNewExercise({ ...newExercise, solution: { ...newExercise.solution, initial_code: e.target.value } })}
                className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                rows="6"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="hint" className="block text-sm font-medium text-gray-700 mb-2">
                Hint
              </label>
              <textarea
                id="hint"
                value={newExercise.solution.hint}
                onChange={(e) => setNewExercise({ ...newExercise, solution: { ...newExercise.solution, hint: e.target.value } })}
                className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                rows="4"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Programming Language
              </label>
              <select
                id="language"
                value={newExercise.solution.language}
                onChange={(e) => setNewExercise({ ...newExercise, solution: { ...newExercise.solution, language: e.target.value } })}
                className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                disabled={isSubmitting}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          Add Exercise
        </button>
      </form>

      {editingExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl w-full">
            <h3 className="text-2xl font-bold mb-6">Edit Exercise</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingExercise.title}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingExercise.description}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                  rows="4"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {editingExercise.type === 'mcq' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                  {editingExercise.options.map((option, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleEditOptionChange(index, 'text', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                        placeholder="Option text"
                        required
                        disabled={isSubmitting}
                      />
                      <input
                        type="checkbox"
                        checked={option.is_correct}
                        onChange={(e) => handleEditOptionChange(index, 'is_correct', e.target.checked)}
                        className="h-6 w-6 text-blue-600"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditOption(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded-lg"
                        disabled={isSubmitting || editingExercise.options.length <= 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddEditOption}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    disabled={isSubmitting}
                  >
                    Add Option
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sample Input</label>
                    <textarea
                      value={editingExercise.solution.sample_input}
                      onChange={(e) => handleEditSolutionChange('sample_input', e.target.value)}
                      className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                      rows="4"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Output</label>
                    <textarea
                      value={editingExercise.solution.expected_output}
                      onChange={(e) => handleEditSolutionChange('expected_output', e.target.value)}
                      className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                      rows="4"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Initial Code</label>
                    <textarea
                      value={editingExercise.solution.initial_code}
                      onChange={(e) => handleEditSolutionChange('initial_code', e.target.value)}
                      className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                      rows="6"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hint</label>
                    <textarea
                      value={editingExercise.solution.hint}
                      onChange={(e) => handleEditSolutionChange('hint', e.target.value)}
                      className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                      rows="4"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Programming Language</label>
                    <select
                      value={editingExercise.solution.language}
                      onChange={(e) => handleEditSolutionChange('language', e.target.value)}
                      className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                      disabled={isSubmitting}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleExerciseUpdate}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingExercise(null)}
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonEditor;