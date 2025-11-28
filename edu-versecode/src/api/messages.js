import axios from "axios";

const API_BASE_URL = "/api/v1/messages";

export const getMessagesForGroup = async (groupId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?groupId=${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch messages";
  }
};

export const sendMessageToGroup = async (groupId, messageData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}`,
      { ...messageData, groupId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to send message";
  }
};
