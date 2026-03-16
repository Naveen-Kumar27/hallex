import axios from 'axios';

console.log('axios: VITE_API_URL is:', import.meta.env.VITE_API_URL);
console.log('axios: Resolved Base URL:', import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add the Authorization token from local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
