import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const ChatWidget = () => {
    const { user, token } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Filter out users who are support staff/admin from seeing the regular user widget
    const isSupportStaff = user && ['admin', 'agent', 'support'].includes(user.role);

    useEffect(() => {
        if (isOpen && user && !isSupportStaff && !chat && !loading) {
            initChat();
        }
    }, [isOpen, user, isSupportStaff, chat, loading]);

    useEffect(() => {
        let interval;
        if (isOpen && chat) {
            // Poll for messages every 3 seconds
            interval = setInterval(() => {
                fetchMessages(chat._id);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isOpen, chat]);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-support-chat', handleOpen);
        return () => window.removeEventListener('open-support-chat', handleOpen);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initChat = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/chats/my-chat`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChat(data.data);
            if (data.data) {
                await fetchMessages(data.data._id);
            }
        } catch (error) {
            console.error('Failed to init chat', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const { data } = await axios.get(`${API_URL}/chats/${chatId}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(data.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chat) return;

        const text = newMessage;
        setNewMessage('');

        // Optimistic update
        const tempMsg = {
            _id: Date.now().toString(),
            text,
            sender: { _id: user._id, name: user.name },
            createdAt: new Date().toISOString()
        };
        setMessages([...messages, tempMsg]);

        try {
            const { data } = await axios.post(`${API_URL}/chats/${chat._id}/messages`, { text }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // fetchMessages will sync shortly, but we can replace temp right away
            setMessages((prev) => prev.map(m => m._id === tempMsg._id ? data.data : m));
        } catch (error) {
            toast.error('Failed to send message');
            setMessages((prev) => prev.filter(m => m._id !== tempMsg._id));
            setNewMessage(text);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Don't render for staff
    if (isSupportStaff) return null;

    return (
        <>
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-transform hover:scale-105 z-50 animate-bounce"
                >
                    <FiMessageSquare size={24} />
                </button>
            )}

            {/* Chat Box window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200"
                        style={{ height: '500px', maxHeight: '80vh' }}
                    >
                        {/* Header */}
                        <div className="bg-emerald-600 text-white p-4 flex justify-between items-center shadow-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <FiMessageSquare />
                                </div>
                                <div>
                                    <h3 className="font-bold">Support Chat</h3>
                                    <p className="text-xs text-emerald-100">
                                        {chat?.assignedTo ? 'Agent joined' : 'We usually reply in a few minutes'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsOpen(false)} className="text-white hover:text-emerald-200 p-1">
                                    <FiMinimize2 size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="text-white hover:text-emerald-200 p-1">
                                    <FiX size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        {!user ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 text-center gap-4">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                                    <FiMessageSquare size={28} />
                                </div>
                                <h3 className="text-gray-900 font-bold text-lg">Login to Start Chat</h3>
                                <p className="text-gray-500 text-sm mb-2">Please log in to your account to speak with our support agents.</p>
                                <a href="/login" className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-700 transition shadow-sm w-full">
                                    Sign In
                                </a>
                            </div>
                        ) : (
                            <>
                                {/* Chat Messages */}
                                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                                    {loading && messages.length === 0 ? (
                                        <div className="text-center text-gray-500 mt-10">Connecting...</div>
                                    ) : (
                                        <>
                                            <div className="text-center">
                                                <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">Chat Started</span>
                                            </div>
                                            {messages.map((msg) => {
                                                const isMine = msg.sender?._id === user?._id;
                                                return (
                                                    <div key={msg._id} className={`flex max-w-[80%] ${isMine ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
                                                        <div className={`p-3 rounded-2xl ${isMine ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'}`}>
                                                            {!isMine && <p className="text-[10px] text-emerald-600 font-bold mb-1">Support Agent</p>}
                                                            <p className="text-sm">{msg.text}</p>
                                                            <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-emerald-200' : 'text-gray-400'}`}>
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="p-3 bg-white border-t border-gray-100">
                                    <form onSubmit={sendMessage} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-emerald-500 rounded-full px-4 py-2 text-sm outline-none transition-colors border"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition"
                                        >
                                            <FiSend size={16} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
