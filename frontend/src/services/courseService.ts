import api from './api';

export const getAllCourses = async () => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get courses');
  }
};

export const getCourseById = async (id: string) => {
  try {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get course');
  }
};

export const getCourseByName = async (name: string) => {
  try {
    const response = await api.get(`/courses/name/${name}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get course');
  }
};

export const getUserProgress = async (courseId: string) => {
  try {
    const response = await api.get(`/courses/${courseId}/progress`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get progress');
  }
};

export const getAllUserProgress = async () => {
  try {
    const response = await api.get('/courses/progress/all');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user progress');
  }
};

export const updateProgress = async (courseId: string, data: {
  lessonId?: string;
  status?: string;
  progress?: number;
  currentLesson?: number;
}) => {
  try {
    const response = await api.put(`/courses/${courseId}/progress`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update progress');
  }
};

