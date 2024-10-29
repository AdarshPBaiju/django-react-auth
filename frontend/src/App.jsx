/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import PrivateRedirect from './utils/PrivateRedirect' // Import the new component
import AuthContext, { AuthProvider } from './context/AuthContext'
import Navbar from './views/Navbar'
import Dashboard from './views/Dashboard'
import HomePage from './views/HomePage'
import LoginPage from './views/LoginPage'
import RegisterPage from './views/RegisterPage'
import ResetPasswordPage from './views/ResetPasswordPage'
import EnterNewPasswordPage from './views/EnterNewPasswordPage'
import EmailVerifiedPage from './views/EmailVerifiedPage'
import ProtectedRoute from './utils/ProtectedRoute'
import AdminPage from './views/AdminPage'
import UserPage from './views/UserPage'
import Unauthorized from './views/Unauthorized'
import CommonPage from './views/CommonPage'

function App () {

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route
            path='/login'
            element={<PrivateRedirect element={<LoginPage />} />}
          />
          <Route
            path='/register'
            element={<PrivateRedirect element={<RegisterPage />} />}
          />
          <Route
            path='/verify-email/:uid/:token'
            element={<PrivateRedirect element={<EmailVerifiedPage />} />}
          />
          <Route
            path='/reset-password'
            element={<PrivateRedirect element={<ResetPasswordPage />} />}
          />
          <Route
            path='/reset-password/:uid/:token'
            element={<PrivateRedirect element={<EnterNewPasswordPage />} />}
          />
          <Route
            path='/dashboard'
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route
            path='/unauthorized'
            element={<PrivateRoute element={<Unauthorized />} />}
          />
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route path='/user' element={<UserPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path='/admin' element={<AdminPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN','USER']} />}>
            <Route path='/common' element={<CommonPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
