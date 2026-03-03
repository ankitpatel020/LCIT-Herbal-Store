import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const AgentLayout = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const getPageTitle = (path) => {
        if (path.includes('dashboard')) return 'Agent Dashboard';
        if (path.includes('orders')) return 'Order Management';
        if (path.includes('support')) return 'Support Inbox';
        if (path.includes('profile')) return 'My Profile';
        return 'Agent Portal';
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-stone-50">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0 border-r border-emerald-100/70 bg-white shadow-[1px_0_12px_rgba(0,0,0,0.03)] z-10 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
                <Sidebar user={user} />
            </div>

            {/* Mobile Top Bar */}
            <div className="lg:hidden bg-white border-b border-emerald-100 p-4 sticky top-20 z-20 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🌿</span>
                    <h2 className="font-bold text-gray-800 text-lg">{getPageTitle(location.pathname)}</h2>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Sidebar Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-[8.5rem] bg-black/20 z-10" onClick={() => setMobileMenuOpen(false)}>
                    <div className="bg-white absolute top-0 w-full border-b border-emerald-100 shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <Sidebar user={user} mobile={true} />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 bg-stone-50/60 p-4 md:p-8 lg:p-12 overflow-x-hidden">
                {/* Page Header (Desktop) */}
                <div className="hidden lg:flex mb-10 items-center justify-between border-b border-emerald-100/60 pb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-extrabold text-gray-900 tracking-tight">
                            {getPageTitle(location.pathname)}
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm font-medium">
                            Welcome back, <span className="text-emerald-700 font-bold">{user?.name?.split(' ')[0] || 'Agent'}</span>! Here's your activity overview.
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 text-2xl shadow-sm">
                        🌿
                    </div>
                </div>

                <div className="animate-fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AgentLayout;
