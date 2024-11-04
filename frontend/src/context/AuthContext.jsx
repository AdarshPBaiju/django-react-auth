/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { jwtDecode as jwt_decode, jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from "react-toastify";


const BASE_URL = "http://127.0.0.1:8000/api"; 

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const tokens = localStorage.getItem("authTokens");
        return tokens ? JSON.parse(tokens) : null;
    });

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     checkTokenValidity();
    // }, []);

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
            console.log('Token expired')
            await refreshAuthToken();
        } else {
            console.log('Token valid')
            await fetchUserData(); // Fetch user data if token is still valid
        }

        setLoading(false);
    };

    const isRefreshTokenExpired = (refreshToken) => {
        if (!refreshToken) return true;
        const decodedToken = jwtDecode(refreshToken);
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedToken.exp < currentTime;
      };
    

    const refreshAuthToken = async () => {
        setLoading(true)
        // if (isRefreshTokenExpired(authTokens.refresh)) {
        //     console.log("Refresh token expired.");
        //     logoutUser("Session Expired Pls Login Again 5"); // Call logoutUser if the refresh token is expired
        //     setLoading(false)
        //     return;
        //   }
        try {
            if (!authTokens) {
                setLoading(false)
                logoutUser();
                return;
            }
            console.log('Refreshing auth token')
            const response = await axios.post(`${BASE_URL}/token/refresh/`, {
                refresh: authTokens.refresh
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Update authTokens state and local storage
            setAuthTokens(response.data);
            localStorage.setItem("authTokens", JSON.stringify(response.data));
            console.log(response.data)
            console.log('refreshed')

            await fetchUserData(response.data.access);
        } catch(e){
            setLoading(false)
            if (e.response && e.response.status === 401) {
                console.log('Unauthorized')
                logoutUser('Session Expired Please log in again');
            } else {
                showErrorAlert('Unsable to refresh token')
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
            localStorage.setItem("authTokens", JSON.stringify(response.data));

            await fetchUserData(response.data.access);

             // Fetch user data after login
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
            showSuccessAlert("Email verification successful. You can now log in.");
            return { success: true, message: "Email verification successful. You can now log in." };
        } catch (error) {
            showErrorAlert("Error verifying email—please check the verification link and try again later");
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
        } catch {
            showErrorAlert("Error sending password reset email. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const verifyResetPasswordLink = async (uid, token) => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/reset-password/verify/`, 
                { uid, token },
                { headers: { "Content-Type": "application/json" } }
            );
            return response.status === 200; // Return true if the status is 200
        } catch (error) {
            console.error("Error verifying reset password link:", error);
            return false; // Return false in case of error
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
                return;
            }
            const response = await axios.post(`${BASE_URL}/reset-password/confirm/`, {
                uid, token, newPassword
            }, {
                headers: { "Content-Type": "application/json" }
            });
            if (response.status === 200) {
                showSuccessAlert("Password updated successfully.");
                navigate("/login");
            }
        } catch {
            showErrorAlert("Error updating password. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const logoutUser = async (successMessage) => {
        const tokenString = localStorage.getItem('authTokens');
        let token;
    
        // Parse the token if it exists
        try {
            if (tokenString) {
                token = JSON.parse(tokenString);
            }
        } catch (error) {
            console.error("Failed to parse authTokens:", error);
        }
    
        // Proceed with logout if the refresh token is available
        if (token && token.refresh) {
            try {
                await axios.post(`${BASE_URL}/token/logout/`, {
                    refresh: token.refresh
                }, {
                    headers: { "Content-Type": "application/json" }
                });
    
                clearAuthData();
                if (successMessage) {
                    showErrorAlert(successMessage);
                } else {
                    showSuccessAlert("You have been logged out successfully.");
                }
                navigate("/login");
            } catch (error) {
                console.error("Error during logout:", error);
                showErrorAlert("Error while logging out. Token may not be blacklisted.");
            }
        } else {
            console.warn("No valid token found. Unable to logout.");
            showErrorAlert("No valid token found. You are not logged in.");
        }
    };

    const fetchUserData = async (accessToken = authTokens?.access) => {
        if (!accessToken) return;
        
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/userdata/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        
            setUser(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                showErrorAlert("Session expired. Please log in again.", "logging in again");
                logoutUser();
            } else {
                showErrorAlert("Unable to fetch user data. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkTokenValidity();
    }, [location]);

    const clearAuthData = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    // const showSuccessAlert = (message) => {
    //     Swal.fire({
    //         title: 'Success!',
    //         text: message,
    //         icon: "success",
    //         toast: true,
    //         position: 'top-right',
    //         timer: 5000,
    //         timerProgressBar: true,
    //         showConfirmButton: false,
    //         customClass: {
    //             popup: 'alert-popup',
    //         },
    //     });
    // };

    // const showErrorAlert = (message, action) => {
    //     Swal.fire({
    //         title: 'Error!',
    //         text: message + (action ? ` Please try ${action}.` : ''),
    //         icon: "error",
    //         toast: true,
    //         position: 'top-right',
    //         timer: 5000,
    //         timerProgressBar: true,
    //         showConfirmButton: false,
    //         customClass: {
    //             popup: 'alert-popup',
    //         },
    //     });
    // };

    const showSuccessAlert = (message) => {
        toast.success(message, {
            className: 'alert-popup',
        });
    };
    
    const showErrorAlert = (message) => {
        toast.error(message), {
            className: 'alert-popup',
        };
    };

    const isAuthenticated = !!authTokens

    return (
        <AuthContext.Provider value={{
            user,
            loginUser,
            registerUser,
            verifyEmail,
            resetPassword,
            verifyResetPasswordLink,
            updatePassword,
            logoutUser,
            loading,
            authTokens,
            isAuthenticated,
            checkTokenValidity,
            isRefreshTokenExpired
        }}>
            {children}
        </AuthContext.Provider>
    );
};
