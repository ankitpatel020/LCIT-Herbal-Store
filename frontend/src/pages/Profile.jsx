import React, { useState, useEffect, useMemo } from 'react';
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

    const { user, isError, isSuccess, message, isLoading } =
        useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState('profile-info');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    /* ===============================
       LOAD USER
    =============================== */
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess && message) toast.success(message);
        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    /* ===============================
       LOGOUT
    =============================== */
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        toast.success('Logged out successfully');
    };

    /* ===============================
       TAB TITLE MAP (Cleaner)
    =============================== */
    const tabTitles = useMemo(() => ({
        'profile-info': 'My Profile',
        orders: 'Order History',
        addresses: 'Manage Addresses',
        verification: 'ID Verification',
        coupons: 'My Coupons',
        reviews: 'Reviews & Ratings',
        notifications: 'Notifications',
        deactivate: 'Deactivate Account',
        delete: 'Delete Account',
    }), []);

    /* ===============================
       CONTENT SWITCH
    =============================== */
    const renderContent = () => {
        switch (activeTab) {
            case 'profile-info': return <PersonalInfo user={user} />;
            case 'orders': return <MyOrders />;
            case 'addresses': return <ManageAddress user={user} />;
            case 'verification': return <Verification user={user} />;
            case 'coupons': return <MyCoupons />;
            case 'reviews': return <MyReviews />;
            case 'notifications': return <Notifications />;
            case 'deactivate': return <DeactivateAccount />;
            case 'delete': return <DeleteAccount />;
            default: return <PersonalInfo user={user} />;
        }
    };

    /* ===============================
       LOADING STATE
    =============================== */
    if (isLoading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 to-emerald-50/30">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-b from-stone-50 to-emerald-50/20">

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    user={user}
                    onLogout={handleLogout}
                />
            </div>

            {/* Mobile Nav */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-20 shadow-sm">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex justify-between items-center w-full font-bold text-gray-800"
                >
                    {tabTitles[activeTab] || 'Account'}
                    <span className={`transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </button>

                {mobileMenuOpen && (
                    <div className="mt-4">
                        <Sidebar
                            activeTab={activeTab}
                            setActiveTab={(tab) => {
                                setActiveTab(tab);
                                setMobileMenuOpen(false);
                            }}
                            user={user}
                            onLogout={handleLogout}
                            mobile
                        />
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-6xl mx-auto p-6 md:p-10">

                    {/* User Card Header */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-3xl p-6 mb-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {tabTitles[activeTab]}
                                </h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    Manage your account settings and preferences.
                                </p>
                            </div>

                            <div className="text-sm text-gray-600">
                                Signed in as <span className="font-semibold text-gray-900">{user.name}</span>
                            </div>

                        </div>
                    </div>

                    {/* Content */}
                    <div className="animate-fade-in-up">
                        {renderContent()}
                    </div>

                </div>
            </main>

        </div>
    );
};

export default Profile;