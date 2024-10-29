/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect } from "react";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
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
    const location = useLocation();

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
            if (error.response && error.response.status === 401) {
                // If the refresh token is expired, log the user out
                showErrorAlert("Session expired. Please log in again.", "logging in again");
                logoutUser(); // Only call logoutUser if refresh token is expired
            } else {
                // Handle server unresponsive case
                showErrorAlert("Unable to refresh session. Please try again later.", "refreshing your session");
            }
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
            showSuccessAlert("You have successfully logged in.");
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        } catch {
            showErrorAlert("Invalid email or password.", "checking your credentials");
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
                showSuccessAlert("Registration successful! You can now log in.");
                navigate("/login");
            }
        } catch {
            showErrorAlert("Registration failed. Please check your input and try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (uid, token) => {
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/verify-email/`, {
                uid,
                token,
            }, {
                headers: { "Content-Type": "application/json" },
            });
            // Return a success message or a success state
            showSuccessAlert(
                "Email verification successful. You can now log in."
            )
            return { success: true, message: "Email verification successful. You can now log in." };
        } catch (error) {
            // Return a failure message or an error state
            showErrorAlert(
                "Error verifying email—please check the verification link and try again later"
            )
            return { success: false, message: "Error verifying email—please check the verification link and try again later" };
        } finally {
            setLoading(false);
        }
    };


    const resetPassword = async (email) => {
        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/reset-password/`, {
                email
            }, {
                headers: { "Content-Type": "application/json" }
            });
            showSuccessAlert("Password reset email sent successfully. Please check your inbox.");
            navigate("/");
        }
        catch {
            showErrorAlert("Error sending password reset email. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const verifyResetPasswordLink = async (uid, token) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/reset-password/verify/`, 
                { uid, token },  // Sending uid and token in the request body
                { headers: { "Content-Type": "application/json" } }
            );
    
            return response.status === 200;  // Return true if the status is 200
        } catch (error) {
            console.error("Error verifying reset password link:", error);
            return false;  // Return false in case of error
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async (uid, token, newPassword, confirmPassword) => {
        setLoading(true);
        try {
            if (newPassword !== confirmPassword) {
                showErrorAlert("Passwords do not match.");
                setLoading(false);
                return
            }
            const response = await axios.post(`${BASE_URL}/reset-password/confirm/`, {
                uid, token, newPassword
            },{
                headers: { "Content-Type": "application/json" }
            })
            if (response.status === 200) {
                showSuccessAlert("Password updated successfully.");
                navigate("/login");
            }
        }
        catch {
            showErrorAlert("Error updating password. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

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
            showSuccessAlert("You have been logged out successfully.");
            navigate("/login");
        } catch {
            // Keep user logged in if logout fails
            showErrorAlert("Error while logging out. Token may not be blacklisted.");
            // No logout action taken
        }
    };

    const fetchUserData = async () => {
        if (!authTokens) return;

        try {
            const response = await axios.get(`${BASE_URL}/userdata/`, {
                headers: { Authorization: `Bearer ${authTokens.access}` }
            });

            setUser(response.data); // Update the user state with the fetched data
        } catch(error) {
            if(error.response && error.response.status === 401){
                // If the access token is expired, log the user out
                showErrorAlert("Session expired. Please log in again.", "logging in again");
                logoutUser(); // Only call logoutUser if access token is expired
            } else {
                // Handle server unresponsive case
                showErrorAlert("Unable to fetch user data. Please try again later.");
            }
        }
    };

    const clearAuthData = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    const showSuccessAlert = (message) => {
        Swal.fire({
            title: 'Success!',
            text: message,
            icon: "success",
            toast: true,
            position: 'top-right',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
                popup: 'alert-popup',
            },
        });
    };

    const showErrorAlert = (message, action) => {
        Swal.fire({
            title: 'Error!',
            text: message + (action ? ` Please try ${action}.` : ''),
            icon: "error",
            toast: true,
            position: 'top-right',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
                popup: 'alert-popup',
            },
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
        resetPassword,
        verifyResetPasswordLink,
        updatePassword,
        showErrorAlert,
        showSuccessAlert,
        verifyEmail
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
