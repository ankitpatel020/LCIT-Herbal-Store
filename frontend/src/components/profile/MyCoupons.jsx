import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const MyCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const { token } = useSelector((state) => state.auth);

    const API_URL = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const authToken = token || localStorage.getItem('token');
                if (!authToken) throw new Error('Unauthorized');

                const { data } = await axios.get(
                    `${API_URL}/coupons/available`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                setCoupons(data?.data || []);
            } catch (error) {
                console.error(error);
                toast.error(
                    error.response?.data?.message || 'Failed to fetch coupons'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, [token, API_URL]);

    const copyToClipboard = async (code) => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(code);
            } else {
                const temp = document.createElement('textarea');
                temp.value = code;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
            }
            toast.success('Coupon code copied!');
        } catch (error) {
            toast.error('Failed to copy code');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                My Coupons
            </h2>

            {coupons.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <div className="text-5xl mb-4">🎟️</div>
                    <p className="text-sm">
                        No coupons available right now.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {coupons.map((coupon) => {
                        const isExpired =
                            new Date(coupon.expiryDate) < new Date();

                        return (
                            <div
                                key={coupon._id}
                                className={`relative rounded-2xl p-6 border transition-all hover:shadow-lg ${isExpired
                                    ? 'bg-gray-100 border-gray-300 opacity-70'
                                    : 'bg-green-50 border-green-200'
                                    }`}
                            >
                                {/* Expired Badge */}
                                {isExpired && (
                                    <span className="absolute top-4 right-4 text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                        Expired
                                    </span>
                                )}

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span
                                            className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-2 ${coupon.discountType === 'percentage'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-green-100 text-green-700'
                                                }`}
                                        >
                                            {coupon.discountType === 'percentage'
                                                ? `${coupon.discountValue}% OFF`
                                                : `₹${coupon.discountValue} OFF`}
                                        </span>

                                        <h3 className="font-bold text-lg text-gray-900 tracking-wider">
                                            {coupon.code}
                                        </h3>
                                    </div>

                                    {!isExpired && (
                                        <button
                                            onClick={() =>
                                                copyToClipboard(coupon.code)
                                            }
                                            className="text-gray-400 hover:text-green-600 transition"
                                            title="Copy Code"
                                        >
                                            📋
                                        </button>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {coupon.description}
                                </p>

                                <div className="flex justify-between text-xs text-gray-500 border-t pt-3">
                                    <span>
                                        Min. spend: ₹
                                        {coupon.minOrderAmount || 0}
                                    </span>
                                    <span>
                                        Expires:{' '}
                                        {new Date(
                                            coupon.expiryDate
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyCoupons;