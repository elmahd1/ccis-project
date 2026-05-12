import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Expired Tokens and Account Status
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle account status issues
        if (error.response && error.response.status === 403) {
            const errorMsg = error.response.data?.error || '';
            
            // Check if account needs profile completion
            if (errorMsg.includes('compléter votre profil') || errorMsg.includes('PENDING_PROFILE_COMPLETION')) {
                const userId = sessionStorage.getItem('userId');
                if (userId) {
                    window.location.href = `#/complete-profile/${userId}`;
                    return Promise.reject(error);
                }
            }
            
            // Account pending activation
            if (errorMsg.includes('activation') || errorMsg.includes('PENDING_ACTIVATION')) {
                window.location.href = '#/pending-activation';
                return Promise.reject(error);
            }
            
            // Account suspended or rejected
            if (errorMsg.includes('suspendu') || errorMsg.includes('rejeté')) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userId');
                window.location.href = '#/login';
                return Promise.reject(error);
            }
        }
        
        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userId');
            window.location.href = '#/login';
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;