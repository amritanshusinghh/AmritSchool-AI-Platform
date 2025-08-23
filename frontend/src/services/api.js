import axios from 'axios';
import { BASE_URL } from '../config';
import { removeToken } from '../utils/authUtils'; // Import removeToken utility
import { toast } from 'react-hot-toast'; // Import toast for notifications

const API = axios.create({
  baseURL: BASE_URL
});

// Request interceptor to attach the auth token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.url = `/api${config.url}`; 
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.url = `/api${config.url}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- START: New Feature ---
// Response interceptor to handle expired tokens and automatic logout
API.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  (error) => {
    // Check if the error is due to an expired token (401 or 403 status)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // Remove the invalid token from storage
      removeToken();
      
      // Show a notification to the user
      toast.error("Your session has expired. Please log in again.");

      // Redirect the user to the login page
      // This ensures they are seamlessly logged out
      window.location.href = '/login'; 
    }
    
    // Return the error for other cases
    return Promise.reject(error);
  }
);
// --- END: New Feature ---

export default API;