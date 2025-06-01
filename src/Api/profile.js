import axios from 'axios';
import { API_URL } from './api';

export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await axios.get(`${API_URL}/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    return null;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');
    const filteredData = Object.fromEntries(
      Object.entries(profileData).filter(([_, v]) => v !== undefined)
    );
    const response = await axios.patch(
      `${API_URL}/profile/edit/`,
      filteredData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUserAvatar = async (avatarFile) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('No access token found');

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await axios.patch(
      `${API_URL}/profile/edit/`,
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
    console.error('Error updating avatar:', error.response?.data || error.message);
    throw error;
  }
};