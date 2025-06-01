import axios from 'axios';
import { API_URL } from './api';

export const updateCourse = async (courseId, updatedData, courseImage = null) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found');
    }

    const formData = new FormData();
    
   
    for (const key in updatedData) {
      if (updatedData[key] !== undefined && updatedData[key] !== null) {
        formData.append(key, updatedData[key]);
      }
    }

    if (courseImage) {
      formData.append('course_image', courseImage);
    }

    const response = await axios.patch(
      `${API_URL}/author/courses/${courseId}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error.response?.data || error.message);
    console.error('Failed to update course:', error);
    console.error('Response:', error.response);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    alert(`Failed to update course: ${error.response?.data?.detail || error.message}`);
    throw error;
  }
};

export const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const enrollInCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');

    const response = await axios.post(`${API_URL}/courses/${courseId}/enroll/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error enrolling in course:', error.response?.data || error.message);
    throw error;
  }
};

export const unenrollFromCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');

    const response = await axios.post(`${API_URL}/courses/${courseId}/unenroll/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error unenrolling from course:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchMyCourses = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');
    const response = await axios.get(`${API_URL}/mycourses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching my courses:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchAuthorCourses = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');
    const response = await axios.get(`${API_URL}/author/courses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching author courses:', error.response?.data || error.message);
    throw error;
  }
};