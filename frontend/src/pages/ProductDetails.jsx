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

    const [qty, setQty] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');
    const [canReview, setCanReview] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        dispatch(getProduct(id));
        dispatch(getProductReviews(id));
        if (user) dispatch(getMyOrders());
        return () => { dispatch(reset()); dispatch(resetReviews()); };
    }, [dispatch, id, user]);

    useEffect(() => {
        if (product?.images?.length > 0) {
            setSelectedImage(product.images[0]?.url || product.images[0]);
        } else if (product?.image) {
            setSelectedImage(product.image);
        }
    }, [product]);

    useEffect(() => {
        if (!user || !orders?.length) return setCanReview(false);
        const hasPurchased = orders.some(order =>
            order.orderStatus === 'Delivered' &&
            order.orderItems.some(item => (item.product?._id || item.product) === id)
        );
        setCanReview(hasPurchased);
    }, [user, orders, id]);

    const averageRating = useMemo(() => Number(product?.ratings?.average) || 0, [product]);
    const reviewCount = product?.ratings?.count || 0;

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className={`w-5 h-5 ${star <= Math.round(rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 24 24" stroke="currentColor" fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={star <= Math.round(rating) ? 0 : 2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                ))}
            </div>
        );
    };

    // Calculate effective price based on user verification status
    const getPricing = () => {
        if (!product) return { finalPrice: 0, referencePrice: 0, totalDiscountPercent: 0, discountSource: null };

        const basePrice = product.price;
        const mrp = product.originalPrice || basePrice;

        let finalPrice = basePrice;
        let discountSource = null;

        if (user?.isLCITFaculty) {
            const disc = product.facultyDiscount ?? 50;
            finalPrice = basePrice - (basePrice * disc / 100);
            discountSource = 'Faculty';
        } else if (user?.isLCITStudent) {
            const disc = product.studentDiscount ?? 25;
            finalPrice = basePrice - (basePrice * disc / 100);
            discountSource = 'Student';
        }

        const referencePrice = mrp > basePrice ? mrp : (discountSource ? basePrice : mrp);
        const totalDiscountAmount = referencePrice - finalPrice;
        const totalDiscountPercent = referencePrice > 0 ? Math.round((totalDiscountAmount / referencePrice) * 100) : 0;

        return { finalPrice, referencePrice, totalDiscountPercent, discountSource };
    };

    const { finalPrice, referencePrice, totalDiscountPercent, discountSource } = getPricing();

    const handleAddToCart = () => {
        if (product?.stock > 0) {
            dispatch(addToCart({ ...product, price: finalPrice, quantity: Number(qty), originalPrice: referencePrice, regularPrice: product.price }));
            toast.success('Added to Cart');
        } else {
            toast.error('Out of Stock');
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;
    if (isError) return <div className="text-center py-20 text-red-600">Error: {message}</div>;
    if (!product) return null;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="container-custom flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-green-600">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-green-600">Shop</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Images */}
                    <div>
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden aspect-square relative mb-6">
                            <span className="absolute top-4 left-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">Lab Certified</span>
                            {/* Hot Deal Badge on Details Page */}
                            {totalDiscountPercent > 0 && (
                                <span className="absolute top-4 right-4 bg-green-600 text-white text-sm font-bold px-4 py-1.5 rounded-md shadow-sm z-10">
                                    Hot Deal
                                </span>
                            )}

                            {selectedImage ? (
                                <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        {product.images?.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(img?.url || img)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === (img?.url || img) ? 'border-green-600 ring-2 ring-green-100' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={img?.url || img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <span className="text-green-600 font-bold tracking-wide uppercase text-sm">LCIT Herbal Formulations</span>
                        <h1 className="text-4xl font-display font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                                {renderStars(averageRating)}
                            </div>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-600">{reviewCount} Verified Reviews</span>
                        </div>

                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-5xl font-bold text-green-600">₹{finalPrice.toFixed(0)}</span>
                            {totalDiscountPercent > 0 && (
                                <>
                                    <span className="text-2xl text-gray-400 line-through font-medium">
                                        ₹{referencePrice.toLocaleString('en-IN')}
                                    </span>
                                    <span className="flex items-center text-green-600 font-bold text-xl">
                                        <svg className="w-5 h-5 mr-1 fill-current" viewBox="0 0 24 24"><path d="M11 4V17.1716L7.41421 13.5858L6 15L12 21L18 15L16.5858 13.5858L13 17.1716V4H11Z" /></svg>
                                        {totalDiscountPercent}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {totalDiscountPercent > 0 && (
                            <div className="mb-6 text-gray-500 font-medium text-lg">
                                M.R.P.: <span className="line-through">₹{referencePrice.toLocaleString('en-IN')}</span>
                                <span className="ml-2 text-sm">(Inclusive of all taxes)</span>
                            </div>
                        )}

                        {/* Discount Banner for verified users */}
                        {discountSource && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl mb-8 border ${discountSource === 'Faculty' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                                <span className="text-2xl">{discountSource === 'Faculty' ? '👨‍🏫' : '🎓'}</span>
                                <div>
                                    <span className={`font-bold ${discountSource === 'Faculty' ? 'text-blue-700' : 'text-green-700'}`}>
                                        Extra Student/Faculty Benefit Applied!
                                    </span>
                                    <p className="text-sm text-gray-500">Verified {discountSource} pricing active.</p>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-b border-gray-200 py-6 mb-8">
                            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6">
                            {product.stock > 0 ? (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden w-max bg-white">
                                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-5 py-3 hover:bg-gray-50 transition-colors">-</button>
                                        <span className="px-5 font-bold text-gray-900 border-x border-gray-300">{qty}</span>
                                        <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-5 py-3 hover:bg-gray-50 transition-colors">+</button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 btn bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl font-bold text-center border border-red-100">
                                    Currently Out of Stock
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">🌿</div>
                                    <div className="text-sm">
                                        <span className="block font-bold text-gray-900">100% Natural</span>
                                        <span className="text-gray-500">Pure Ingredients</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">🛡️</div>
                                    <div className="text-sm">
                                        <span className="block font-bold text-gray-900">Lab Tested</span>
                                        <span className="text-gray-500">Quality Assured</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-20">
                    <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-8 py-4 font-bold text-lg transition-colors whitespace-nowrap ${activeTab === 'description' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Product Description
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-8 py-4 font-bold text-lg transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Student & Faculty Reviews ({productReviews?.length || 0})
                        </button>
                    </div>

                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                        {activeTab === 'description' ? (
                            <div className="prose max-w-none text-gray-600">
                                <p className="text-lg leading-relaxed">{product.description}</p>
                                <p className="mt-6">
                                    <em>This product was formulated and manufactured by the students of the Department of Chemistry, LCIT College of Commerce & Science, under strict faculty supervision.</em>
                                </p>
                            </div>
                        ) : (
                            <ProductReviews productId={id} reviews={productReviews} canReview={canReview} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
