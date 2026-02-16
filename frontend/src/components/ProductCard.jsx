import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    if (!product) return null;

    const inStock = product.stock > 0;
    const imageUrl = product.images?.[0]?.url || product.images?.[0] || 'https://via.placeholder.com/300?text=LCIT+Herbal';

    // Calculate effective price based on user verification status
    const getEffectivePrice = () => {
        const basePrice = product.price;
        if (user?.isLCITFaculty) {
            const disc = product.facultyDiscount ?? 50;
            return { price: basePrice - (basePrice * disc / 100), discount: disc, type: 'Faculty' };
        }
        if (user?.isLCITStudent) {
            const disc = product.studentDiscount ?? 25;
            return { price: basePrice - (basePrice * disc / 100), discount: disc, type: 'Student' };
        }
        return { price: basePrice, discount: 0, type: null };
    };

    const effective = getEffectivePrice();

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!inStock) return toast.error('Out of stock');
        dispatch(addToCart({ ...product, price: effective.price, quantity: 1 }));
        toast.success('Added to cart');
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">

            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.category && (
                    <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm text-gray-700">
                        {product.category}
                    </span>
                )}
                {effective.type && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${effective.type === 'Faculty' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                        {effective.discount}% {effective.type} Off
                    </span>
                )}
            </div>

            <div className="absolute top-3 right-3 z-10">
                {!inStock && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                        Out of Stock
                    </span>
                )}
            </div>

            {/* Image */}
            <Link to={`/product/${product._id}`} className="block relative pt-[100%] bg-gray-50 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-1">
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-400 text-xs">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3 h-3 ${i < (product.ratings?.average || 0) ? 'fill-current' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={i < (product.ratings?.average || 0) ? 0 : 2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">({product.ratings?.count || 0})</span>
                    </div>
                    <Link to={`/product/${product._id}`} className="block">
                        <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1 text-lg" title={product.name}>
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                        <span className="block text-lg font-bold text-green-700">₹{effective.price.toFixed(2)}</span>
                        {effective.type && (
                            <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                        )}
                        {!effective.type && product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${inStock ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white shadow-sm hover:shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);

