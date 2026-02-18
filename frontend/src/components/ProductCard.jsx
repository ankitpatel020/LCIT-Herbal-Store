import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const inStock = product?.stock > 0;

    const imageUrl =
        product?.images?.[0]?.url ||
        product?.images?.[0] ||
        product?.image ||
        'https://placehold.co/300?text=LCIT+Herbal';

    /* ===============================
       STABLE PRICING CALCULATION
    =============================== */
    const { finalPrice, referencePrice, discountPercent, discountSource } =
        useMemo(() => {
            if (!product) return {
                finalPrice: 0,
                referencePrice: 0,
                discountPercent: 0,
                discountSource: null
            };

            const basePrice = Number(product.price) || 0;
            const mrp = Number(product.originalPrice) || basePrice;

            let priceAfterUserDiscount = basePrice;
            let source = null;

            if (user?.isLCITFaculty) {
                const disc = product.facultyDiscount ?? 50;
                priceAfterUserDiscount =
                    basePrice - (basePrice * disc) / 100;
                source = 'Faculty';
            } else if (user?.isLCITStudent) {
                const disc = product.studentDiscount ?? 25;
                priceAfterUserDiscount =
                    basePrice - (basePrice * disc) / 100;
                source = 'Student';
            }

            const reference = mrp > basePrice ? mrp : basePrice;

            const percent =
                reference > priceAfterUserDiscount
                    ? Math.round(
                        ((reference - priceAfterUserDiscount) / reference) *
                        100
                    )
                    : 0;

            return {
                finalPrice: Math.max(priceAfterUserDiscount, 0),
                referencePrice: reference,
                discountPercent: percent,
                discountSource: source,
            };
        }, [product, user]);

    /* ===============================
       ADD TO CART
    =============================== */
    const handleAddToCart = (e) => {
        e.preventDefault();

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

        toast.success('Added to cart');
    };

    if (!product) return null;

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">

            {/* BADGES */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {discountPercent > 0 && (
                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                        🔥 {discountPercent}% OFF
                    </span>
                )}

                {discountSource && (
                    <span
                        className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${discountSource === 'Faculty'
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                            }`}
                    >
                        {discountSource}
                    </span>
                )}
            </div>

            {!inStock && (
                <div className="absolute top-3 right-3 z-10">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                        Out of Stock
                    </span>
                </div>
            )}

            {/* IMAGE */}
            <Link
                to={`/product/${product._id}`}
                className="block relative pt-[100%] bg-gray-50 overflow-hidden"
            >
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* RATING BADGE */}
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-800 flex items-center gap-0.5 shadow-sm">
                    {product.ratings?.average || 0}
                    <svg
                        className="w-2.5 h-2.5 text-green-600 fill-current"
                        viewBox="0 0 24 24"
                    >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </div>
            </Link>

            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-grow">
                <Link
                    to={`/product/${product._id}`}
                    className="block mb-2"
                >
                    <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1 text-base">
                        {product.name}
                    </h3>
                </Link>

                {/* PRICE SECTION */}
                <div className="mt-auto flex items-end justify-between gap-2">
                    <div className="flex flex-col">

                        {discountPercent > 0 && (
                            <span className="text-green-600 text-xs font-bold mb-1">
                                ↓ {discountPercent}% OFF
                            </span>
                        )}

                        <div className="flex items-center gap-2">
                            {referencePrice > finalPrice && (
                                <span className="text-gray-400 line-through text-sm font-semibold">
                                    ₹{referencePrice.toLocaleString('en-IN')}
                                </span>
                            )}

                            <span className="text-lg font-bold text-gray-900">
                                ₹{finalPrice.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${inStock
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg hover:scale-105'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);
