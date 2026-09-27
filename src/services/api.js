import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://airbackend-zfvt.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token injection
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aero_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with error formatting
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('[Render Backend API Error]:', error.message);
    const customError = {
      message: error.response?.data?.error || error.message || 'Render backend telemetry service unavailable.',
      status: error.response?.status,
      isNetworkError: !error.response,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
export { API_BASE_URL };
