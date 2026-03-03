import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 to-emerald-50/40 px-4 relative overflow-hidden">

            {/* Ambient Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-300/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-green-200/30 blur-[100px] rounded-full -z-10"></div>

            <div className="max-w-xl w-full text-center bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl shadow-green-900/10 border border-white">

                {/* 404 */}
                <h1 className="text-7xl md:text-8xl font-extrabold text-gray-900 tracking-tight mb-4">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Page Not Found
                </h2>

                <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                    Looks like this formulation doesn’t exist in our lab.
                    The page may have been removed or the link might be incorrect.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">

                    <Link
                        to="/"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-600/30 transition transform hover:-translate-y-1"
                    >
                        Go Home
                    </Link>

                    <Link
                        to="/shop"
                        className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-8 py-3 rounded-full font-bold shadow-sm transition transform hover:-translate-y-1"
                    >
                        Browse Products
                    </Link>

                </div>

                {/* Subtle Footer */}
                <div className="mt-12 text-xs text-gray-400">
                    If you believe this is an error, please contact support.
                </div>

            </div>
        </div>
    );
};

export default NotFound;