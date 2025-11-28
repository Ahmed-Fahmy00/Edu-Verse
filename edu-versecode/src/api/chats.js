import axios from 'axios';

const API_BASE_URL = '/api/v1/chats';

export const getChatsForUser = async (token) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Should contain a list of chat summaries
  } catch (error) {
    throw error.response.data.message || 'Failed to fetch chats';
  }
};

export const getChatMessages = async (chatId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${chatId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Should contain a list of messages
  } catch (error) {
    throw error.response.data.message || 'Failed to fetch messages';
  }
};

export const sendMessage = async (chatId, messageData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${chatId}/messages`, messageData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Should contain the new message object
  } catch (error) {
    throw error.response.data.message || 'Failed to send message';
  }
};
