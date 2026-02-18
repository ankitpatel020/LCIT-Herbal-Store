import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, reset } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { getProductReviews, reset as resetReviews } from '../store/slices/reviewSlice';
import { getMyOrders } from '../store/slices/orderSlice';
import ProductReviews from '../components/ProductReviews';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { product, isLoading, isError, message } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const { reviews: productReviews } = useSelector((state) => state.reviews);
    const { orders } = useSelector((state) => state.orders);

    const [qty] = useState(1); // Default to 1 if selector removed
    const [selectedImage, setSelectedImage] = useState('');
    const [canReview, setCanReview] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    /* ===============================
       FETCH DATA
    =============================== */
    useEffect(() => {
        dispatch(getProduct(id));
        dispatch(getProductReviews(id));
        if (user) dispatch(getMyOrders());

        return () => {
            dispatch(reset());
            dispatch(resetReviews());
        };
    }, [dispatch, id, user]);

    /* ===============================
       SET DEFAULT IMAGE
    =============================== */
    useEffect(() => {
        if (product?.images?.length > 0) {
            setSelectedImage(product.images[0]?.url || product.images[0]);
        } else if (product?.image) {
            setSelectedImage(product.image);
        }
    }, [product]);

    /* ===============================
       CHECK REVIEW ELIGIBILITY
    =============================== */
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

    /* ===============================
       RATING
    =============================== */
    const averageRating = useMemo(
        () => Number(product?.ratings?.average) || 0,
        [product]
    );

    const reviewCount = product?.ratings?.count || 0;

    const renderStars = (rating) => (
        <div className="flex gap-1 text-yellow-400">
            {[1, 2, 3, 4, 5].map(star => (
                <svg
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(rating)
                        ? 'fill-current'
                        : 'text-gray-300'
                        }`}
                    viewBox="0 0 24 24"
                >
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            ))}
        </div>
    );

    /* ===============================
       PRICING LOGIC
    =============================== */
    const {
        finalPrice,
        referencePrice,
        discountPercent,
        savings,
    } = useMemo(() => {
        if (!product) {
            return {
                finalPrice: 0,
                referencePrice: 0,
                discountPercent: 0,
                discountSource: null,
                savings: 0,
            };
        }

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
                    ((reference - priceAfterUserDiscount) / reference) * 100
                )
                : 0;

        const saved =
            reference > priceAfterUserDiscount
                ? reference - priceAfterUserDiscount
                : 0;

        return {
            finalPrice: Math.max(priceAfterUserDiscount, 0),
            referencePrice: reference,
            discountPercent: percent,
            discountSource: source,
            savings: saved,
        };
    }, [product, user]);

    /* ===============================
       ADD TO CART
    =============================== */
    const handleAddToCart = () => {
        if (product?.stock <= 0)
            return toast.error('Out of Stock');

        dispatch(
            addToCart({
                ...product,
                price: finalPrice,
                quantity: Number(qty),
                originalPrice: referencePrice,
                savings,
            })
        );

        toast.success('Added to Cart');
    };

    /* ===============================
       LOADING & ERROR
    =============================== */
    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );

    if (isError)
        return (
            <div className="text-center py-20 text-red-600">
                Error: {message}
            </div>
        );

    if (!product) return null;

    /* ===============================
       UI
    =============================== */
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="container-custom py-12">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* IMAGE SECTION */}
                    <div>
                        <div className="bg-white rounded-3xl shadow-sm border aspect-square relative mb-6 overflow-hidden">

                            {discountPercent > 0 && (
                                <span className="absolute top-4 right-4 bg-green-600 text-white px-4 py-1.5 rounded-md font-bold z-10">
                                    🔥 {discountPercent}% OFF
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
                    </div>

                    {/* DETAILS SECTION */}
                    <div>

                        <h1 className="text-4xl font-bold mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-xl font-bold">
                                {averageRating.toFixed(1)}
                            </span>
                            {renderStars(averageRating)}
                            <span className="text-gray-500">
                                ({reviewCount} Reviews)
                            </span>
                        </div>

                        {/* PRICE */}
                        <div className="flex items-baseline gap-4 mb-4">
                            <span className="text-5xl font-bold text-green-600">
                                ₹{finalPrice.toLocaleString('en-IN')}
                            </span>

                            {referencePrice > finalPrice && (
                                <>
                                    <span className="text-2xl line-through text-gray-400">
                                        ₹{referencePrice.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-green-600 font-bold">
                                        {discountPercent}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {savings > 0 && (
                            <div className="mb-6 text-gray-600 font-medium">
                                You Save ₹{savings.toLocaleString('en-IN')}
                            </div>
                        )}

                        {/* QUANTITY + CART */}
                        {product.stock > 0 ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ) : (
                            <div className="text-red-600 font-bold">
                                Out of Stock
                            </div>
                        )}
                    </div>
                </div>

                {/* TABS */}
                <div className="mt-16">
                    <div className="flex border-b mb-8">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-6 py-3 font-bold ${activeTab === 'description'
                                ? 'border-b-2 border-green-600 text-green-600'
                                : 'text-gray-500'
                                }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-3 font-bold ${activeTab === 'reviews'
                                ? 'border-b-2 border-green-600 text-green-600'
                                : 'text-gray-500'
                                }`}
                        >
                            Reviews
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        {activeTab === 'description' ? (
                            <p>{product.description}</p>
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
