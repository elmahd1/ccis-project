import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Base URL for your backend
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Expired Tokens
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid, force logout
            localStorage.removeItem('token');
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

// axiosInstance.js - Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login'; 
        }
        if (error.response && error.response.status === 403) {
            // Optional: Use CoreUI Toasts or a simple alert
            alert("Accès refusé : Vous n'avez pas les droits d'administrateur.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;