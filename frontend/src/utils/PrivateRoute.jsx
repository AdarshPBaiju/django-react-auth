import { Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import PropTypes from "prop-types";

const PrivateRoute = ({ element }) => {
    const { loading, isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    // Run token validity check when component mounts
    // useEffect(() => {
    //     checkTokenValidity();
    // }, []);

    // Show loading indicator while checking authentication
    if (loading) {
        return <div className="mt-[250px]">Loading...</div>;
    }

    // If the user is authenticated, render the element; otherwise, redirect to login
    return isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} replace />;
};

PrivateRoute.propTypes = {
    element: PropTypes.element.isRequired,
};

export default PrivateRoute;
