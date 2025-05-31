import React, { useState, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../Api/api';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
    const fetchLesson = async () => {
      try {
        const response = await fetch(
          `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Lesson not found');
        }
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.content || '', 'text/html');
        const images = doc.querySelectorAll('img');
        images.forEach((img) => {
          const src = img.getAttribute('src');
          if (src && src.startsWith('/')) {
            img.setAttribute('src', `${API_URL}${src}`);
          }
        });
        const updatedContent = doc.body.innerHTML;

        setLessonData({
          name: data.name || '',
          short_description: data.short_description || '',
          video_url: data.video_url || '',
          uploaded_video: null,
          content: updatedContent,
        });
        setEditorReady(true);
      } catch (err) {
        setError(`Failed to fetch lesson: ${err.message}`);
        navigate(`/edit-course/${courseId}`);
      }
    };
    fetchLesson();
  }, [courseId, moduleId, lessonId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lessonData.name.trim() || !lessonData.short_description.trim()) {
      setError('Lesson name and short description are required');
      return;
    }
    try {
      setIsSubmitting(true);
      
 
      const contentToSend = document.getElementById('content-fallback').value;
      
      const payload = {
        lesson_id: parseInt(lessonId),
        name: lessonData.name,
        short_description: lessonData.short_description,
        video_url: lessonData.video_url || null,
        uploaded_video: null,
        content: contentToSend,
      };

      let response;
      if (lessonData.uploaded_video) {
        const formData = new FormData();
        formData.append('lesson_id', lessonId);
        formData.append('name', lessonData.name);
        formData.append('short_description', lessonData.short_description);
        formData.append('content', contentToSend);
        if (lessonData.video_url) formData.append('video_url', lessonData.video_url);
        formData.append('uploaded_video', lessonData.uploaded_video);

        response = await fetch(
          `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: formData,
          }
        );
      } else {
        response = await fetch(
          `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to update lesson with status ${response.status}`);
      }

      setError(null);
      navigate(`/edit-course/${courseId}`);
    } catch (err) {
      setError(`Failed to update lesson: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[90%] mx-auto p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Edit Lesson</h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Name
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
            <>
              <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <MemoizedCKEditor
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
                      setError('Image upload failed. Please check server or insert image via URL.');
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
                      toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
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
                                    setError('No valid file selected for upload');
                                    reject(new Error('No valid file selected'));
                                    return;
                                  }
                                  const formData = new FormData();
                                  formData.append('upload', file);
                                  console.log('Uploading image:', {
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
                                          console.error('Image upload error response:', errorData);
                                          throw new Error(
                                            errorData.error || `Image upload failed with status ${response.status}`
                                          );
                                        });
                                      }
                                      return response.json();
                                    })
                                    .then((data) => {
                                      console.log('Image upload response:', data);
                                      if (!data.url) {
                                        console.error('No URL in response:', data);
                                        throw new Error('Server did not return a valid URL');
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
                                        reject(new Error('Failed to load uploaded image'));
                                      };
                                    })
                                    .catch((err) => {
                                      console.error('Image upload error:', err);
                                      setError(`Image upload failed: ${err.message}`);
                                      reject(new Error(`Image upload failed: ${err.message}`));
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
                                style: `aspect-ratio:${aspectRatio}`,
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
                              style: `aspect-ratio:${aspectRatio}`,
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
                placeholder="Fallback content"
                rows="6"
                disabled={isSubmitting}
              />
            </>
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
    </div>
  );
};

const MemoizedCKEditor = memo(CKEditor);

export default EditLesson;