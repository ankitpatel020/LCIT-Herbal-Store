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
                        className="md:hidden text-2xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-emerald-950 p-6 space-y-4">
                    {navItems.map((item) => (
                        <Link key={item.to} to={item.to}>
                            {item.label}
                        </Link>
                    ))}

                    <Link to="/cart">Cart ({totalItems})</Link>
                    <button onClick={() => setIsDark(!isDark)}>
                        Toggle Theme
                    </button>

                    {user ? (
                        <button onClick={onLogout} className="text-red-500">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default memo(Navbar);