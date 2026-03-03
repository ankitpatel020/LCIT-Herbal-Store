import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';
import Chat from './Chat';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const ChatDashboard = () => {
    const { user, token } = useSelector((state) => state.auth);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingChats, setLoadingChats] = useState(false);

    const messagesEndRef = useRef(null);

    const fetchMessages = useCallback(async (chatId, showLoading = true) => {
        try {
            const { data } = await axios.get(`${API_URL}/chats/${chatId}/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(data.data);
        } catch (error) {
            console.error('Error fetching messages');
        }
    }, [token]);

    const fetchChats = useCallback(async (showLoading = true) => {
        if (showLoading) setLoadingChats(true);
        try {
            const { data } = await axios.get(`${API_URL}/chats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChats(data.data);

            // Auto open first chat if none selected
            if (!selectedChat && data.data.length > 0) {
                setSelectedChat(data.data[0]);
                fetchMessages(data.data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching chats');
        } finally {
            if (showLoading) setLoadingChats(false);
        }
    }, [token, selectedChat, fetchMessages]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchChats(false);
            if (selectedChat) fetchMessages(selectedChat._id, false);
        }, 5000);
        return () => clearInterval(interval);
    }, [selectedChat, fetchChats, fetchMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSelectChat = async (chat) => {
        setSelectedChat(chat);
        await fetchMessages(chat._id);
    };

    const handleAssign = async (chatId) => {
        try {
            const { data } = await axios.put(`${API_URL}/chats/${chatId}/assign`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Chat assigned to you');
            fetchChats(false);
            if (selectedChat && selectedChat._id === chatId) {
                setSelectedChat(data.data);
            }
        } catch (error) {
            toast.error('Failed to assign chat');
        }
    };

    const handleCloseChat = async (chatId) => {
        try {
            const { data } = await axios.put(`${API_URL}/chats/${chatId}/close`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Chat closed');
            fetchChats(false);
            if (selectedChat && selectedChat._id === chatId) {
                setSelectedChat(data.data);
            }
        } catch (error) {
            toast.error('Failed to close chat');
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const text = newMessage;
        setNewMessage('');

        try {
            const { data } = await axios.post(`${API_URL}/chats/${selectedChat._id}/messages`, { text }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages((prev) => [...prev, data.data]);
            fetchChats(false); // Update lastMessage in chat list
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex h-[calc(100vh-80px)] bg-gray-100 overflow-hidden">
            <Sidebar
                chats={chats}
                loadingChats={loadingChats}
                selectedChat={selectedChat}
                handleSelectChat={handleSelectChat}
            />

            <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
                <Chat
                    selectedChat={selectedChat}
                    handleAssign={handleAssign}
                    handleCloseChat={handleCloseChat}
                    messages={messages}
                    sendMessage={sendMessage}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    messagesEndRef={messagesEndRef}
                />
            </div>
        </div>
    );
};

export default ChatDashboard;
