import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const { token } = useSelector((state) => state.auth);

    const API_URL = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const authToken = token || localStorage.getItem('token');
                if (!authToken) throw new Error('Unauthorized');

                const { data } = await axios.get(
                    `${API_URL}/notifications`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                setNotifications(data?.data || []);
            } catch (error) {
                console.error(error);
                toast.error(
                    error.response?.data?.message ||
                    'Failed to load notifications'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [token, API_URL]);

    const markAsRead = async (id) => {
        try {
            const authToken = token || localStorage.getItem('token');
            await axios.put(
                `${API_URL}/notifications/${id}/read`,
                {},
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );

            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === id ? { ...n, isRead: true } : n
                )
            );
        } catch (error) {
            console.error(error);
            toast.error('Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            const authToken = token || localStorage.getItem('token');

            await axios.put(
                `${API_URL}/notifications/read-all`,
                {},
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );

            toast.success('All notifications marked as read');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update notifications');
        }
    };

    const deleteNotification = async (id) => {
        try {
            const authToken = token || localStorage.getItem('token');

            await axios.delete(
                `${API_URL}/notifications/${id}`,
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );

            setNotifications((prev) =>
                prev.filter((n) => n._id !== id)
            );

            toast.success('Notification removed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete notification');
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    Notifications
                    {unreadCount > 0 && (
                        <span className="ml-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </h2>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm font-semibold text-green-600 hover:text-green-700"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <div className="text-5xl mb-4">🔔</div>
                    <p className="text-sm">
                        You're all caught up!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-5 rounded-2xl flex gap-4 cursor-pointer transition-all ${notification.isRead
                                ? 'bg-white border border-gray-100'
                                : 'bg-green-50 border border-green-100'
                                }`}
                            onClick={() =>
                                !notification.isRead &&
                                markAsRead(notification._id)
                            }
                        >
                            <div
                                className={`mt-2 w-2.5 h-2.5 rounded-full ${notification.isRead
                                    ? 'bg-gray-300'
                                    : 'bg-green-500'
                                    }`}
                            ></div>

                            <div className="flex-1">
                                <h3
                                    className={`font-semibold text-sm mb-1 ${notification.isRead
                                        ? 'text-gray-700'
                                        : 'text-gray-900'
                                        }`}
                                >
                                    {notification.title}
                                </h3>

                                <p className="text-gray-600 text-sm mb-2">
                                    {notification.message}
                                </p>

                                <span className="text-xs text-gray-400">
                                    {new Date(
                                        notification.createdAt
                                    ).toLocaleString()}
                                </span>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification._id);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;