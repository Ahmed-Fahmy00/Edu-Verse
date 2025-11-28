import axios from 'axios';

const API_BASE_URL = '/api/v1/users';

export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data; 
  } catch (error) {
    throw error.response.data.message || 'Failed to fetch user profile';
  }
};

export const updateProfile = async (userId, updateData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${userId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Should contain updated user data
  } catch (error) {
    throw error.response.data.message || 'Failed to update profile';
  }
};
