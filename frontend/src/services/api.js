import axios from 'axios';
import { BASE_URL } from '../config'; // Import from our new config file

const API = axios.create({
  baseURL: BASE_URL
});

// Using an interceptor to automatically attach the auth token.
// This is more reliable than adding it to every call manually.
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure the 'api' part is included if your backend routes are nested
      // Example: baseURL/api/auth/login
      config.url = `/api${config.url}`; 
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // For public routes like login/register
      config.url = `/api${config.url}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;