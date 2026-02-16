import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ user, mobile = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const menuItems = [
        { title: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { title: 'Products', path: '/admin/products', icon: '🛍️' },
        { title: 'Orders', path: '/admin/orders', icon: '📦' },
        { title: 'Users', path: '/admin/users', icon: '👥' },
        { title: 'Reviews', path: '/admin/reviews', icon: '⭐' },
        { title: 'Coupons', path: '/admin/coupons', icon: '🎟️' },
    ];

    const onLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const containerClasses = mobile
        ? "w-full bg-white border-b border-gray-200 p-4"
        : "w-full h-[calc(100vh-5rem)] overflow-y-auto bg-white border-r border-gray-200 flex flex-col custom-scrollbar sticky top-20";

    return (
        <div className={containerClasses}>
            {/* Admin Profile Highlight */}
            <div className={`flex items-center gap-4 ${mobile ? 'mb-6' : 'p-6 border-b border-gray-50 bg-gradient-to-r from-purple-50/50 to-transparent'}`}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 text-xl font-bold border-2 border-purple-100 shadow-sm shrink-0">
                    A
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-0.5">Admin Portal</p>
                    <h3 className="font-bold text-gray-900 truncate text-base">{user?.name || 'Administrator'}</h3>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`space-y-2 ${mobile ? 'grid grid-cols-2 gap-4 space-y-0' : 'flex-1 p-4'}`}>
                {menuItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 relative overflow-hidden group
                            ${isActive
                                ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                                : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                            }`
                        }
                    >
                        <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="relative z-10">{item.title}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer Actions */}
            {!mobile && (
                <div className="p-4 border-t border-gray-50 bg-gray-50/30">
                    <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3"
                    >
                        <span className="text-lg opacity-80">🚪</span>
                        Log Out
                    </button>
                    <div className="mt-4 px-4 text-xs text-center text-gray-400 font-medium">
                        LCIT Dashboard v2.0
                    </div>
                </div>
            )}
            {/* Mobile Logout */}
            {mobile && (
                <div className="mt-6 pt-6 border-t border-gray-100 col-span-2">
                    <button onClick={onLogout} className="text-red-600 font-bold text-sm flex items-center gap-2 w-full justify-center p-3 rounded-lg hover:bg-red-50">
                        <span>🚪</span> Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
