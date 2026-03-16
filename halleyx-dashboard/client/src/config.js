export const getBackendUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (apiUrl && (apiUrl.includes('https://') || apiUrl.includes('http://'))) {
    return apiUrl.replace('/api', '');
  }
  
  // Fallback for local development if VITE_API_URL is missing
  return 'http://localhost:5000';
};

export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || '/api';
};

export const SOCKET_URL = getBackendUrl();
export const API_BASE_URL = getApiUrl();
