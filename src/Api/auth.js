import axios from 'axios';
import { API_URL } from './api';

export const registerUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup/`, {
      username,
      email,
      password
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error.response?.data || error.message);
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

export const verifyEmail = async (key) => {
  try {
    const response = await axios.post(`${API_URL}/account/confirm-email/`, {
      key,
    });
    return response.data;
  } catch (error) {
    console.error('Error during email verification:', error);
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
  const message = err?.response?.data?.detail || 'Login failed. Please try again.';
  setError(message);
}
};

export const handleRegister = async (username, email, password, confirmPassword, setError, setUser, navigate) => {
  try {
    await registerUser(username, email, password);
    setError("");
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    if (error.response?.data?.detail) {
      setError(error.response.data.detail);
    } else if (error.response?.data) {
      const errorMessages = Object.entries(error.response.data)
        .map(([key, val]) => `${key}: ${val instanceof Array ? val.join(', ') : val}`)
        .join('\n');
      setError(errorMessages);
    } else {
      setError("Registration failed. Please check your details and try again.");
    }
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