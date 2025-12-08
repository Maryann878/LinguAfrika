/**
 * Centralized error handling utility
 * Provides consistent error messages and handling across the app
 */

export interface ApiError {
  message?: string;
  userMessage?: string;
  rateLimitError?: boolean;
  status?: number;
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

/**
 * Extract user-friendly error message from error object
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  const apiError = error as ApiError;

  // Use userMessage if available (set by API interceptor)
  if (apiError.userMessage) {
    return apiError.userMessage;
  }

  // Check for rate limit errors
  if (apiError.rateLimitError || apiError.response?.status === 429) {
    return 'Too many requests. Please try again later.';
  }

  // Check response data message
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }

  // Check direct message
  if (apiError.message) {
    return apiError.message;
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Get error variant for toast notification
 */
export const getErrorVariant = (error: unknown): 'destructive' | 'warning' | 'default' => {
  const apiError = error as ApiError;
  const status = apiError.status || apiError.response?.status;

  if (status === 429) {
    return 'warning'; // Rate limit - use warning instead of destructive
  }

  if (status === 400 || status === 401 || status === 403) {
    return 'destructive';
  }

  if (status === 500 || status === 502 || status === 503) {
    return 'destructive';
  }

  return 'default';
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  const apiError = error as ApiError;
  return !apiError.response && (apiError.message?.includes('Network') ?? false);
};

