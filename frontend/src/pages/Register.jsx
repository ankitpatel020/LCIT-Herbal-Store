import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { name, email, password, confirmPassword } = formData;

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

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        dispatch(register({ name, email, password }));
    };

    /* Password Strength */
    const getStrength = () => {
        if (password.length > 8 && /[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
        if (password.length >= 6) return "Medium";
        return "Weak";
    };

    const strength = getStrength();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/40 px-4 py-16">

            <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-emerald-900/10 border border-emerald-100">

                <div className="text-center mb-10">
                    <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                        <span className="text-2xl font-bold text-emerald-700">🌿</span>
                    </div>

                    <h2 className="text-3xl font-serif font-extrabold text-gray-900">
                        Join LCIT Herbal
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Create your wellness account
                    </p>
                </div>

                <form className="space-y-5" onSubmit={onSubmit}>

                    {/* NAME */}
                    <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="Full Name"
                        value={name}
                        onChange={onChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    />

                    {/* EMAIL */}
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

                    {/* PASSWORD */}
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
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

                    {/* PASSWORD STRENGTH */}
                    {password && (
                        <div className={`text-sm font-medium ${strength === "Strong"
                            ? "text-emerald-600"
                            : strength === "Medium"
                                ? "text-yellow-600"
                                : "text-red-500"
                            }`}>
                            Password Strength: {strength}
                        </div>
                    )}

                    {/* CONFIRM PASSWORD */}
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            required
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={onChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-3 text-sm text-gray-500"
                        >
                            {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* TERMS */}
                    <div className="flex items-start gap-2 text-sm">
                        <input type="checkbox" required className="mt-1 accent-emerald-600" />
                        <span>
                            I agree to the{" "}
                            <Link to="/terms" className="text-emerald-600 hover:underline">
                                Terms
                            </Link>{" "}
                            and{" "}
                            <Link to="/privacy" className="text-emerald-600 hover:underline">
                                Privacy Policy
                            </Link>
                        </span>
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-lg shadow-lg transition disabled:opacity-60"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Register;