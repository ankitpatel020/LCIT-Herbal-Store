import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { forgotPassword, reset } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }

        if (isSuccess) {
            toast.success(message);
            dispatch(reset());
        }
    }, [isError, isSuccess, message, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/40 px-4 py-16">

            <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-100">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                        <span className="text-2xl">🔐</span>
                    </div>

                    <h2 className="text-3xl font-serif font-extrabold text-gray-900">
                        Reset Your Password
                    </h2>

                    <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                        Enter your registered email address and we’ll send you a secure link to reset your password.
                    </p>
                </div>

                {/* FORM */}
                <form className="space-y-6" onSubmit={onSubmit}>

                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-lg shadow-lg transition disabled:opacity-60"
                    >
                        {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                    </button>

                </form>

                {/* FOOTER */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Remembered your password?{" "}
                    <Link
                        to="/login"
                        className="text-emerald-600 font-semibold hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;