import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import PropTypes from 'prop-types';



const PrivateRoute = ({ element }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    return user ? element : <Navigate to="/login" state={{ from: location }} />;
};

PrivateRoute.propTypes = {
    element: PropTypes.element.isRequired,
};

// Export the component as default
export default PrivateRoute;
