import React, { useState, useEffect, memo } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../store/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useSelector((state) => state.auth);
    const { totalItems } = useSelector((state) => state.cart);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [search, setSearch] = useState('');
    const [showCategories, setShowCategories] = useState(false);



    const navItems = [
        { to: '/', label: 'Home' },
        { to: '/shop', label: 'Shop' },
        { to: '/about', label: 'About' },
        { to: '/manufacturing', label: 'Process' },
    ];

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/shop?search=${search}`);
    };

    return (
        <nav
            className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 
            ${scrolled ? 'shadow-xl' : 'shadow-md'} 
            bg-white/70 dark:bg-emerald-950/80 border-b border-emerald-200/30`}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-20">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-300 shadow-lg group-hover:rotate-3 transition">
                            <img
                                src="/assets/lcit-herbal-store-logo.jpg"
                                alt="LCIT Herbal"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                LCIT <span className="text-emerald-600">Herbal</span>
                            </h1>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                Natural Store
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">

                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `font-medium transition 
                                    ${isActive
                                        ? 'text-emerald-600'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-emerald-500'}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Search */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden md:flex items-center bg-emerald-50 dark:bg-emerald-900 px-4 py-2 rounded-full"
                    >
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent outline-none text-sm w-40 dark:text-white"
                        />
                    </form>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center gap-5">

                        {/* Cart */}
                        <Link to="/cart" className="relative">
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs px-1.5 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                            🛒
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="text-xl"
                        >
                            {isDark ? '🌞' : '🌙'}
                        </button>

                        {user ? (
                            <>
                                <Link to="/profile" className="font-semibold text-gray-700 dark:text-white">
                                    {user?.name?.split(' ')[0]}
                                </Link>
                                <button onClick={onLogout} className="text-red-500">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-emerald-600 text-white px-4 py-2 rounded-full"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Button */}
                    <button
                        className="md:hidden text-2xl p-2 z-50 relative dark:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white dark:bg-emerald-950 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 mt-16">
                    {/* Welcome / User Info */}
                    {user ? (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Welcome back</p>
                                <Link to="/profile" className="font-bold text-lg dark:text-white" onClick={() => setIsMenuOpen(false)}>
                                    {user?.name}
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-emerald-600 text-white text-center font-bold px-4 py-3 rounded-xl shadow-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Log In / Register
                        </Link>
                    )}

                    {/* Navigation */}
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `text-lg font-semibold p-3 rounded-xl transition-colors ${isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-emerald-900/50'}`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    <hr className="border-gray-100 dark:border-gray-800" />

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/cart"
                            className="flex items-center justify-between text-lg font-semibold p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-emerald-900/50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span>🛒 My Cart</span>
                            {totalItems > 0 && (
                                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {totalItems} items
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => {
                                setIsDark(!isDark);
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 text-lg font-semibold p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-emerald-900/50 text-left"
                        >
                            <span>{isDark ? '🌞' : '🌙'}</span>
                            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>

                        {user && (
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-3 text-lg font-semibold p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left mt-4"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default memo(Navbar);