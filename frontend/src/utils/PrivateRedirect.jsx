/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRedirect = ({ element }) => {
    const { user } = useContext(AuthContext);

    // Redirect logged-in users to the dashboard
    return user ? <Navigate to="/dashboard" replace /> : element;
};

// Export the component as default
export default PrivateRedirect;
