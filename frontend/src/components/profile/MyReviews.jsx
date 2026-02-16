import React from 'react';

const MyReviews = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center text-4xl mb-6">
                ⭐
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">My Reviews & Ratings</h2>
            <p className="text-gray-500 max-w-sm">
                You haven't reviewed any products yet. Share your experience to help others!
            </p>
        </div>
    );
};

export default MyReviews;
