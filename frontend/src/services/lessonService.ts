import api from './api';

export const getLessonsByCourse = async (courseId: string, level?: string) => {
  try {
    const params = level ? { level } : {};
    const response = await api.get(`/lessons/course/${courseId}`, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get lessons');
  }
};

export const getLevelsByCourse = async (courseId: string) => {
  try {
    const response = await api.get(`/lessons/course/${courseId}/levels`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get levels');
  }
};

export const getLessonById = async (id: string) => {
  try {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get lesson');
  }
};


