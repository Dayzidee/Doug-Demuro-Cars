import axios from 'axios';

// In a real app, this should be loaded from environment variables
const API_BASE_URL = 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios request interceptor to add the JWT token to the Authorization header.
 * This ensures that every authenticated request includes the necessary token.
 */
apiClient.interceptors.request.use(
  (config) => {
    // This is a placeholder for getting the token. In a real app, this would
    // come from a secure source like the auth context or secure storage.
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
