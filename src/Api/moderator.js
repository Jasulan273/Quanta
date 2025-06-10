import axios from 'axios';
import { API_URL } from './api';

export const fetchApplications = async () => {
  try {
    const response = await axios.get(`${API_URL}/applies/`);
    console.log(response)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveApplication = async (userId, role) => {
  try {
    const response = await axios.post(
      `${API_URL}/applies/${userId}/${role}/approve/`,
      {}
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectApplication = async (userId, role, data) => {
  try {
    const response = await axios.post(
      `${API_URL}/applies/${userId}/${role}/reject/`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeUserRole = async (userId, data) => {
  try {
    const response = await axios.post(
      `${API_URL}/change-role/${userId}/`,
      data
    );
    console.log(`${API_URL}/change-role/${userId}/`)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deactivateUser = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/${userId}/deactivate/`,
      {}
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreUser = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/${userId}/restore/`,
      {}
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users-list/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAds = async () => {
  try {
    const response = await axios.get(`${API_URL}/advertisements/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAd = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/advertisements/`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAd = async (adId, data) => {
  try {
    const response = await axios.patch(
      `${API_URL}/advertisements/${adId}/`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAd = async (adId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/advertisements/${adId}/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/blog/comments/${commentId}/moderator-delete/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};