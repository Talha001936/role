

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const skip = err.config?.skipAuthHandler === true;
    if (err.response?.status === 401 && onUnauthorized && !skip) {
      onUnauthorized();
    }
    return Promise.reject(err);
  }
);

export default api;