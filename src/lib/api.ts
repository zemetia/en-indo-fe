import axios from 'axios';
import { getToken } from '@/lib/helper';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if NOT on auth-related endpoints
      const isAuthEndpoint = error.config?.url?.includes('/api/user/login') || 
                             error.config?.url?.includes('/api/user/register') ||
                             error.config?.url?.includes('/api/user/auth/setup-password');
      
      // Token expired or invalid, redirect to login (except for auth endpoints)
      if (!isAuthEndpoint && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // For all other HTTP errors (402, 500, etc.), do not refresh or redirect the page
    // Let the individual components handle the errors gracefully
    // This prevents unexpected page reloads during error scenarios
    
    return Promise.reject(error);
  }
);

export default apiClient;