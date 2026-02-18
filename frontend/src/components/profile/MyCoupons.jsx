import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const MyCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.get('/api/coupons/available', config);
                setCoupons(data.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch coupons');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchCoupons();
        }
    }, [token]);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success('Coupon code copied!');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">My Coupons</h2>

            {coupons.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <p>No coupons available for you at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {coupons.map((coupon) => (
                        <div key={coupon._id} className="border border-green-200 bg-green-50 rounded-lg p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full -mr-8 -mt-8 z-0"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className={`inline-block px-2 py-1 text-xs font-bold rounded mb-2 ${coupon.discountType === 'percentage' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                        </span>
                                        <h3 className="font-bold text-lg text-gray-800 tracking-wide">{coupon.code}</h3>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(coupon.code)}
                                        className="text-gray-400 hover:text-green-600 transition-colors"
                                        title="Copy Code"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{coupon.description}</p>

                                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-green-200 pt-3">
                                    <span>Min. spend: ₹{coupon.minOrderAmount}</span>
                                    <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCoupons;
