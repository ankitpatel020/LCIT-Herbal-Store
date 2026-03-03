import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, reset } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { getProductReviews, reset as resetReviews } from '../store/slices/reviewSlice';
import { getMyOrders } from '../store/slices/orderSlice';
import ProductReviews from '../components/ProductReviews';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { product, isLoading, isError, message } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const { reviews: productReviews } = useSelector((state) => state.reviews);
    const { orders } = useSelector((state) => state.orders);

    const [selectedImage, setSelectedImage] = useState('');
    const [canReview, setCanReview] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    /* FETCH */
    useEffect(() => {
        dispatch(getProduct(id));
        dispatch(getProductReviews(id));
        if (user) dispatch(getMyOrders());

        return () => {
            dispatch(reset());
            dispatch(resetReviews());
        };
    }, [dispatch, id, user]);

    useEffect(() => {
        if (product?.images?.length > 0) {
            setSelectedImage(product.images[0]?.url || product.images[0]);
        } else if (product?.image) {
            setSelectedImage(product.image);
        }
    }, [product]);

    /* REVIEW ELIGIBILITY */
    useEffect(() => {
        if (!user || !orders?.length) return setCanReview(false);

        const hasPurchased = orders.some(order =>
            order.orderStatus === 'Delivered' &&
            order.orderItems.some(item =>
                (item.product?._id || item.product) === id
            )
        );

        setCanReview(hasPurchased);
    }, [user, orders, id]);

    /* PRICING */
    const { finalPrice, referencePrice, discountPercent, savings } = useMemo(() => {
        if (!product) return { finalPrice: 0, referencePrice: 0, discountPercent: 0, savings: 0 };

        const basePrice = Number(product.price) || 0;
        const mrp = Number(product.originalPrice) || basePrice;

        let priceAfterDiscount = basePrice;

        if (user?.isLCITFaculty) {
            const disc = product.facultyDiscount ?? 50;
            priceAfterDiscount = basePrice - (basePrice * disc) / 100;
        } else if (user?.isLCITStudent) {
            const disc = product.studentDiscount ?? 25;
            priceAfterDiscount = basePrice - (basePrice * disc) / 100;
        }

        const reference = mrp > basePrice ? mrp : basePrice;
        const percent =
            reference > priceAfterDiscount
                ? Math.round(((reference - priceAfterDiscount) / reference) * 100)
                : 0;

        return {
            finalPrice: priceAfterDiscount,
            referencePrice: reference,
            discountPercent: percent,
            savings: reference - priceAfterDiscount,
        };
    }, [product, user]);

    const handleAddToCart = () => {
        if (product?.stock <= 0) return toast.error('Out of Stock');

        dispatch(
            addToCart({
                ...product,
                price: finalPrice,
                quantity: 1,
                originalPrice: referencePrice,
                regularPrice: product.price,
            })
        );

        toast.success('Added to Cart 🌿');
    };

    const handleBuyNow = () => {
        if (product?.stock <= 0) return toast.error('Out of Stock');

        dispatch(
            addToCart({
                ...product,
                price: finalPrice,
                quantity: 1,
                originalPrice: referencePrice,
                regularPrice: product.price,
            })
        );

        navigate('/checkout');
    };

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 to-emerald-50/30">
                <div className="animate-spin h-14 w-14 border-t-2 border-b-2 border-emerald-600 rounded-full"></div>
            </div>
        );

    if (isError)
        return <div className="text-center py-20 text-red-600">Error: {message}</div>;

    if (!product) return null;

    const averageRating = Number(product?.ratings?.average) || 0;
    const reviewCount = product?.ratings?.count || 0;

    return (
        <div className="bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/30 min-h-screen pb-20">
            <div className="container-custom py-8 md:py-14">

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

                    {/* IMAGE SECTION */}
                    <div>

                        <div className="relative bg-white rounded-3xl shadow-2xl border border-emerald-100 aspect-square overflow-hidden mb-6">

                            {discountPercent > 0 && (
                                <span className="absolute top-4 right-4 bg-emerald-700 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                    {discountPercent}% OFF
                                </span>
                            )}

                            {selectedImage && (
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        {/* THUMBNAILS */}
                        {product.images?.length > 1 && (
                            <div className="flex gap-4">
                                {product.images.map((img, i) => {
                                    const url = img?.url || img;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(url)}
                                            className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${selectedImage === url
                                                ? 'border-emerald-600'
                                                : 'border-gray-200'
                                                }`}
                                        >
                                            <img
                                                src={url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* DETAILS SECTION */}
                    <div>

                        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4 sm:mb-6 leading-tight">
                            {product.name}
                        </h1>

                        {/* RATING */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="text-xl font-bold">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="flex gap-1 text-yellow-400">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star}>
                                        {star <= Math.round(averageRating) ? '★' : '☆'}
                                    </span>
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">
                                ({reviewCount} Reviews)
                            </span>
                        </div>

                        {/* PRICE */}
                        <div className="mb-8">
                            <div className="flex flex-wrap items-end gap-3 sm:gap-4">
                                <span className="text-4xl sm:text-5xl font-bold text-emerald-700">
                                    ₹{finalPrice.toLocaleString('en-IN')}
                                </span>

                                {referencePrice > finalPrice && (
                                    <span className="text-xl sm:text-2xl line-through text-gray-400">
                                        ₹{referencePrice.toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>

                            {savings > 0 && (
                                <div className="text-emerald-600 font-semibold mt-2">
                                    You Save ₹{savings.toLocaleString('en-IN')}
                                </div>
                            )}
                        </div>

                        {/* ACTION BUTTONS */}
                        {product.stock > 0 ? (
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-white border border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 py-4 rounded-2xl font-bold text-lg shadow-sm hover:shadow transition-all duration-300"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Buy Now
                                </button>
                            </div>
                        ) : (
                            <div className="bg-red-50 text-red-600 font-bold py-4 rounded-2xl text-center border border-red-100 mt-8">
                                Out of Stock
                            </div>
                        )}
                    </div>
                </div>

                {/* TABS */}
                <div className="mt-20">

                    <div className="flex gap-6 sm:gap-8 border-b border-emerald-100 mb-8 sm:mb-10 overflow-x-auto whitespace-nowrap">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-4 font-semibold text-sm sm:text-base ${activeTab === 'description'
                                ? 'text-emerald-700 border-b-2 border-emerald-600'
                                : 'text-gray-500 hover:text-emerald-600 transition'
                                }`}
                        >
                            Description
                        </button>

                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-4 font-semibold text-sm sm:text-base ${activeTab === 'reviews'
                                ? 'text-emerald-700 border-b-2 border-emerald-600'
                                : 'text-gray-500 hover:text-emerald-600 transition'
                                }`}
                        >
                            Reviews
                        </button>
                    </div>

                    <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-emerald-100">
                        {activeTab === 'description' ? (
                            <p className="leading-relaxed text-gray-700">
                                {product.description}
                            </p>
                        ) : (
                            <ProductReviews
                                productId={id}
                                reviews={productReviews}
                                canReview={canReview}
                            />
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;