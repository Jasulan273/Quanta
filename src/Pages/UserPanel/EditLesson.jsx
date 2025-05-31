import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { fetchLesson, updateLesson } from '../../Api/lesson';
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
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const data = await fetchLesson(courseId, moduleId, lessonId);
        setLessonData(data);
        setEditorReady(true);
      } catch (err) {
        setError(err.message);
        navigate(`/edit-course/${courseId}`);
      }
    };
    loadLesson();
  }, [courseId, moduleId, lessonId, navigate]);

  const handleSubmit = async (e) => {
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

  return (
    <div className="max-w-[90%] mx-auto p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Редактировать урок</h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
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
            <>
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
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setLessonData((prev) => ({ ...prev, content: data }));
                  }}
                  onError={(error) => {
                    if (error.type === 'upload') {
                      setError('Ошибка загрузки изображения. Проверьте сервер или вставьте изображение по URL.');
                    }
                  }}
                  config={{
                    toolbar: [
                      'heading',
                      '|',
                      'fontFamily',
                      'fontSize',
                      'fontColor',
                      'fontBackgroundColor',
                      '|',
                      'bold',
                      'italic',
                      'underline',
                      'strikethrough',
                      '|',
                      'link',
                      'bulletedList',
                      'numberedList',
                      'blockQuote',
                      '|',
                      'imageUpload',
                      'insertTable',
                      'mediaEmbed',
                      '|',
                      'undo',
                      'redo',
                    ],
                    image: {
                      toolbar: [
                        'imageTextAlternative',
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side',
                        '|',
                        'resizeImage:100',
                        'resizeImage:50',
                        'resizeImage:original'
                      ],
                      resizeUnit: 'px',
                      resizeOptions: [
                        {
                          name: 'resizeImage:original',
                          value: null,
                          label: 'Original',
                          icon: 'original'
                        },
                        {
                          name: 'resizeImage:50',
                          value: '50',
                          label: '50%',
                          icon: 'medium'
                        },
                        {
                          name: 'resizeImage:100',
                          value: '100',
                          label: '100%',
                          icon: 'large'
                        }
                      ],
                      styles: [
                        'full',
                        'side',
                        'alignLeft',
                        'alignRight'
                      ],
                      upload: {
                        types: ['jpeg', 'png', 'gif', 'bmp', 'webp'],
                      },
                    },
                    table: {
                      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
                    },
                    mediaEmbed: {
                      previewsInData: true,
                    },
                    extraPlugins: [
                      function (editor) {
                        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                          return {
                            upload: () => {
                              return new Promise((resolve, reject) => {
                                loader.file.then((file) => {
                                  if (!file || file.size === 0) {
                                    console.error('No valid file selected for upload:', file);
                                    setError('Не выбран корректный файл для загрузки');
                                    reject(new Error('Не выбран корректный файл'));
                                    return;
                                  }
                                  const formData = new FormData();
                                  formData.append('upload', file);
                                  console.log('Загрузка изображения:', {
                                    name: file.name,
                                    type: file.type,
                                    size: file.size,
                                    fieldName: 'upload',
                                  });
                                  fetch('https://quant.up.railway.app/image_upload/', {
                                    method: 'POST',
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                                    },
                                    body: formData,
                                  })
                                    .then((response) => {
                                      if (!response.ok) {
                                        return response.json().then((errorData) => {
                                          console.error('Ошибка загрузки изображения:', errorData);
                                          throw new Error(
                                            errorData.error || `Ошибка загрузки с статусом ${response.status}`
                                          );
                                        });
                                      }
                                      return response.json();
                                    })
                                    .then((data) => {
                                      console.log('Ответ загрузки изображения:', data);
                                      if (!data.url) {
                                        console.error('Нет URL в ответе:', data);
                                        throw new Error('Сервер не вернул корректный URL');
                                      }
                                      const imageUrl = data.url.startsWith('/')
                                        ? `${API_URL}${data.url}`
                                        : data.url;
                                      const img = new Image();
                                      img.src = imageUrl;
                                      img.onload = () => {
                                        resolve({
                                          default: imageUrl,
                                          width: img.width,
                                          height: img.height,
                                        });
                                      };
                                      img.onerror = () => {
                                        reject(new Error('Не удалось загрузить изображение'));
                                      };
                                    })
                                    .catch((err) => {
                                      console.error('Ошибка загрузки:', err);
                                      setError(`Ошибка загрузки изображения: ${err.message}`);
                                      reject(new Error(`Ошибка загрузки изображения: ${err.message}`));
                                    });
                                });
                              });
                            },
                            abort: () => {},
                          };
                        };
                        editor.conversion.for('downcast').elementToElement({
                          model: 'imageBlock',
                          view: (model, { writer }) => {
                            const width = model.getAttribute('width') || 'auto';
                            const height = model.getAttribute('height') || 'auto';
                            const aspectRatio = width && height ? `${width}/${height}` : 'auto';
                            return writer.createContainerElement('figure', { class: 'image' }, [
                              writer.createEmptyElement('img', {
                                src: model.getAttribute('src'),
                                width,
                                height,
                                style: `aspect-ratio:${aspectRatio}; position: relative;`,
                              }),
                            ]);
                          },
                        });
                        editor.conversion.for('downcast').elementToElement({
                          model: 'imageInline',
                          view: (model, { writer }) => {
                            const width = model.getAttribute('width') || 'auto';
                            const height = model.getAttribute('height') || 'auto';
                            const aspectRatio = width && height ? `${width}/${height}` : 'auto';
                            return writer.createEmptyElement('img', {
                              src: model.getAttribute('src'),
                              width,
                              height,
                              style: `aspect-ratio:${aspectRatio}; position: relative;`,
                            });
                          },
                        });
                      },
                    ],
                  }}
                />
              </div>
              <textarea
                id="content-fallback"
                value={lessonData.content}
                onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })}
                className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg"
                placeholder="Резервный контент"
                rows="6"
                disabled={isSubmitting}
              />
            </>
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
    </div>
  );
};

export default EditLesson;