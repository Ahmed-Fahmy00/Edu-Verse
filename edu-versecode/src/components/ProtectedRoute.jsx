// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * A component that redirects unauthenticated users to the login page.
 * It also handles the loading state of authentication.
 * @param {object} props - The component props.
 * @param {string} props.allowedRoles - A space-separated string of roles allowed to access this route (e.g., "admin instructor").
 * @returns {React.Component} - The protected route content or a redirect.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // 1. Show a loading state while checking authentication status
  if (isLoading) {
    // Replace with a proper spinner/loading screen component
    return <div>Loading authentication...</div>;
  }

  // 2. Check if the user is authenticated
  if (!isAuthenticated) {
    // User is not logged in, redirect to the authentication page
    return <Navigate to="/auth" replace />;
  }

  // 3. Check for role-based authorization (if allowedRoles is provided)
  if (allowedRoles && user && !allowedRoles.split(' ').includes(user.role)) {
    // User is logged in but doesn't have the required role (e.g., student trying to access admin page)
    // Redirect to a home or 'unauthorized' page
    return <Navigate to="/" replace />; // Or use a dedicated /unauthorized route
  }

  // 4. User is authenticated and authorized, render the child route components
  // The <Outlet /> component renders the children of the route
  return <Outlet />;
};

export default ProtectedRoute;