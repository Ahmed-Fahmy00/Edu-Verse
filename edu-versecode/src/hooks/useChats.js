// src/hooks/useChats.js

import { useState, useEffect, useCallback } from 'react';
import * as chatsApi from '../api/chats';
import useAuth from './useAuth'; // We need user info and authentication status

/**
 * Custom hook to manage chat list, messages, and sending functionality.
 */
const useChats = () => {
    const { user, isAuthenticated } = useAuth();
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // NOTE: In a real app, this hook would also manage WebSocket connections for real-time updates.
    const token = localStorage.getItem('authToken'); // Assuming token is here

    // --- 1. Fetch Chat List ---
    const fetchChats = useCallback(async () => {
        if (!isAuthenticated || !user) return;
        setLoading(true);
        setError(null);
        try {
            const data = await chatsApi.getChatsForUser(token);
            setChats(data.chats);
        } catch (err) {
            setError(err.message || 'Failed to fetch chat list.');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user, token]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    // --- 2. Fetch Messages for Selected Chat ---
    const fetchMessages = useCallback(async (chatId) => {
        if (!chatId || !isAuthenticated) {
            setMessages([]);
            return;
        }
        try {
            setMessages([]); // Clear old messages
            // Placeholder message to show loading
            setMessages([{ _id: 'temp', senderId: 'system', text: 'Loading messages...', createdAt: new Date() }]);
            
            const data = await chatsApi.getChatMessages(chatId, token);
            setMessages(data.messages);
        } catch (err) {
            setError(`Failed to load chat: ${err.message}`);
        }
    }, [isAuthenticated, token]);
    
    useEffect(() => {
        fetchMessages(selectedChatId);
    }, [selectedChatId, fetchMessages]);

    // --- 3. Send Message Action ---
    const sendMessage = async (text) => {
        if (!text.trim() || !selectedChatId || !user) return;

        const messagePayload = {
            senderId: user._id,
            text: text.trim(),
        };

        try {
            const sentMessage = await chatsApi.sendMessage(selectedChatId, messagePayload, token);
            // Append the new message to the local state
            setMessages((prevMessages) => {
                // Remove the loading message if it's there
                const filtered = prevMessages.filter(m => m._id !== 'temp');
                return [...filtered, sentMessage];
            });
            return true;
        } catch (err) {
            setError(`Error sending message: ${err.message}`);
            return false;
        }
    };

    const selectedChat = chats.find(chat => chat._id === selectedChatId);

    return {
        chats,
        messages,
        selectedChat,
        selectedChatId,
        setSelectedChatId,
        loading,
        error,
        fetchChats,
        sendMessage,
    };
};

export default useChats;