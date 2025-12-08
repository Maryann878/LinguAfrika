/**
 * Get the full URL for a profile image
 * Handles both relative paths (from backend) and absolute URLs
 */
export const getProfileImageUrl = (imagePath?: string | null): string | null => {
  if (!imagePath) return null;
  
  // If it's already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the API URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};


