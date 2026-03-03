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
        { title: 'Dashboard Overview', path: '/agent/dashboard', icon: '📊' },
        { title: 'Manage Orders', path: '/agent/orders', icon: '📦' },
        { title: 'My Payments', path: '/agent/payments', icon: '💸' },
        { title: 'Support Inbox', path: '/support/chat', icon: '💬' },
    ];

    const containerClasses = mobile
        ? 'w-full bg-white border-b border-emerald-100 p-4'
        : 'w-full h-[calc(100vh-5rem)] overflow-y-auto bg-white border-r border-emerald-100/70 flex flex-col custom-scrollbar sticky top-20';

    return (
        <div className={containerClasses}>
            {/* Agent Profile Highlight */}
            <div className={`flex items-center gap-4 ${mobile ? 'mb-6' : 'p-6 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/60 to-transparent'}`}>
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl font-bold border border-emerald-100 shadow-sm shrink-0">
                    <span className="text-2xl" role="img" aria-label="agent">🌿</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Agent Portal</p>
                    <h3 className="font-bold text-gray-900 truncate text-base">{user?.name || 'Agent User'}</h3>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`space-y-1.5 ${mobile ? 'grid grid-cols-1 gap-1.5' : 'flex-1 p-4'}`}>
                {menuItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.path}
                        className={({ isActive }) =>
                            `w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-3 relative overflow-hidden group
                            ${isActive
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`
                        }
                    >
                        <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="relative z-10">{item.title}</span>

                        {/* Active Indicator (Desktop only) */}
                        {!mobile && (
                            <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-300 rounded-l-full transition-opacity duration-200 ${item.path === location.pathname ? 'opacity-100' : 'opacity-0'}`} />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Actions */}
            {!mobile && (
                <div className="p-4 border-t border-emerald-50 bg-emerald-50/20">
                    <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3"
                    >
                        <span className="text-lg opacity-80" role="img" aria-label="logout">🚪</span>
                        Log Out
                    </button>
                    <div className="mt-3 px-4 text-xs text-center text-gray-400 font-medium tracking-wide">
                        LCIT Herbal — Agent v1.0
                    </div>
                </div>
            )}

            {/* Mobile Logout */}
            {mobile && (
                <div className="mt-6 pt-6 border-t border-emerald-100">
                    <button
                        onClick={onLogout}
                        className="text-red-600 font-bold text-sm flex items-center gap-2 w-full justify-center p-3 rounded-xl hover:bg-red-50 transition-colors"
                    >
                        <span>🚪</span> Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
