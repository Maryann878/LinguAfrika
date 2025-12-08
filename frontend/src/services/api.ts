import axios from 'axios';
import { getAuthToken, clearAuthTokens } from '@/utils/security';

// Use environment variable for API URL, fallback to /api for local dev
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

    // Handle specific error cases
    if (status === 401) {
      // Unauthorized - clear token and redirect to login
      clearAuthTokens();
      window.location.href = '/login';
    } else if (status === 429) {
      // Rate limit exceeded
      error.rateLimitError = true;
      error.userMessage = message || 'Too many requests. Please try again later.';
    } else if (status === 400) {
      // Bad request - validation errors
      error.userMessage = message || 'Invalid request. Please check your input.';
    } else if (status === 404) {
      // Not found
      error.userMessage = message || 'Resource not found.';
    } else if (status === 500) {
      // Server error
      error.userMessage = 'Server error. Please try again later.';
    } else if (!error.response) {
      // Network error
      error.userMessage = 'Network error. Please check your connection.';
    } else {
      error.userMessage = message;
    }

    return Promise.reject(error);
  }
);

export default api;


