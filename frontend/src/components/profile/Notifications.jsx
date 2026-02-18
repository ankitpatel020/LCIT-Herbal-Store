import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchNotifications();
    }, [token]);

    const fetchNotifications = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get('/api/notifications', config);
            setNotifications(data.data);
        } catch (error) {
            console.error(error);
            // Don't toast error on fetch to avoid spamming user if notified service isn't ready
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.put(`/api/notifications/${id}/read`, {}, config);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.put('/api/notifications/read-all', {}, config);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('All marked as read');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update notifications');
        }
    };

    const deleteNotification = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`/api/notifications/${id}`, config);
            setNotifications(prev => prev.filter(n => n._id !== id));
            toast.success('Notification removed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete notification');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p>No new notifications.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-4 rounded-lg flex gap-4 transition-colors ${notification.isRead ? 'bg-white border border-gray-100' : 'bg-green-50 border border-green-100'}`}
                            onClick={() => !notification.isRead && markAsRead(notification._id)}
                        >
                            <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${notification.isRead ? 'bg-gray-300' : 'bg-green-500'}`}></div>

                            <div className="flex-1">
                                <h3 className={`font-semibold text-sm mb-1 ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{notification.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                                <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</span>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                                className="text-gray-400 hover:text-red-500 transition-colors self-start"
                                title="Delete"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
