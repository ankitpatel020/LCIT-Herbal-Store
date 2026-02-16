import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, reset, logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Layout
import Sidebar from '../components/profile/Sidebar';

// Sections
import PersonalInfo from '../components/profile/PersonalInfo';
import ManageAddress from '../components/profile/ManageAddress';
import Verification from '../components/profile/Verification';
import MyOrders from '../components/profile/MyOrders';
import MyCoupons from '../components/profile/MyCoupons';
import MyReviews from '../components/profile/MyReviews';
import Notifications from '../components/profile/Notifications';
import DeactivateAccount from '../components/profile/DeactivateAccount';
import DeleteAccount from '../components/profile/DeleteAccount';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, message, isLoading } = useSelector((state) => state.auth);

    // Determine initial active tab based on query param or default
    const [activeTab, setActiveTab] = useState('profile-info');

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess && message) {
            toast.success(message);
        }
        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile-info':
                return <PersonalInfo user={user} />;
            case 'orders':
                return <MyOrders />;
            case 'addresses':
                return <ManageAddress user={user} />;
            case 'verification':
                return <Verification user={user} />;
            case 'coupons':
                return <MyCoupons />;
            case 'reviews':
                return <MyReviews />;
            case 'notifications':
                return <Notifications />;
            case 'deactivate':
                return <DeactivateAccount />;
            case 'delete':
                return <DeleteAccount />;
            default:
                return <PersonalInfo user={user} />;
        }
    };

    if (isLoading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm z-10">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    user={user}
                    onLogout={handleLogout}
                />
            </div>

            {/* Mobile Nav */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-20 z-10 shadow-sm">
                <details className="group">
                    <summary className="list-none flex justify-between items-center cursor-pointer">
                        <span className="font-bold text-gray-800">
                            {activeTab === 'profile-info' ? 'My Profile' :
                                activeTab === 'orders' ? 'My Orders' :
                                    activeTab === 'addresses' ? 'Manage Addresses' :
                                        activeTab === 'verification' ? 'ID Verification' :
                                            'Account Menu'}
                        </span>
                        <span className="text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </summary>
                    <div className="mt-4">
                        <Sidebar
                            activeTab={activeTab}
                            setActiveTab={(tab) => { setActiveTab(tab); document.querySelector('details.group').removeAttribute('open'); }}
                            user={user}
                            onLogout={handleLogout}
                            mobile={true}
                        />
                    </div>
                </details>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 bg-gray-50/50">
                <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12">
                    {/* Header for Content Area */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-gray-900">
                                {activeTab === 'profile-info' && 'My Profile'}
                                {activeTab === 'orders' && 'Order History'}
                                {activeTab === 'addresses' && 'Manage Addresses'}
                                {activeTab === 'verification' && 'ID Verification'}
                                {activeTab === 'coupons' && 'My Coupons'}
                                {activeTab === 'reviews' && 'Reviews & Ratings'}
                                {activeTab === 'notifications' && 'Notifications'}
                                {activeTab === 'deactivate' && 'Deactivate Account'}
                                {activeTab === 'delete' && 'Delete Account'}
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm font-medium">Manage your account settings and preferences.</p>
                        </div>
                        {/* Contextual Action Button could go here (e.g. "Shop Now" on orders page) */}
                    </div>

                    <div className="animate-fade-in-up">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
