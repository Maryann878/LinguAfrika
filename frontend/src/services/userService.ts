import api from './api';

export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user');
  }
};

export const updateProfile = async (data: any) => {
  try {
    const response = await api.put('/users/profile', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const updateOnboarding = async (data: {
  gender?: string;
  ageRange?: string;
  country?: string;
  location?: string;
  goals?: string[];
}) => {
  try {
    const response = await api.put('/users/onboarding', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update onboarding');
  }
};

export const uploadProfileImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', file);

    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    const response = await fetch(`${apiUrl}/api/users/profile/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type, let browser set it with boundary for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    // Return full URL for the image
    if (data.success && data.data.profileImage) {
      data.data.profileImage = `${apiUrl}${data.data.profileImage}`;
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload profile image');
  }
};

