import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, reset } from '../../store/slices/authSlice';

const Sidebar = ({ user, mobile = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const menuItems = [
        { title: 'Dashboard Overview', path: '/agent/dashboard', icon: <span role="img" aria-label="dashboard">📊</span> },
        { title: 'Manage Orders', path: '/agent/orders', icon: <span role="img" aria-label="orders">📦</span> },
        { title: 'Profile Settings', path: '/profile', icon: <span role="img" aria-label="profile">👤</span> },
    ];

    const containerClasses = mobile
        ? "w-full bg-white border-b border-gray-200 p-4"
        : "w-full h-[calc(100vh-5rem)] overflow-y-auto bg-white border-r border-gray-200 flex flex-col custom-scrollbar sticky top-20";

    return (
        <div className={containerClasses}>
            {/* Agent Profile Highlight */}
            <div className={`flex items-center gap-4 ${mobile ? 'mb-6' : 'p-6 border-b border-gray-50 bg-gradient-to-r from-indigo-50/50 to-transparent'}`}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold border-2 border-indigo-100 shadow-sm shrink-0">
                    <span className="text-2xl" role="img" aria-label="agent">👨‍💼</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-0.5">Agent Portal</p>
                    <h3 className="font-bold text-gray-900 truncate text-base">{user?.name || 'Agent User'}</h3>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`space-y-2 ${mobile ? 'grid grid-cols-1 gap-2' : 'flex-1 p-4'}`}>
                {menuItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 relative overflow-hidden group
                            ${isActive
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                            }`
                        }
                    >
                        <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="relative z-10">{item.title}</span>

                        {/* Active Indicator (Desktop only) */}
                        {!mobile && (
                            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-400 rounded-l-full transition-opacity duration-200 ${item.path === location.pathname ? 'opacity-100' : 'opacity-0'}`} />
                        )}
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
                        <span className="text-lg opacity-80" role="img" aria-label="logout">🚪</span>
                        Log Out
                    </button>
                    <div className="mt-4 px-4 text-xs text-center text-gray-400 font-medium">
                        LCIT Agent v1.0
                    </div>
                </div>
            )}
            {/* Mobile Logout */}
            {mobile && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <button onClick={onLogout} className="text-red-600 font-bold text-sm flex items-center gap-2 w-full justify-center p-3 rounded-lg hover:bg-red-50">
                        <span>🚪</span> Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
