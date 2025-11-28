import axios from "axios";

const API_BASE_URL = "/api/v1/posts";

export const getUserPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user posts";
  }
};
