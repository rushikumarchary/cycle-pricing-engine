import axios from 'axios';
import { isAuthenticated } from './auth';

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response?.status === 403) {
      if (!isAuthenticated()) {
        localStorage.removeItem('token');
        window.location.href = '/signIn';
      }
    }

    
    return Promise.reject(error);
  }
);

export default axios; 