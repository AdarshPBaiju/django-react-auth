/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect } from "react";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';

// Define a base URL for the API (consider using environment variables)
const BASE_URL = "http://127.0.0.1:8000/api"; 

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const tokens = localStorage.getItem("authTokens");
        return tokens ? JSON.parse(tokens) : null;
    });

    const [user, setUser] = useState(() => {
        const tokens = localStorage.getItem("authTokens");
        return tokens ? jwt_decode(tokens) : null;
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkTokenValidity();
    }, []); // Only run once on mount

    const checkTokenValidity = async () => {
        if (!authTokens) {
            setLoading(false);
            return;
        }

        const isTokenExpired = () => {
            const currentTime = Math.floor(Date.now() / 1000);
            return jwt_decode(authTokens.access).exp < currentTime;
        };

        if (isTokenExpired()) {
            await refreshAuthToken();
        } else {
            await fetchUserData(); // Fetch user data if token is still valid
        }

        setLoading(false);
    };

    const refreshAuthToken = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/token/refresh/`, {
                refresh: authTokens.refresh
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            setAuthTokens(response.data);
            localStorage.setItem("authTokens", JSON.stringify(response.data));
            await fetchUserData(); // Fetch updated user data after refreshing token
        } catch (error) {
            console.error("Token refresh error:", error);
            logoutUser(); // Logout if token refresh fails
        }
    };

    const loginUser = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/token/`, { email, password }, {
                headers: { "Content-Type": "application/json" }
            });

            setAuthTokens(response.data);
            setUser(jwt_decode(response.data.access));
            localStorage.setItem("authTokens", JSON.stringify(response.data));

            await fetchUserData(); // Fetch user data after login
            navigate("/");
            showSuccessAlert("Login Successful");
        } catch (error) {
            console.error("Login error:", error);
            showErrorAlert("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (email, username, password, password2) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/register/`, {
                email, username, password, password2
            }, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 201) {
                navigate("/login");
                showSuccessAlert("Registration Successful, Login Now");
            }
        } catch (error) {
            console.error("Registration error:", error);
            showErrorAlert("An Error Occurred: " + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        try {
            if (authTokens) {
                await axios.post(`${BASE_URL}/token/logout/`, {
                    refresh: authTokens.refresh
                }, {
                    headers: { "Content-Type": "application/json" }
                });
            }

            clearAuthData();
            navigate("/login");
            showSuccessAlert("You have been logged out...");
        } catch (error) {
            console.error('Error during logout:', error);
            clearAuthData();
            navigate("/login");
            showErrorAlert("Error while logging out. Token may not be blacklisted.");
        }
    };

    const fetchUserData = async () => {
        if (!authTokens) return;

        try {
            const response = await axios.get(`${BASE_URL}/userdata/`, {
                headers: { Authorization: `Bearer ${authTokens.access}` }
            });

            setUser(response.data); // Update the user state with the fetched data
        } catch (error) {
            console.error("Error fetching user data:", error);
            logoutUser(); // Logout user if fetching data fails
        }
    };

    const clearAuthData = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    const showSuccessAlert = (message) => {
        Swal.fire({
            title: message,
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };

    const showErrorAlert = (message) => {
        Swal.fire({
            title: message,
            icon: "error",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
        fetchUserData,
        loading,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
