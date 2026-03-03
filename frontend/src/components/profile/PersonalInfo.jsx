import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const PersonalInfo = ({ user }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const { name, email, phone, password, confirmPassword } = formData;

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            }));
        }
    }, [user]);

    /* ===============================
       PASSWORD STRENGTH
    =============================== */
    const passwordStrength = useMemo(() => {
        if (!password) return null;
        if (password.length < 6) return 'Weak';
        if (password.length < 10) return 'Medium';
        return 'Strong';
    }, [password]);

    /* ===============================
       INPUT CHANGE
    =============================== */
    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    /* ===============================
       SUBMIT
    =============================== */
    const onSubmitPersonal = (e) => {
        e.preventDefault();

        if (password && password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (password && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        dispatch(updateProfile({
            name,
            email,
            phone,
            password: password || undefined,
        }));

        if (password) {
            setFormData((prev) => ({
                ...prev,
                password: '',
                confirmPassword: '',
            }));
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Profile Information
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Update your personal details and security settings.
                    </p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-xl">
                    👤
                </div>
            </div>

            <form onSubmit={onSubmitPersonal} className="space-y-8">

                {/* BASIC INFO */}
                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-gray-50 focus:bg-white transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Email cannot be changed
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-400 text-sm">
                                +91
                            </span>
                            <input
                                type="tel"
                                name="phone"
                                value={phone}
                                onChange={onChange}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-gray-50 focus:bg-white transition"
                                placeholder="9876543210"
                            />
                        </div>
                    </div>

                </div>

                {/* PASSWORD SECTION */}
                <div className="border-t pt-6">

                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        🔒 Change Password
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    placeholder="Leave blank to keep current"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-gray-50 focus:bg-white transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3 text-xs text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {passwordStrength && (
                                <p className={`text-xs mt-2 font-medium ${passwordStrength === 'Weak'
                                        ? 'text-red-500'
                                        : passwordStrength === 'Medium'
                                            ? 'text-yellow-500'
                                            : 'text-emerald-600'
                                    }`}>
                                    Strength: {passwordStrength}
                                </p>
                            )}

                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                placeholder="Confirm new password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 bg-gray-50 focus:bg-white transition"
                            />
                        </div>

                    </div>

                </div>

                {/* SUBMIT */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/30 transition disabled:opacity-70"
                    >
                        {isLoading ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default PersonalInfo;