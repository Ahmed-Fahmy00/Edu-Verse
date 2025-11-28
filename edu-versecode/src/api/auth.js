// src/api/auth.js
// PLACEHOLDER: Replace with actual backend communication logic (e.g., Axios/Fetch)
import axios from "axios"; // Assuming you use Axios

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password,
    });
    return response.data; // Should contain { token, user }
  } catch (error) {
    throw (
      (error.response && error.response.data && error.response.data.message) ||
      "Login failed"
    );
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/register`,
      userData
    );
    return response.data; // Should contain { token, user }
  } catch (error) {
    throw (
      (error.response && error.response.data && error.response.data.message) ||
      "Registration failed"
    );
  }
};

export const getCurrentUser = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Should contain { user }
  } catch (error) {
    // If token is invalid, backend should return a 401
    throw error.response.data.message || "Failed to fetch user";
  }
};

// ... other auth-related functions like password reset, profile update
