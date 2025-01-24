import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL;


export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup/`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
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

export const handleLogin = async (username, password, setError, setUser, navigate) => {
  try {
    const data = await loginUser(username, password);
    setError("");
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("username", username);
    setUser(username);
    navigate("/Home");
  } catch (err) {
    setError("Invalid credentials. Please try again.");
  }
};
