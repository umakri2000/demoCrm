import axios from 'axios';

let memoryToken: string | null = null;

export var setAuthToken = (token: string | null) => {
  memoryToken = token;
};

var axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
axiosInstance.interceptors.request.use(
  (config) => {
    if (memoryToken) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server responds with 401 Unauthorized
    if (error.response && error.response.status === 401) {
      var url = error.config?.url || '';

      // Do not trigger a global reload for authentication endpoints
      if (!url.includes('/auth/login') && !url.includes('/auth/register') && !url.includes('/auth/refresh')) {
        console.warn('Unauthorized request detected. Clearing session.');
        setAuthToken(null);

        // Force page reload to reset React state and redirect back to Login page
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        } else {
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
