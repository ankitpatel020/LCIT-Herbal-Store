import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const { token } = useSelector((state) => state.auth);

    const API_URL = process.env.REACT_APP_API_URL || '/api';

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const authToken = token || localStorage.getItem('token');
                if (!authToken) throw new Error('Unauthorized');

                const { data } = await axios.get(
                    `${API_URL}/reviews/my/list`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                setReviews(data?.data || []);
            } catch (error) {
                console.error(error);
                toast.error(
                    error.response?.data?.message || 'Failed to fetch reviews'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [token, API_URL]);

    const renderStars = (rating = 0) => {
        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
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
                My Reviews & Ratings
            </h2>

            {reviews.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <div className="text-5xl mb-4">⭐</div>
                    <p className="text-sm mb-4">
                        You haven’t written any reviews yet.
                    </p>
                    <Link
                        to="/shop"
                        className="text-green-600 font-semibold hover:underline"
                    >
                        Browse products
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {reviews.map((review) => {
                        const product = review.product || {};
                        const productId = product?._id;

                        const image =
                            product?.images?.[0]?.url ||
                            product?.image ||
                            'https://placehold.co/100x100?text=Product';

                        return (
                            <div
                                key={review._id}
                                className="border-b border-gray-100 pb-8 last:border-0 last:pb-0"
                            >
                                <div className="flex gap-6">

                                    {/* Product Image */}
                                    <Link
                                        to={`/product/${productId}`}
                                        className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border"
                                    >
                                        <img
                                            src={image}
                                            alt={product?.name || 'Product'}
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>

                                    {/* Review Content */}
                                    <div className="flex-1">

                                        <div className="flex justify-between items-start mb-2">
                                            <Link
                                                to={`/product/${productId}`}
                                                className="font-semibold text-gray-900 hover:text-green-600 line-clamp-1"
                                            >
                                                {product?.name}
                                            </Link>

                                            <span
                                                className={`text-xs px-3 py-1 rounded-full font-semibold ${review.isApproved
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {review.isApproved
                                                    ? 'Published'
                                                    : 'Pending'}
                                            </span>
                                        </div>

                                        {/* Rating + Date */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex">
                                                {renderStars(review.rating)}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(
                                                    review.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Comment */}
                                        <p className="text-gray-600 text-sm italic mb-3">
                                            "{review.comment}"
                                        </p>

                                        {/* Admin Response */}
                                        {review.adminResponse?.comment && (
                                            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-green-500 text-sm">
                                                <p className="font-semibold text-gray-900 text-xs mb-1">
                                                    Store Response
                                                </p>
                                                <p className="text-gray-600">
                                                    {review.adminResponse.comment}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyReviews;