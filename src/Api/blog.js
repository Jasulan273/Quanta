import axios from 'axios';
import { API_URL } from './api';

export const fetchBlogPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/blog/posts/`);
    console.log('Blog Posts Response:', response.data);
    return Array.isArray(response.data.results) ? response.data.results : [];
  } catch (error) {
    console.error('Error fetching blog posts:', error.response?.data || error.message);
    return [];
  }
};

export const fetchBlogPostById = async (id) => {
  try {
    const url = `${API_URL}/blog/posts/${id}`;
    console.log('Making request to:', url);
    
    const response = await axios.get(url);
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    
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