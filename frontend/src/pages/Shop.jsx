import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiX, FiFilter, FiStar } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Shop = () => {
    const dispatch = useDispatch();
    const { products, isLoading, isError, message } = useSelector((state) => state.products);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [rating, setRating] = useState(0);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const categories = [
        'all',
        'Herbal Soaps',
        'Natural Oils',
        'Ayurvedic Powders',
        'Face Packs',
        'Plant Medicines',
        'Hair Care',
        'Skin Care',
        'Wellness',
        'Other',
    ];

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm.trim());
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        dispatch(
            getProducts({
                search: debouncedSearch,
                category: selectedCategory !== 'all' ? selectedCategory : '',
                sort: sortBy,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                rating,
            })
        );
    }, [dispatch, debouncedSearch, selectedCategory, sortBy, priceRange, rating]);

    const activeFilters = useMemo(() => {
        let count = 0;
        if (debouncedSearch) count++;
        if (selectedCategory !== 'all') count++;
        if (sortBy !== 'newest') count++;
        if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
        if (rating > 0) count++;
        return count;
    }, [debouncedSearch, selectedCategory, sortBy, priceRange, rating]);

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSortBy('newest');
        setPriceRange([0, 1000]);
        setRating(0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-emerald-50/20">

            {/* HERO HEADER */}
            <div className="py-16 text-center bg-emerald-800/5 border-b border-emerald-100">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow mb-4">
                    <FaLeaf className="text-emerald-700" />
                    <span className="text-sm font-semibold text-emerald-800 uppercase">
                        LCIT Herbal Store
                    </span>
                </div>
                <h1 className="text-5xl font-serif font-bold">
                    Herbal <span className="text-emerald-700">Collection</span>
                </h1>
            </div>

            <div className="container-custom py-12 grid lg:grid-cols-4 gap-10">

                {/* Mobile Filter Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${isMobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setIsMobileFiltersOpen(false)}
                />

                {/* SIDEBAR FILTERS */}
                <div className={`
                    fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 p-6 overflow-y-auto transition-transform duration-300 transform flex flex-col gap-6
                    lg:static lg:block lg:w-auto lg:max-w-none lg:z-auto lg:p-6 lg:rounded-2xl lg:shadow-md lg:border lg:border-emerald-100 lg:h-fit lg:sticky lg:top-24 lg:translate-x-0
                    ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>

                    <div className="flex justify-between items-center lg:hidden pb-4 border-b">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 text-2xl">
                            <FiX />
                        </button>
                    </div>

                    {/* Search */}
                    <div>
                        <label className="font-semibold text-gray-700">Search</label>
                        <div className="relative mt-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                placeholder="Search products..."
                            />
                            <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="font-semibold text-gray-700">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full mt-2 p-2 border rounded-lg"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="font-semibold text-gray-700">
                            Price Range ₹{priceRange[0]} - ₹{priceRange[1]}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, e.target.value])}
                            className="w-full mt-2"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="font-semibold text-gray-700">Minimum Rating</label>
                        <div className="flex gap-2 mt-2">
                            {[1, 2, 3, 4, 5].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRating(r)}
                                    className={`p-1 rounded ${rating >= r ? 'text-amber-500' : 'text-gray-300'
                                        }`}
                                >
                                    <FiStar className="w-5 h-5 fill-current" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeFilters > 0 && (
                        <button
                            onClick={resetFilters}
                            className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            Clear Filters ({activeFilters})
                        </button>
                    )}
                </div>

                {/* PRODUCTS AREA */}
                <div className="lg:col-span-3">

                    {/* Sort & Mobile Filter Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="lg:hidden flex items-center justify-center gap-2 bg-white border border-emerald-200 px-4 py-2 rounded-lg font-semibold shadow-sm w-full sm:w-auto"
                            >
                                <FiFilter /> Filters
                            </button>
                            <span className="text-gray-600 hidden sm:block">
                                {products?.length || 0} Products Found
                            </span>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="p-2 border rounded-lg w-full sm:w-auto bg-white"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-low">Price Low → High</option>
                            <option value="price-high">Price High → Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-80 bg-white animate-pulse rounded-2xl"></div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-red-600 text-center py-20">
                            {message}
                        </div>
                    ) : products?.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                        >
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold mb-4">No products found</h3>
                            <button
                                onClick={resetFilters}
                                className="px-6 py-3 bg-emerald-700 text-white rounded-lg"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;