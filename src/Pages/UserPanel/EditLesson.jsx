import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { fetchLesson, updateLesson, fetchExercises, createExercise, updateMCQExercise, updateCodeExercise, deleteExercises } from '../../Api/lesson';
import { API_URL } from '../../Api/api';

const EditLesson = () => {
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
    solution: { sample_input: '', expected_output: '', initial_code: '' },
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

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
        setExercises(exerciseData);
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
      setError('Название урока и описание обязательны');
      return;
    }
    try {
      setIsSubmitting(true);
      await updateLesson(courseId, moduleId, lessonId, lessonData);
      setError(null);
      navigate(`/edit-course/${courseId}`);
    } catch (err) {
      setError(`Ошибка обновления урока: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExerciseSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        type: newExercise.type,
        exercises: [
          newExercise.type === 'mcq'
            ? {
                title: newExercise.title,
                description: newExercise.description,
                options: newExercise.options,
              }
            : {
                title: newExercise.title,
                description: newExercise.description,
                solution: newExercise.solution,
              },
        ],
      };
      await createExercise(courseId, moduleId, lessonId, payload);
      const updatedExercises = await fetchExercises(courseId, moduleId, lessonId);
      setExercises(updatedExercises);
      setNewExercise({
        type: 'mcq',
        title: '',
        description: '',
        options: [{ text: '', is_correct: false }],
        solution: { sample_input: '', expected_output: '', initial_code: '' },
      });
      setError(null);
    } catch (err) {
      setError(`Ошибка создания задания: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExerciseUpdate = async (exercise) => {
    try {
      setIsSubmitting(true);
      const payload = {
        exercises: [
          exercise.type === 'mcq'
            ? {
                exercise_id: exercise.id,
                title: exercise.title,
                description: exercise.description,
                options: exercise.options,
              }
            : {
                exercise_id: exercise.id,
                title: exercise.title,
                description: exercise.description,
                solution: exercise.solution,
              },
        ],
      };
      if (exercise.type === 'mcq') {
        await updateMCQExercise(courseId, moduleId, lessonId, payload);
      } else {
        await updateCodeExercise(courseId, moduleId, lessonId, payload);
      }
      const updatedExercises = await fetchExercises(courseId, moduleId, lessonId);
      setExercises(updatedExercises);
      setError(null);
    } catch (err) {
      setError(`Ошибка обновления задания: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExerciseDelete = async (exerciseIds) => {
    try {
      setIsSubmitting(true);
      await deleteExercises(courseId, moduleId, lessonId, { exercise_ids: exerciseIds });
      const updatedExercises = await fetchExercises(courseId, moduleId, lessonId);
      setExercises(updatedExercises);
      setError(null);
    } catch (err) {
      setError(`Ошибка удаления задания: ${err.message}`);
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
                reject(error);
              });
          });
        });
      },
    };
  };

  return (
    <div className="max-w-[90%] mx-auto p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Редактировать урок</h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">{error}</div>
      )}

      <form onSubmit={handleLessonSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Название урока
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
            Описание
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
            Контент
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
              <p className="text-gray-600">Загрузка редактора...</p>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-2">
            URL видео (опционально)
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
            Загрузить видео (опционально)
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
            Сохранить урок
          </button>
          <button
            type="button"
            onClick={() => navigate(`/edit-course/${courseId}`)}
            className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            Отмена
          </button>
        </div>
      </form>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Задания</h3>
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
                <p className="text-gray-700">Expected Output: {exercise.solution.expected_output}</p>
                <p className="text-gray-700">Initial Code: {exercise.solution.initial_code}</p>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleExerciseUpdate(exercise)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                disabled={isSubmitting}
              >
                Редактировать
              </button>
              <button
                onClick={() => handleExerciseDelete([exercise.id])}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
                disabled={isSubmitting}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleExerciseSubmit} className="mt-8 bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Создать новое задание</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Тип задания</label>
          <select
            value={newExercise.type}
            onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="mcq">MCQ</option>
            <option value="code">Code</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
          <input
            type="text"
            value={newExercise.title}
            onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
          <textarea
            value={newExercise.description}
            onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            required
            disabled={isSubmitting}
          />
        </div>
        {newExercise.type === 'mcq' ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Варианты ответа</label>
            {newExercise.options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(index, 'text', e.target.value)}
                  className="flex-1 p-2 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Текст варианта"
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
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
              disabled={isSubmitting}
            >
              Добавить вариант
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Решение</label>
            <input
              type="text"
              value={newExercise.solution.expected_output}
              onChange={(e) =>
                setNewExercise({
                  ...newExercise,
                  solution: { ...newExercise.solution, expected_output: e.target.value },
                })
              }
              className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ожидаемый вывод"
              required
              disabled={isSubmitting}
            />
            <textarea
              value={newExercise.solution.initial_code}
              onChange={(e) =>
                setNewExercise({
                  ...newExercise,
                  solution: { ...newExercise.solution, initial_code: e.target.value },
                })
              }
              className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
              placeholder="Начальный код"
              rows="4"
              disabled={isSubmitting}
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          Создать задание
        </button>
      </form>
    </div>
  );
};

export default EditLesson;