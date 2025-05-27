import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (username, email, password, confirmPassword) => {
  try {
    const response = await axios.post(`${API_URL}/signup/`, {
      username,
      email,
      password1: password,
      password2: confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const updateCourse = async (courseId, updatedData) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found');
    }
    
    const response = await axios.patch(
      `https://quant.up.railway.app/author/course/${courseId}/`,
      updatedData,
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
    console.error('Error updating course:', error.response?.data || error.message);
    console.error('Failed to update course:', error);
    console.error('Response:', error.response);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    alert(`Failed to update course: ${error.response?.data?.detail || error.message}`);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });
    console.log("Login Response:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/token/refresh/`);
    return response.data;
  } catch (error) {
    console.error('Error during token refresh:', error);
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

export const handleLogin = async (username, password, setError, setUser, navigate) => {
  try {
    const data = await loginUser(username, password);
    console.log("Login Response:", data); 
    if (!data.access) {
      throw new Error("Missing access token in response");
    }
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("username", username);
    setUser(username);
    console.log("Saved Access Token:", localStorage.getItem("accessToken"));
    navigate("/Home");
  } catch (err) {
    setError("Invalid credentials. Please try again.");
    console.error("Login error:", err);
  }
};

export const handleRegister = async (username, email, password, confirmPassword, setError, setUser, navigate) => {
  try {
    await registerUser(username, email, password, confirmPassword);
    setError("");
    await handleLogin(username, password, setError, setUser, navigate);
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    setError("Registration failed. Please check your details and try again.");
  }
};

export const enrollInCourse = async (courseId) => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No access token found');

  const response = await axios.post(`${API_URL}/courses/${courseId}/enroll/`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const unenrollFromCourse = async (courseId) => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No access token found');

  const response = await axios.post(`${API_URL}/courses/${courseId}/unenroll/`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchEnrolledCourses = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No access token found');

  const response = await axios.get(`${API_URL}/mycourses/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};