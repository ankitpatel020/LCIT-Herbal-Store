import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, deleteReview } from '../store/slices/reviewSlice';
import toast from 'react-hot-toast';

const ProductReviews = ({ productId, reviews = [], canReview }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { isLoading } = useSelector((state) => state.reviews);

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    // 🔹 Ensure ratings are always numbers
    const sanitizedReviews = useMemo(() => {
        return reviews.map(r => ({
            ...r,
            rating: Number(r.rating) || 0
        }));
    }, [reviews]);

    const hasUserReviewed = sanitizedReviews.some(
        (r) => r.user?._id === user?._id
    );

    // 🔹 Calculate average rating
    const averageRating = useMemo(() => {
        if (sanitizedReviews.length === 0) return 0;
        const total = sanitizedReviews.reduce((sum, r) => sum + r.rating, 0);
        return (total / sanitizedReviews.length).toFixed(1);
    }, [sanitizedReviews]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to submit a review');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write a review comment');
            return;
        }

        if (hasUserReviewed) {
            toast.error('You have already reviewed this product');
            return;
        }

        try {
            await dispatch(
                createReview({
                    product: productId,
                    rating: Number(rating),
                    comment: comment.trim(),
                })
            ).unwrap();

            toast.success('Review submitted successfully!');
            setShowReviewForm(false);
            setComment('');
            setRating(5);
        } catch (err) {
            toast.error(err || 'Failed to submit review');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await dispatch(deleteReview(reviewId)).unwrap();
                toast.success('Review deleted successfully');
            } catch (error) {
                toast.error(error || 'Failed to delete review');
            }
        }
    };

    // ⭐ Star Renderer
    const renderStars = (currentRating, interactive = false) => {
        const safeRating = Number(currentRating) || 0;

        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                    const active = interactive
                        ? star <= (hoverRating || rating)
                        : star <= safeRating;

                    return (
                        <svg
                            key={star}
                            className={`w-6 h-6 transition-all duration-300 
                                ${interactive ? 'cursor-pointer hover:scale-125 hover:drop-shadow-md' : ''} 
                                ${active ? 'text-yellow-400 fill-current scale-110' : 'text-gray-300 scale-100'}
                                ${interactive && active && star === 5 ? 'animate-pulse' : ''}
                            `}
                            viewBox="0 0 24 24"
                            fill={active ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth={active ? 0 : 2}
                            onMouseEnter={() => interactive && setHoverRating(star)}
                            onMouseLeave={() => interactive && setHoverRating(0)}
                            onClick={() => interactive && setRating(star)}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="mt-12">
            <div className="border-t pt-8">

                {/* 🔹 Summary */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                        Customer Reviews ({sanitizedReviews.length})
                    </h2>

                    {sanitizedReviews.length > 0 && (
                        <div className="flex items-center gap-3 mt-2">
                            {renderStars(averageRating)}
                            <span className="text-sm text-gray-600">
                                {averageRating} out of 5
                            </span>
                        </div>
                    )}
                </div>

                {/* Write Review Button */}
                {canReview && user && !showReviewForm && !hasUserReviewed && (
                    <button
                        onClick={() => setShowReviewForm(true)}
                        className="btn btn-outline mb-6"
                    >
                        Write a Review
                    </button>
                )}

                {hasUserReviewed && (
                    <div className="mb-6 text-sm text-green-600 font-medium">
                        You’ve already reviewed this product ✅
                    </div>
                )}

                {/* Review Form */}
                {showReviewForm && (
                    <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4">
                            Write Your Review
                        </h3>

                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Rating
                                </label>
                                {renderStars(rating, true)}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Your Review
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="4"
                                    className="input"
                                    placeholder="Share your experience..."
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit Review'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Reviews List */}
                {sanitizedReviews.length > 0 ? (
                    <div className="space-y-6">
                        {sanitizedReviews.map((review) => (
                            <div key={review._id} className="border-b pb-6">
                                <div className="flex gap-4">

                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold shrink-0">
                                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold">
                                                        {review.user?.name || 'Anonymous'}
                                                    </span>

                                                    {review.isVerifiedPurchase && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                            Verified Purchase
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 mb-2">
                                                    {renderStars(review.rating)}
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            {(user?._id === review.user?._id || user?.role === 'admin') && (
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                                                    title="Delete Review"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>

                                        <p className="text-gray-700 mt-2">
                                            {review.comment}
                                        </p>

                                        {review.adminResponse?.comment && (
                                            <div className="bg-blue-50 p-3 rounded mt-3">
                                                <p className="text-xs font-semibold text-blue-900 mb-1">
                                                    Response from LCIT Herbal Store
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    {review.adminResponse.comment}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        No reviews yet. Be the first one 🚀
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
