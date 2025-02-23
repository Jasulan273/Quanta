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
      updatedData, // Данные для обновления
      {
        headers: {
          Authorization: `Bearer ${token}`, // Токен авторизации
          Accept: 'application/json', // Ожидаем JSON в ответе
          'Content-Type': 'application/json', // Указываем тип содержимого
        },
      }
    );

    return response.data; // Возвращаем обновленные данные курса
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

    console.log("Login Response:", data); // Логируем весь ответ

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