import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const dispatch = useDispatch();
    const { products, isLoading, isError, message } = useSelector((state) => state.products);

    // Local filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

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

    useEffect(() => {
        dispatch(getProducts({
            search: searchTerm,
            category: selectedCategory !== 'all' ? selectedCategory : '',
            sort: sortBy
        }));
    }, [dispatch, searchTerm, selectedCategory, sortBy]);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-green-900 text-white py-16 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 pattern-grid opacity-20"></div>
                <div className="container-custom text-center relative z-10">
                    <span className="text-green-300 font-bold tracking-widest uppercase text-xs mb-3 block">Department of Chemistry</span>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Scientific Herbal Formulations</h1>
                    <p className="text-green-100 max-w-2xl mx-auto text-lg">
                        Explore our collection of student-created, lab-tested herbal products.
                        Merging traditional knowledge with modern science.
                    </p>
                </div>
            </div>

            <div className="container-custom pb-20">
                {/* Actions Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 sticky top-24 z-30 transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search by name, herb, or benefit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-700 placeholder-gray-400"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Filters Group */}
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none cursor-pointer text-gray-700 font-medium"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none cursor-pointer text-gray-700 font-medium"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                    </div>
                ) : isError ? (
                    <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg border border-red-100">
                        Error: {message}
                    </div>
                ) : (
                    <>
                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    We couldn't find any products matching your current filters. Try searching for something else or clearing your filters.
                                </p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                                    className="mt-6 text-green-600 font-bold hover:text-green-700"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Shop;
