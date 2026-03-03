import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiStar, FiHeart, FiEye } from 'react-icons/fi';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const inStock = product?.stock > 0;

    const imageUrl =
        product?.images?.[0]?.url ||
        product?.images?.[0] ||
        product?.image ||
        'https://placehold.co/400x400?text=LCIT+Herbal';

    /* ===============================
       PRICING LOGIC
    =============================== */
    const { finalPrice, referencePrice, discountPercent, discountSource } = useMemo(() => {
        if (!product)
            return {
                finalPrice: 0,
                referencePrice: 0,
                discountPercent: 0,
                discountSource: null,
            };

        const basePrice = Number(product.price) || 0;
        const mrp = Number(product.originalPrice) || basePrice;

        let priceAfterUserDiscount = basePrice;
        let source = null;

        if (user?.isLCITFaculty) {
            const disc = product.facultyDiscount ?? 50;
            priceAfterUserDiscount = basePrice - (basePrice * disc) / 100;
            source = 'Faculty';
        } else if (user?.isLCITStudent) {
            const disc = product.studentDiscount ?? 25;
            priceAfterUserDiscount = basePrice - (basePrice * disc) / 100;
            source = 'Student';
        }

        const reference = mrp > basePrice ? mrp : basePrice;

        const percent =
            reference > priceAfterUserDiscount
                ? Math.round(((reference - priceAfterUserDiscount) / reference) * 100)
                : 0;

        return {
            finalPrice: Math.max(priceAfterUserDiscount, 0),
            referencePrice: reference,
            discountPercent: percent,
            discountSource: source,
        };
    }, [product, user]);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!inStock) return toast.error('Out of stock');

        dispatch(
            addToCart({
                ...product,
                price: finalPrice,
                quantity: 1,
                originalPrice: referencePrice,
                regularPrice: product.price,
            })
        );

        toast.success('Added to cart 🌿');
    };

    if (!product) return null;

    return (
        <div className="group flex flex-col bg-white rounded-3xl border border-gray-100/80 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)] transition-all duration-500 overflow-hidden relative h-full">

            {/* BADGES */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {discountPercent > 0 && (
                    <span className="bg-emerald-500 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-md backdrop-blur-md">
                        {discountPercent}% OFF
                    </span>
                )}
                {!inStock && (
                    <span className="bg-red-500/90 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-md backdrop-blur-md">
                        Sold Out
                    </span>
                )}
            </div>

            {/* QUICK ACTIONS */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <button
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-rose-500 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                    title="Add to Wishlist"
                    onClick={(e) => { e.preventDefault(); toast.success('Added to Wishlist!'); }}
                >
                    <FiHeart size={18} className="stroke-2" />
                </button>
                <Link
                    to={`/product/${product._id}`}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm text-gray-700 hover:text-emerald-600 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                    title="Quick View"
                >
                    <FiEye size={18} className="stroke-2" />
                </Link>
            </div>

            {/* IMAGE CONTAINER */}
            <Link to={`/product/${product._id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-50 p-6">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                />
            </Link>

            {/* CONTENT */}
            <div className="p-5 flex flex-col flex-grow bg-white z-20">

                {/* CATEGORY & RATING */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-semibold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-2.5 py-1 rounded-md">
                        {product.category || 'Herbal'}
                    </span>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                        <FiStar className="text-amber-400 fill-amber-400" size={12} />
                        <span className="text-xs font-bold text-amber-700">
                            {product.ratings?.average?.toFixed(1) || '0.0'}
                        </span>
                    </div>
                </div>

                {/* TITLE */}
                <Link to={`/product/${product._id}`} className="mt-1 mb-2 block">
                    <h3 className="font-bold text-gray-900 text-[17px] leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto">
                    {/* PRICING */}
                    <div className="flex flex-col gap-0.5 mb-4">
                        {referencePrice > finalPrice ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                    ₹{finalPrice.toLocaleString('en-IN')}
                                </span>
                                <span className="text-sm font-medium text-gray-400 line-through decoration-gray-300">
                                    ₹{referencePrice.toLocaleString('en-IN')}
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                ₹{finalPrice.toLocaleString('en-IN')}
                            </span>
                        )}

                        {discountSource && (
                            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {discountSource} Price Applied
                            </span>
                        )}
                    </div>

                    {/* ADD TO CART BUTTON */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${inStock
                                ? 'bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] shadow-[0_4px_14px_rgba(0,0,0,0.1)]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <FiShoppingCart size={18} className={inStock ? "group-hover:animate-bounce" : ""} />
                        {inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);