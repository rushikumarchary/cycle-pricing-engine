import axios from 'axios';
import { isAuthenticated } from './auth';

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Only handle as session expired if the token is actually expired
      if (!isAuthenticated()) {
        localStorage.removeItem('token');
        window.location.href = '/signIn';
      }
    }
    return Promise.reject(error);
  }
);

export default axios; 