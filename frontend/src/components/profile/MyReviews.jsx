import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.get('/api/reviews/my/list', config);
                setReviews(data.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch reviews');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchReviews();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">My Reviews & Ratings</h2>

            {reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p>You haven't written any reviews yet.</p>
                    <Link to="/" className="text-green-600 hover:text-green-700 font-medium mt-2 inline-block">
                        Browse products to review
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex gap-4">
                                <Link to={`/product/${review.product?._id}`} className="shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                                    <img
                                        src={review.product?.images?.[0]?.url || review.product?.image || 'https://placehold.co/100'}
                                        alt={review.product?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <Link to={`/product/${review.product?._id}`} className="font-semibold text-gray-900 hover:text-green-600 line-clamp-1">
                                            {review.product?.name}
                                        </Link>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {review.isApproved ? 'Published' : 'Pending Approval'}
                                        </span>
                                    </div>

                                    <div className="flex items-center mt-1 mb-2">
                                        <div className="flex text-yellow-400 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-gray-400 text-xs ml-2">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm italic">"{review.comment}"</p>

                                    {review.adminResponse && (
                                        <div className="mt-3 bg-gray-50 p-3 rounded text-sm border-l-2 border-green-500">
                                            <p className="font-semibold text-gray-900 text-xs mb-1">Response from Store:</p>
                                            <p className="text-gray-600">{review.adminResponse.comment}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReviews;
