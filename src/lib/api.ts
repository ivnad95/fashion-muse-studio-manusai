import axios from 'axios';

// Configure your backend URL here
export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

// Create axios instance for API calls
export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage?.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage?.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

