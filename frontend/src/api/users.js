import apiClient from "./client";

// Get user profile by ID
export const getUserProfile = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

// Update user profile
export const updateUserProfile = async (userId, data) => {
  const response = await apiClient.put(`/users/${userId}`, data);
  return response.data;
};

// Get user posts
export const getUserPosts = async (userId) => {
  const response = await apiClient.get(`/users/${userId}/posts`);
  return response.data;
};

// Get user courses
export const getUserCourses = async (userId) => {
  const response = await apiClient.get(`/users/${userId}/courses`);
  return response.data;
};

// Search users
export const searchUsers = async (query) => {
  const response = await apiClient.get("/users/search", { params: { query },});
  return response.data;
};
