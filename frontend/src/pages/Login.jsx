import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) toast.error(message);

        if (isSuccess || user) navigate('/');

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/40 px-4 py-16">

            <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-100">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                        <span className="text-2xl">🌿</span>
                    </div>

                    <h2 className="text-3xl font-serif font-extrabold text-gray-900">
                        Welcome Back
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to continue your herbal journey
                    </p>
                </div>

                {/* FORM */}
                <form className="space-y-6" onSubmit={onSubmit}>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={onChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    />

                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3 text-sm text-gray-500"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-emerald-600" />
                            Remember me
                        </label>

                        <button
                            type="button"
                            className="text-emerald-600 hover:underline"
                            onClick={() => navigate('/forgot-password')}
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-lg shadow-lg transition disabled:opacity-60"
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>

                </form>

                {/* FOOTER */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-emerald-600 font-semibold hover:underline"
                    >
                        Create one
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;