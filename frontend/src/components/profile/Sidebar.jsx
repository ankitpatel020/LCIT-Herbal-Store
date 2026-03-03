import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout, mobile = false }) => {

    const menuItems = [
        {
            title: 'My Account',
            items: [
                { id: 'profile-info', label: 'My Profile', icon: '👤' },
                { id: 'orders', label: 'My Orders', icon: '📦' },
            ]
        },
        {
            title: 'Account Settings',
            items: [
                { id: 'addresses', label: 'Manage Addresses', icon: '🏠' },
                { id: 'verification', label: 'Verification Center', icon: '✅' },
                { id: 'deactivate', label: 'Deactivate Account', icon: '⚠️', danger: true },
                { id: 'delete', label: 'Delete Account', icon: '🗑️', danger: true },
            ]
        },
        {
            title: 'My Stuff',
            items: [
                { id: 'coupons', label: 'My Coupons', icon: '🎟️' },
                { id: 'reviews', label: 'My Reviews', icon: '⭐' },
                { id: 'notifications', label: 'Notifications', icon: '🔔' },
            ]
        }
    ];

    const containerClasses = mobile
        ? "w-full bg-white p-4"
        : "w-full h-[calc(100vh-5rem)] overflow-y-auto bg-white border-r border-gray-100 flex flex-col sticky top-20";

    return (
        <div className={containerClasses}>

            {/* User Header */}
            <div className={`flex items-center gap-4 ${mobile ? 'mb-6' : 'p-6 border-b border-gray-50 bg-gradient-to-r from-emerald-50/60 to-transparent'}`}>
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                        Welcome
                    </p>
                    <h3 className="font-semibold text-gray-900 truncate">
                        {user?.name}
                    </h3>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`${mobile ? 'space-y-6' : 'flex-1 p-6 space-y-8'}`}>

                {menuItems.map((section, idx) => (
                    <div key={idx}>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                            {section.title}
                        </h4>

                        <ul className="space-y-1">
                            {section.items.map((item, itemIdx) => {
                                const isActive = activeTab === item.id;

                                return (
                                    <li key={itemIdx}>
                                        <button
                                            onClick={() => setActiveTab(item.id)}
                                            className={`
                                                w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative
                                                ${isActive
                                                    ? item.danger
                                                        ? 'bg-red-50 text-red-600'
                                                        : 'bg-emerald-50 text-emerald-700'
                                                    : item.danger
                                                        ? 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }
                                            `}
                                        >
                                            {/* Left Accent Bar */}
                                            {isActive && (
                                                <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full 
                                                    ${item.danger ? 'bg-red-500' : 'bg-emerald-500'}
                                                `} />
                                            )}

                                            <span className={`text-lg ${item.danger && !isActive ? 'text-red-500' : ''}`}>
                                                {item.icon}
                                            </span>

                                            <span>{item.label}</span>
                                        </button>
                                    </li>
                                );
                            })}

                            {/* Admin Dashboard */}
                            {section.title === 'My Account' && user?.role === 'admin' && (
                                <li>
                                    <Link
                                        to="/admin/dashboard"
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50 transition"
                                    >
                                        ⚡ Admin Dashboard
                                    </Link>
                                </li>
                            )}

                            {/* Agent Dashboard */}
                            {section.title === 'My Account' && user?.role === 'agent' && (
                                <li>
                                    <Link
                                        to="/agent/dashboard"
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                                    >
                                        🛡️ Agent Dashboard
                                    </Link>
                                </li>
                            )}

                            {/* Support Inbox */}
                            {section.title === 'My Account' && ['admin', 'agent', 'support'].includes(user?.role) && (
                                <li>
                                    <Link
                                        to="/support/chat"
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition"
                                    >
                                        💬 Support Inbox
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                ))}

            </nav>

            {/* Footer */}
            {!mobile && (
                <div className="p-4 border-t border-gray-50 bg-gray-50/40">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                        🚪 Log Out
                    </button>

                    <Link
                        to="/help-center"
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 mt-2 transition"
                    >
                        🎧 Help Center
                    </Link>
                </div>
            )}

            {mobile && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                        onClick={onLogout}
                        className="text-red-600 font-semibold text-sm flex items-center gap-2"
                    >
                        🚪 Log Out
                    </button>
                </div>
            )}

        </div>
    );
};

export default Sidebar;