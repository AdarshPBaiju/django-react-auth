/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// ProtectedRoute component to restrict access based on authentication and roles
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useContext(AuthContext);


    // If user is not loaded yet, show a loading state
    if (!user) {
        return <p>Loading...</p>;
    }

    console.log(user.role)

    // Check if user is authenticated and their role is allowed
    if (isAuthenticated && allowedRoles.includes(user.role)) {
        return <Outlet />; // Render the child routes
    }

    // Redirect based on authentication status and role
    return isAuthenticated ? <Navigate to="/unauthorized" /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
