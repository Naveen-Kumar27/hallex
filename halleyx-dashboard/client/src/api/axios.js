import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxied in Vite to http://localhost:5000/api
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
