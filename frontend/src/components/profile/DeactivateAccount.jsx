import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../../store/slices/authSlice';

const DeactivateAccount = () => {
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);

    const API_URL = process.env.REACT_APP_API_URL || '/api';

    const handleDeactivate = async () => {
        const confirmed = window.confirm(
            'Deactivate your account? You can reactivate anytime by logging back in.'
        );

        if (!confirmed) return;

        setLoading(true);

        try {
            const authToken = token || localStorage.getItem('token');

            if (!authToken) {
                throw new Error('Authentication token missing.');
            }

            await axios.put(
                `${API_URL}/users/profile/deactivate`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            toast.success('Account deactivated successfully.');

            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || 'Failed to deactivate account.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-yellow-200 p-8 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Deactivate Account
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
                Deactivating your account will temporarily disable your profile.
                Your data remains safe, and you can reactivate anytime by logging back in.
            </p>

            {!confirm ? (
                <button
                    onClick={() => setConfirm(true)}
                    className="px-6 py-3 rounded-xl font-semibold bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-all"
                >
                    Deactivate Account
                </button>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 space-y-4">

                    <p className="font-semibold text-yellow-900">
                        Are you sure you want to deactivate your account?
                    </p>

                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={handleDeactivate}
                            disabled={loading}
                            className="px-6 py-3 rounded-xl font-bold text-white bg-yellow-600 hover:bg-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Yes, Deactivate'
                            )}
                        </button>

                        <button
                            onClick={() => setConfirm(false)}
                            disabled={loading}
                            className="px-6 py-3 rounded-xl font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default DeactivateAccount;