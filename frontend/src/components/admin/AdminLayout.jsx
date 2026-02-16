import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Helper to get title based on path
    const getPageTitle = (path) => {
        if (path.includes('dashboard')) return 'Dashboard Overview';
        if (path.includes('products')) return 'Product Management';
        if (path.includes('orders')) return 'Order Management';
        if (path.includes('users')) return 'User Administration';
        if (path.includes('reviews')) return 'Review Moderation';
        if (path.includes('coupons')) return 'Coupon & Discount Hub';
        return 'Admin Portal';
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm z-10 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
                <Sidebar user={user} />
            </div>

            {/* Mobile Nav */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-20 z-20 shadow-sm flex justify-between items-center">
                <h2 className="font-bold text-gray-800 text-lg">
                    {getPageTitle(location.pathname)}
                </h2>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <div className="bg-white absolute top-0 w-full border-b border-gray-200 shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <Sidebar user={user} mobile={true} />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 bg-gray-50/50 p-4 md:p-8 lg:p-12 overflow-x-hidden">
                {/* Header for Content Area (Desktop) */}
                <div className="hidden lg:flex mb-8 items-center justify-between border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900">
                            {getPageTitle(location.pathname)}
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm font-medium">
                            Manage your store's performance and data.
                        </p>
                    </div>
                </div>

                <div className="animate-fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
