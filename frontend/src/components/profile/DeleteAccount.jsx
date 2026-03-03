import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../../store/slices/authSlice';

const DeleteAccount = () => {
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);

    const API_URL = process.env.REACT_APP_API_URL || '/api';

    const handleDelete = async (e) => {
        e.preventDefault();

        if (confirmText.trim().toUpperCase() !== 'DELETE') {
            toast.error('Please type DELETE exactly to confirm.');
            return;
        }

        const confirmed = window.confirm(
            'Are you absolutely sure? This action is permanent and cannot be undone.'
        );

        if (!confirmed) return;

        setLoading(true);

        try {
            const authToken = token || localStorage.getItem('token');

            if (!authToken) {
                throw new Error('Authentication token missing.');
            }

            await axios.delete(`${API_URL}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            toast.success('Your account has been permanently deleted.');

            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || 'Failed to delete account.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600"></div>

            <h2 className="text-2xl font-bold text-red-600 mb-6">
                Delete Account
            </h2>

            {/* Warning Box */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="text-sm text-red-700 leading-relaxed">
                            This action is permanent. Your profile, orders,
                            reviews, and verification data will be removed
                            forever.
                        </p>
                        <p className="text-xs text-red-500 mt-2">
                            There is no recovery option after deletion.
                        </p>
                    </div>
                </div>
            </div>

            {/* Confirmation Form */}
            <form onSubmit={handleDelete} className="space-y-6">

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type <span className="text-red-600 font-bold">DELETE</span> to confirm
                    </label>

                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                        placeholder="DELETE"
                    />
                </div>

                <button
                    type="submit"
                    disabled={confirmText.trim().toUpperCase() !== 'DELETE' || loading}
                    className="w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            Deleting...
                        </span>
                    ) : (
                        'Permanently Delete Account'
                    )}
                </button>

            </form>
        </div>
    );
};

export default DeleteAccount;