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

    const handleDeactivate = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.put('/api/users/profile/deactivate', {}, config);
            toast.success('Account deactivated successfully');
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Failed to deactivate account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Deactivate Account</h2>
            <p className="text-gray-600 mb-6">
                Deactivating your account will temporarily disable your profile and remove your name and photo from most things you've shared.
                You can reactivate your account at any time by simply logging back in.
            </p>

            {!confirm ? (
                <button
                    onClick={() => setConfirm(true)}
                    className="btn bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200"
                >
                    Deactivate Account
                </button>
            ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <p className="font-semibold text-yellow-800 mb-3">Are you sure you want to proceed?</p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDeactivate}
                            disabled={loading}
                            className="btn bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Yes, Deactivate'}
                        </button>
                        <button
                            onClick={() => setConfirm(false)}
                            disabled={loading}
                            className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
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
