import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { fetchBlog, updateBlog } from '../../Api/blog';
import { API_URL } from '../../Api/api';
import axios from 'axios';

const BlogEditor = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: '',
    short_description: '',
    content: '',
    image: null,
    published: false
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await fetchBlog(blogId);
        setBlogData(data);
        setEditorReady(true);
      } catch (err) {
        setError(err.message);
        navigate('/UserPanel');
      }
    };
    loadBlog();
  }, [blogId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blogData.title.trim() || !blogData.short_description.trim()) {
      setError('Title and description are required');
      return;
    }
    try {
      setIsSubmitting(true);
      await updateBlog(blogId, blogData);
      setError(null);
      navigate('/UserPanel');
    } catch (err) {
      setError(`Failed to update blog: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return loader.file.then(file => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('upload', file);
            axios.post(`${API_URL}/image_upload/`, formData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
              }
            })
            .then(res => {
              resolve({
                default: res.data.url
              });
            })
            .catch(error => {
              reject(error);
            });
          });
        });
      }
    };
  };

  return (
    <div className="max-w-[90%] mx-auto p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Edit Blog</h2>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            value={blogData.title}
            onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
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
            value={blogData.short_description}
            onChange={(e) => setBlogData({ ...blogData, short_description: e.target.value })}
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
          <textarea
            id="content-fallback"
            value={blogData.content}
            onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
            className="hidden"
          />
          {editorReady && blogData.content !== null ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <CKEditor
                editor={ClassicEditor}
                data={blogData.content}
                onReady={(editor) => {
                  if (isSubmitting) {
                    editor.enableReadOnlyMode('edit-blog');
                  } else {
                    editor.disableReadOnlyMode('edit-blog');
                  }
                  editor.plugins.get('FileRepository').createUploadAdapter = uploadAdapter;
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setBlogData((prev) => ({ ...prev, content: data }));
                }}
                config={{
                  toolbar: [
                    'heading', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                    'imageUpload', 'insertTable', 'mediaEmbed', '|',
                    'undo', 'redo'
                  ],
                  image: {
                    toolbar: [
                      'imageTextAlternative',
                      'imageStyle:inline',
                      'imageStyle:block',
                      'imageStyle:side'
                    ]
                  }
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
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image (optional)
          </label>
          <input
            type="file"
            id="image"
            onChange={(e) => setBlogData({ ...blogData, image: e.target.files[0] })}
            className="w-full p-4 rounded-lg border-gray-100 bg-white shadow-sm file:bg-blue-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:cursor-pointer transition-all duration-300"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="published" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <input
              type="checkbox"
              id="published"
              checked={blogData.published}
              onChange={(e) => setBlogData({ ...blogData, published: e.target.checked })}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isSubmitting}
            />
            Publish Blog
          </label>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            Save Blog
          </button>
          <button
            type="button"
            onClick={() => navigate('/UserPanel')}
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

export default BlogEditor;