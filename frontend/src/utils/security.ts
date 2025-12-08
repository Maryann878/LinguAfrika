/**
 * Security utilities for XSS protection and secure data handling
 */

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Safely get item from localStorage with error handling
 */
export const safeGetStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Safely set item in localStorage with error handling
 */
export const safeSetStorage = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Safely remove item from localStorage
 */
export const safeRemoveStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Safely get item from sessionStorage
 */
export const safeGetSessionStorage = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from sessionStorage (${key}):`, error);
    return null;
  }
};

/**
 * Safely set item in sessionStorage
 */
export const safeSetSessionStorage = (key: string, value: string): boolean => {
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing to sessionStorage (${key}):`, error);
    return false;
  }
};

/**
 * Securely get auth token
 */
export const getAuthToken = (): string | null => {
  return safeGetStorage('token') || safeGetStorage('authToken');
};

/**
 * Securely set auth token
 */
export const setAuthToken = (token: string): boolean => {
  const sanitized = sanitizeInput(token);
  if (!sanitized) return false;
  
  safeSetStorage('token', sanitized);
  safeSetStorage('authToken', sanitized);
  return true;
};

/**
 * Securely clear auth tokens
 */
export const clearAuthTokens = (): void => {
  safeRemoveStorage('token');
  safeRemoveStorage('authToken');
  safeRemoveStorage('user');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

