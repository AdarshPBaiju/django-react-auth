/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import PrivateRedirect from "./utils/PrivateRedirect"; // Import the new component
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./views/Navbar";
import Dashboard from "./views/Dashboard";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import ResetPasswordPage from "./views/ResetPasswordPage";
import EnterNewPasswordPage from './views/EnterNewPasswordPAge';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
                path="/login" 
                element={<PrivateRedirect element={<LoginPage />} />} 
            />
            <Route 
                path="/register" 
                element={<PrivateRedirect element={<RegisterPage />} />} 
            />
            <Route 
                path="/reset-password" 
                element={<PrivateRedirect element={<ResetPasswordPage/>} />} 
            />
            <Route 
                path="/reset-password/:uid/:token" 
                element={<PrivateRedirect element={<EnterNewPasswordPage/>} />} 
            />
            <Route 
                path="/dashboard" 
                element={<PrivateRoute element={<Dashboard />} />} 
            />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
