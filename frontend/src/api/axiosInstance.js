import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
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
            localStorage.removeItem('token');
            window.location.href = '#/login'; // Added '#' for HashRouter
        }
        if (error.response && error.response.status === 403) {
            const token = localStorage.getItem('token');

            if (token) {
                const decoded = jwtDecode(token);
                const role = decoded.role;

                // Redirect based on role
                if (role === 'ROLE_ADMIN' || role === 'ROLE_EMPLOYEE') {
                    window.location.href = '#/dashboard';
                } else if (role === 'ROLE_CLIENT') {
                    window.location.href = '#/client/workspaces';
                } else if (role === 'ROLE_EMPLOYEE') {

                    window.location.href = '#/employee/inbox';}
            }
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;