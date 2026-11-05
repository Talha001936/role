<<<<<<< HEAD
=======


>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

let onUnauthorized = null;
<<<<<<< HEAD

export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};
=======
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870

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