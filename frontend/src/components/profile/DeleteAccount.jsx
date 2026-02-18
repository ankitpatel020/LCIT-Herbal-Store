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

    const handleDelete = async (e) => {
        e.preventDefault();
        if (confirmText !== 'DELETE') return;

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete('/api/users/profile', config);
            toast.success('Account deleted successfully');
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">Delete Account</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">
                            Warning: This action is permanent and cannot be undone. All your data, including order history and reviews, will be permanently removed.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleDelete} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        To confirm deletion, type "DELETE" below:
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="input border-red-300 focus:border-red-500 focus:ring-red-500"
                        placeholder="Type DELETE"
                    />
                </div>

                <button
                    type="submit"
                    disabled={confirmText !== 'DELETE' || loading}
                    className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 w-full md:w-auto"
                >
                    {loading ? 'Deleting Account...' : 'Permanently Delete Account'}
                </button>
            </form>
        </div>
    );
};

export default DeleteAccount;
