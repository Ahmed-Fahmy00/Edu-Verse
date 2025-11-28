import axios from "axios";

const API_BASE_URL = "/api/v1/groups";

export const getGroupsForUser = async (userId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch groups";
  }
};

export const createGroup = async (groupData, token) => {
  try {
    const response = await axios.post(API_BASE_URL, groupData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create group";
  }
};
