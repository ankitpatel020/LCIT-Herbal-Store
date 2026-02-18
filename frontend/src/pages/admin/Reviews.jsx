import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviews, deleteReview, approveReview, reset } from '../../store/slices/reviewSlice';
import toast from 'react-hot-toast';

const Reviews = () => {
    const dispatch = useDispatch();
    const { reviews, isLoading, isError, message } = useSelector((state) => state.reviews);

    useEffect(() => {
        dispatch(getAllReviews());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            dispatch(deleteReview(id))
                .unwrap()
                .then(() => toast.success('Review deleted'))
                .catch((err) => toast.error(err));
        }
    };

    const handleApproval = (id, isApproved) => {
        dispatch(approveReview({ id, isApproved }))
            .unwrap()
            .then(() => toast.success(`Review ${isApproved ? 'approved' : 'rejected'}`))
            .catch((err) => toast.error(err));
    };

    return (
        <>
            <div className="section pt-0 px-0">
                <div className="w-full">
                    <h1 className="text-3xl font-display font-bold mb-8">Manage Reviews</h1>

                    {isLoading ? (
                        <div className="text-center py-10">Loading reviews...</div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="p-4 font-semibold text-gray-600">Product</th>
                                        <th className="p-4 font-semibold text-gray-600">User</th>
                                        <th className="p-4 font-semibold text-gray-600">Rating</th>
                                        <th className="p-4 font-semibold text-gray-600 w-1/3">Comment</th>
                                        <th className="p-4 font-semibold text-gray-600">Date</th>
                                        <th className="p-4 font-semibold text-gray-600">Status</th>
                                        <th className="p-4 font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review) => (
                                        <tr key={review._id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                                                        <img
                                                            src={review.product?.images?.[0] || 'https://placehold.co/50'}
                                                            alt={review.product?.name}
                                                            className="h-full w-full object-cover rounded"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium line-clamp-1 max-w-[150px]">
                                                        {review.product?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">{review.user?.name}</td>
                                            <td className="p-4 text-yellow-500 font-bold">
                                                {review.rating} ★
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                <p className="line-clamp-2">{review.comment}</p>
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                {review.isApproved ? (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col space-y-2">
                                                    {!review.isApproved && (
                                                        <button
                                                            onClick={() => handleApproval(review._id, true)}
                                                            className="text-green-600 hover:text-green-800 text-xs font-semibold uppercase text-left"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {review.isApproved && (
                                                        <button
                                                            onClick={() => handleApproval(review._id, false)}
                                                            className="text-yellow-600 hover:text-yellow-800 text-xs font-semibold uppercase text-left"
                                                        >
                                                            Unapprove
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(review._id)}
                                                        className="text-red-600 hover:text-red-800 text-xs font-semibold uppercase text-left"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {reviews.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="p-8 text-center text-gray-500">
                                                No reviews found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Reviews;
