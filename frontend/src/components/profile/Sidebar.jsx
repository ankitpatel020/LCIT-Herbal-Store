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
        ? "w-full bg-white border-b border-gray-200 p-4"
        : "w-full h-[calc(100vh-5rem)] overflow-y-auto bg-white border-r border-gray-200 flex flex-col custom-scrollbar sticky top-20";

    return (
        <div className={containerClasses}>
            {/* User Profile Highlight */}
            <div className={`flex items-center gap-4 ${mobile ? 'mb-6' : 'p-6 border-b border-gray-50 bg-gradient-to-r from-green-50/50 to-transparent'}`}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 text-xl font-bold border-2 border-green-100 shadow-sm shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-0.5">Welcome,</p>
                    <h3 className="font-bold text-gray-900 truncate text-base">{user?.name}</h3>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`space-y-8 ${mobile ? 'grid grid-cols-1 gap-6 space-y-0' : 'flex-1 p-6'}`}>
                {menuItems.map((section, idx) => (
                    <div key={idx}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                            {section.title}
                        </h4>
                        <ul className="space-y-1">
                            {section.items.map((item, itemIdx) => {
                                const isActive = activeTab === item.id;
                                return (
                                    <li key={itemIdx}>
                                        <button
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 relative overflow-hidden group
                                                ${isActive
                                                    ? item.danger
                                                        ? 'bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100'
                                                        : 'bg-green-600 text-white shadow-md shadow-green-200'
                                                    : item.danger
                                                        ? 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'opacity-70'} ${item.danger && !isActive ? 'text-red-500' : ''}`}>
                                                {item.icon}
                                            </span>
                                            <span className="relative z-10">{item.label}</span>
                                        </button>
                                    </li>
                                );
                            })}
                            {/* Admin Dashboard */}
                            {section.title === 'My Account' && user?.role === 'admin' && (
                                <li>
                                    <Link
                                        to="/admin/dashboard"
                                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50 flex items-center gap-3 transition-colors"
                                    >
                                        <span className="text-lg opacity-80">⚡</span>
                                        Admin Dashboard
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Footer Actions */}
            {!mobile && (
                <div className="p-4 border-t border-gray-50 bg-gray-50/30">
                    <button
                        onClick={onLogout}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3"
                    >
                        <span className="text-lg opacity-80">🚪</span>
                        Log Out
                    </button>
                    <Link
                        to="/help-center"
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 mt-1"
                    >
                        <span className="text-lg opacity-80">🎧</span>
                        Help Center
                    </Link>
                </div>
            )}
            {/* Mobile specific logout */}
            {mobile && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <button onClick={onLogout} className="text-red-600 font-bold text-sm flex items-center gap-2">
                        <span>🚪</span> Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;

