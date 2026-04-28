import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user, isAdmin } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />; // Not logged in
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />; // Logged in, but not an admin
    }

    return children;
};