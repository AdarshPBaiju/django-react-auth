/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext"; // Ensure this path is correct

const PrivateRedirect = ({ element }) => {
    const { user, loading } = useContext(AuthContext);

    // Show a loading state if data is being fetched
    if (loading) return <div>Loading...</div>; // Optional: add a loading spinner or message

    // Redirect logged-in users to the dashboard
    return user ? <Navigate to="/dashboard" replace /> : element;
};

// Export the component as default
export default PrivateRedirect;

