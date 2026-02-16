import React from 'react';

const MyCoupons = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">
                🎟️
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">My Coupons</h2>
            <p className="text-gray-500 max-w-sm mb-6">
                You don't have any active coupons yet. Keep shopping to earn rewards!
            </p>
            <button className="btn bg-green-600 text-white px-6 py-2 rounded-xl font-bold">
                Browse Products
            </button>
        </div>
    );
};

export default MyCoupons;
