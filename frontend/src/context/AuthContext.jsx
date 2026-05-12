import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { CSpinner } from '@coreui/react';
import axiosInstance from '../api/axiosInstance';
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accountStatus, setAccountStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const storedUserId = sessionStorage.getItem('userId');
        
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser({
                    id: decodedToken.id || decodedToken.userId,
                    username: decodedToken.sub,
                    role: decodedToken.role,
                });
                
                // Fetch account status if we have user ID
                if (storedUserId) {
                    fetchAccountStatus(storedUserId);
                } else if (decodedToken.id || decodedToken.userId) {
                    const userId = decodedToken.id || decodedToken.userId;
                    sessionStorage.setItem('userId', userId);
                    fetchAccountStatus(userId);
                }
            } catch (error) {
                console.error("Invalid token", error);
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userId');
            }
        }
        setLoading(false);
    }, []);

    const fetchAccountStatus = async (userId) => {
        try {
            const response = await axiosInstance.get(`/auth/account-status/${userId}`);
            setAccountStatus(response.data.accountStatus);
            
            // Store additional info
            if (response.data.profileCompleted) {
                sessionStorage.setItem('profileCompleted', 'true');
            }
        } catch (error) {
            console.error("Failed to fetch account status", error);
        }
    };

    const login = (token, userData) => {
        sessionStorage.setItem('token', token);
        
        let userId = userData?.id;
        let userRole = userData?.role;
        let userStatus = userData?.accountStatus;
        
        if (!userId && token) {
            try {
                const decodedToken = jwtDecode(token);
                userId = decodedToken.id || decodedToken.userId;
                userRole = decodedToken.role;
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }
        
        if (userId) {
            sessionStorage.setItem('userId', userId);
        }
        
        setUser({
            id: userId,
            username: userData?.username || userData?.sub,
            role: userRole,
        });
        
        setAccountStatus(userStatus);
        
        // Store profile completion status
        const profileCompleted = userData?.profileCompleted === true;
        sessionStorage.setItem('profileCompleted', profileCompleted ? 'true' : 'false');
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('profileCompleted');
        setUser(null);
        setAccountStatus(null);
        window.location.href = '#/login';
    };

    const updateAccountStatus = (status) => {
        setAccountStatus(status);
    };

    const isAdmin = user?.role === 'ROLE_ADMIN';
    const isEmployee = user?.role === 'ROLE_EMPLOYEE';
    const isClient = user?.role === 'ROLE_CLIENT';
    
    const needsProfileCompletion = accountStatus === 'PENDING_PROFILE_COMPLETION';
    const needsActivation = accountStatus === 'PENDING_ACTIVATION';
    const isActive = accountStatus === 'ACTIVE';

    return (
        <AuthContext.Provider value={{ 
            user, 
            accountStatus,
            isAdmin, 
            isEmployee, 
            isClient,
            needsProfileCompletion,
            needsActivation,
            isActive,
            login, 
            logout,
            updateAccountStatus
        }}>
            {children}
        </AuthContext.Provider>
    );
};