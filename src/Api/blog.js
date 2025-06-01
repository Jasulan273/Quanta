import axios from 'axios';
import { API_URL } from './api';

export const fetchBlogPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/blog/posts/`);
    return Array.isArray(response.data.results) ? response.data.results : [];
  } catch (error) {
    console.error('Error fetching blog posts:', error.response?.data || error.message);
    return [];
  }
};

export const fetchBlogPostById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/blog/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('API request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};

export const fetchAuthorBlogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/author/blogs/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    throw new Error(`Failed to fetch blogs: ${err.message}`);
  }
};

export const fetchBlog = async (blogId) => {
  try {
    const response = await axios.get(`${API_URL}/author/blogs/${blogId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    const data = response.data;
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

    return {
      title: data.title || '',
      short_description: data.short_description || '',
      content: updatedContent,
      image: null,
      published: data.published ?? false
    };
  } catch (err) {
    throw new Error(`Failed to fetch blog: ${err.message}`);
  }
};

export const createBlog = async (blogData) => {
  const contentToSend = document.getElementById('content-fallback')?.value || blogData.content;
  const payload = {
    title: blogData.title,
    short_description: blogData.short_description,
    content: contentToSend,
    published: blogData.published
  };

  try {
    let response;
    if (blogData.image) {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('short_description', blogData.short_description);
      formData.append('content', contentToSend);
      formData.append('image', blogData.image);
      formData.append('published', blogData.published);

      response = await axios.post(`${API_URL}/author/blogs/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } else {
      response = await axios.post(`${API_URL}/author/blogs/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    }
    return response.data;
  } catch (err) {
    throw new Error(`Failed to create blog: ${err.response?.data?.detail || err.message}`);
  }
};

export const updateBlog = async (blogId, blogData) => {
  const contentToSend = document.getElementById('content-fallback')?.value || blogData.content;
  const payload = {
    title: blogData.title,
    short_description: blogData.short_description,
    content: contentToSend,
    published: blogData.published
  };

  try {
    let response;
    if (blogData.image) {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('short_description', blogData.short_description);
      formData.append('content', contentToSend);
      formData.append('image', blogData.image);
      formData.append('published', blogData.published);

      response = await axios.patch(`${API_URL}/author/blogs/${blogId}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } else {
      response = await axios.patch(`${API_URL}/author/blogs/${blogId}/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    }
    return response.data;
  } catch (err) {
    throw new Error(`Failed to update blog: ${err.response?.data?.detail || err.message}`);
  }
};

export const deleteBlog = async (blogId) => {
  try {
    await axios.delete(`${API_URL}/author/blogs/${blogId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  } catch (err) {
    throw new Error(`Failed to delete blog: ${err.response?.data?.detail || err.message}`);
  }
};