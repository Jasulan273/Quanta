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

export const handleSocialLogin = (provider) => {
  const urls = {
    google: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=998000786825-bcd7ifc4nkdmf8v6p8rhrbg6g6n9or0d.apps.googleusercontent.com&redirect_uri=https://quantaup.netlify.app/auth/callback&response_type=code&scope=email%20profile',
    github: 'https://github.com/login/oauth/authorize?client_id=Ov23lis9u0BhXqDVRIwn&redirect_uri=https://quantaup.netlify.app/auth/callback&scope=user:email'
  };
  
  localStorage.setItem('authProvider', provider);
  window.location.href = urls[provider];
};