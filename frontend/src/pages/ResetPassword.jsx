import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetPassword, reset } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    /* ===============================
       EFFECTS
    =============================== */
    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }

        if (isSuccess) {
            toast.success('Password reset successfully!');
            dispatch(reset());
            navigate('/login');
        }
    }, [isError, isSuccess, message, navigate, dispatch]);

    /* ===============================
       PASSWORD STRENGTH
    =============================== */
    const getStrength = () => {
        if (password.length < 6) return 'Weak';
        if (password.length < 10) return 'Medium';
        return 'Strong';
    };

    const strength = getStrength();

    /* ===============================
       SUBMIT
    =============================== */
    const onSubmit = (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        dispatch(resetPassword({ token, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 to-emerald-50/40 px-4 py-16 relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-300/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-green-200/30 blur-[100px] rounded-full -z-10"></div>

            <div className="max-w-md w-full bg-white/85 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl shadow-green-900/10 border border-white relative z-10">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white">
                        🔐
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Create New Password
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        Choose a secure password to protect your account.
                    </p>
                </div>

                {/* FORM */}
                <form className="space-y-6" onSubmit={onSubmit}>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none"
                                placeholder="••••••••"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {/* Strength Indicator */}
                        {password && (
                            <div className="mt-2 text-xs font-medium">
                                Strength:{' '}
                                <span className={
                                    strength === 'Weak'
                                        ? 'text-red-500'
                                        : strength === 'Medium'
                                            ? 'text-yellow-500'
                                            : 'text-green-600'
                                }>
                                    {strength}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Confirm Password
                        </label>

                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg shadow-green-600/30 transition disabled:opacity-70"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ResetPassword;