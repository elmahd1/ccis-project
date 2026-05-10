import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { CSpinner } from '@coreui/react';
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser({
                    id : decodedToken.id,
                    username: decodedToken.sub,
                    role: decodedToken.role,
                });
            } catch (error) {
                console.error("Invalid token");
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    // NEW: Call this from your Login.jsx component!
    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setUser({
            id : decodedToken.id,
            username: decodedToken.sub,
            role: decodedToken.role,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '#/login'; // Note: CoreUI uses HashRouter by default
    };


    const isAdmin = user?.role === 'ROLE_ADMIN';
    const isEmployee = user?.role === 'ROLE_EMPLOYEE';
    const isClient = user?.role === 'ROLE_CLIENT';

    if (loading) return <div className="pt-3 text-center"><CSpinner color="primary" variant="grow" /></div>; 

    return (
        <AuthContext.Provider value={{ user, isAdmin, isEmployee, isClient, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};



