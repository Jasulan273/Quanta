import { API_URL } from './api';

export const fetchLesson = async (courseId, moduleId, lessonId) => {
  try {
    const response = await fetch(
      `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Lesson not found');
    }
    const data = await response.json();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.content || '', 'text/html');
    const images = doc.querySelectorAll('img');
    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && src.startsWith('/')) {
        img.setAttribute('src', `${API_URL}${src}`);
      }
    });
    const updatedContent = doc.body.innerHTML;

    return {
      name: data.name || '',
      short_description: data.short_description || '',
      video_url: data.video_url || '',
      uploaded_video: null,
      content: updatedContent,
    };
  } catch (err) {
    throw new Error(`Failed to fetch lesson: ${err.message}`);
  }
};

export const updateLesson = async (courseId, moduleId, lessonId, lessonData) => {
  const contentToSend = lessonData.content;
  const payload = {
    lesson_id: parseInt(lessonId),
    name: lessonData.name,
    short_description: lessonData.short_description,
    video_url: lessonData.video_url || null,
    uploaded_video: null,
    content: contentToSend,
  };

  let response;
  if (lessonData.uploaded_video) {
    const formData = new FormData();
    formData.append('lesson_id', lessonId);
    formData.append('name', lessonData.name);
    formData.append('short_description', lessonData.short_description);
    formData.append('content', contentToSend);
    if (lessonData.video_url) formData.append('video_url', lessonData.video_url);
    formData.append('uploaded_video', lessonData.uploaded_video);

    response = await fetch(
      `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      }
    );
  } else {
    response = await fetch(
      `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to update lesson with status ${response.status}`);
  }
};

export const fetchExercises = async (courseId, moduleId, lessonId) => {
  try {
    const response = await fetch(
      `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Exercises not found');
    }
    return await response.json();
  } catch (err) {
    throw new Error(`Failed to fetch exercises: ${err.message}`);
  }
};

export const createExercise = async (courseId, moduleId, lessonId, exerciseData) => {
  try {
    const response = await fetch(
      `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create exercise');
    }
  } catch (err) {
    throw new Error(`Failed to create exercise: ${err.message}`);
  }
};

export const updateMCQExercise = async (courseId, moduleId, lessonId, exerciseData) => {
  try {
    const response = await fetch(
      `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/edit-mcq`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update MCQ exercise');
    }
  } catch (err) {
    throw new Error(`Failed to update MCQ exercise: ${err.message}`);
  }
};

export const updateCodeExercise = async (courseId, moduleId, lessonId, exerciseData) => {
  try {
    const response = await fetch(
      `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/edit-code`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update code exercise');
    }
  } catch (err) {
    throw new Error(`Failed to update code exercise: ${err.message}`);
  }
};

export const deleteExercises = async (courseId, moduleId, lessonId, exerciseData) => {
  try {
    const response = await fetch(
      `${API_URL}/author/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/delete`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete exercises');
    }
  } catch (err) {
    throw new Error(`Failed to delete exercises: ${err.message}`);
  }
};