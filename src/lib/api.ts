
import axios from 'axios';
import Cookies from 'js-cookie';

// Base API URL - ensure this points to your backend server (port 5000)
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Try to get token from both cookie and localStorage
    const token = Cookies.get('auth_token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API calls
export const authAPI = {
  // Initiate Lark login - this initiates the Lark OAuth flow
  login: () => api.get('/api/auth/lark/login'),
  
  // Get current user
  getMe: () => api.get('/api/auth/me'),
};

// Export the API instance for other modules to use
export default api;
