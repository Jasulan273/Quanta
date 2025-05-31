import axios from 'axios';
import { API_URL } from './api';

export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup/`, {
      username,
      email,
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