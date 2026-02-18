import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../store/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { totalItems } = useSelector((state) => state.cart);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-green-50 backdrop-blur-md bg-white/95 transition-all duration-300 print:hidden">
            <div className="container-custom">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Area */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-green-200 shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                            L
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-display font-bold text-gray-900 leading-none tracking-tight">
                                LCIT <span className="text-green-600">Herbal</span>
                            </h1>
                            <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5">Dept. of Chemistry</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8 font-medium text-sm text-gray-600 uppercase tracking-wide">
                        <Link to="/" className="hover:text-green-600 transition-colors py-2 border-b-2 border-transparent hover:border-green-600">Home</Link>
                        <Link to="/shop" className="hover:text-green-600 transition-colors py-2 border-b-2 border-transparent hover:border-green-600">Shop</Link>
                        <Link to="/about" className="hover:text-green-600 transition-colors py-2 border-b-2 border-transparent hover:border-green-600">About Dept.</Link>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/cart" className="relative group p-2">
                            <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white group-hover:scale-110 transition-transform shadow-sm">
                                {totalItems}
                            </span>
                            <svg className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                                <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-all group">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm ring-2 ring-transparent group-hover:ring-green-200 transition-all">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{user.name.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={onLogout}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    title="Logout"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-gray-600 hover:text-green-600 font-semibold text-sm">Log In</Link>
                                <Link to="/register" className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-green-200 transition-all transform hover:-translate-y-0.5">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700 p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="container-custom py-6 flex flex-col space-y-2">
                    <Link to="/" className="text-gray-800 hover:text-green-600 font-bold p-3 rounded-lg hover:bg-green-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/shop" className="text-gray-800 hover:text-green-600 font-bold p-3 rounded-lg hover:bg-green-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                    <Link to="/about" className="text-gray-800 hover:text-green-600 font-bold p-3 rounded-lg hover:bg-green-50 transition-colors" onClick={() => setIsMenuOpen(false)}>About Dept.</Link>
                    <Link to="/cart" className="text-gray-800 hover:text-green-600 font-bold p-3 rounded-lg hover:bg-green-50 transition-colors flex justify-between items-center" onClick={() => setIsMenuOpen(false)}>
                        Shopping Cart <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">{totalItems}</span>
                    </Link>

                    <div className="border-t border-gray-100 pt-4 mt-2">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 px-3 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <Link to="/profile" className="block text-gray-700 hover:text-green-600 font-medium p-3 rounded-lg hover:bg-green-50" onClick={() => setIsMenuOpen(false)}>Help</Link>
                                <Link to="/orders" className="block text-gray-700 hover:text-green-600 font-medium p-3 rounded-lg hover:bg-green-50" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                                <button
                                    onClick={onLogout}
                                    className="w-full text-left text-red-500 font-medium p-3 mt-2 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 px-2">
                                <Link to="/login" className="btn border border-gray-300 text-gray-700 font-bold text-center py-3 rounded-xl hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                                <Link to="/register" className="btn bg-green-600 text-white font-bold text-center py-3 rounded-xl hover:bg-green-700 shadow-lg shadow-green-200" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
