// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth'; // Import your authentication API calls

// 1. Create the context
export const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  // State to hold the user object and loading status
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Authentication Actions ---

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const data = await authApi.loginUser(email, password);
      // Assuming the API returns the user data and a token
      localStorage.setItem('authToken', data.token); // Store token
      setUser(data.user); // Store user data
      setIsLoading(false);
      return data.user;
    } catch (error) {
      setIsLoading(false);
      console.error('Login failed:', error);
      throw error; // Re-throw for component handling
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const data = await authApi.registerUser(userData);
      // You might or might not log the user in directly after registration
      // For simplicity, let's assume it logs the user in and returns token/user
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      setIsLoading(false);
      return data.user;
    } catch (error) {
      setIsLoading(false);
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear local storage and state
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // --- Initial Check (on App Load) ---

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify the token with the backend and fetch user data
          const data = await authApi.getCurrentUser(token);
          setUser(data.user);
        } catch (error) {
          // Token invalid or expired, clear it
          console.error('Token validation failed:', error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // --- Context Value ---

  const contextValue = {
    user,
    isLoading,
    isAuthenticated: !!user, // Simple boolean check
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};