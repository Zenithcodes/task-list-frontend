import axios from 'axios';
import store from '../app/store'; // Update path if different
import { logout, setCredentials } from '../features/auth/authSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        store.dispatch(setCredentials({ user: store.getState().auth.user, token: newAccessToken }));
        localStorage.setItem('token', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        window.location.href = '/'; 
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
