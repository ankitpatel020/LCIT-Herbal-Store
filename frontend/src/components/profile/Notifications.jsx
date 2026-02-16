import React from 'react';

const Notifications = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-6">
                🔔
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h2>
            <p className="text-gray-500 max-w-sm">
                You're all caught up! No new notifications.
            </p>
        </div>
    );
};

export default Notifications;
