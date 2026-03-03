import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import { validateCoupon, removeAppliedCoupon } from '../store/slices/couponSlice';
import { FiTrash2, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems } = useSelector((state) => state.cart);
    const { appliedCoupon, validateStatus } = useSelector((state) => state.coupons);
    const { user } = useSelector((state) => state.auth);

    const [couponCode, setCouponCode] = useState('');

    /* ===============================
       CALCULATIONS
    =============================== */
    const {
        totalMRP,
        totalPlatformDiscount,
        totalRoleDiscount,
        subtotal,
        totalItems,
        roleName
    } = useMemo(() => {
        let mrpTotal = 0;
        let pDiscount = 0;
        let rDiscount = 0;
        let sub = 0;
        let items = 0;
        let currentRole = null;

        if (user?.isLCITFaculty) currentRole = 'Faculty';
        else if (user?.isLCITStudent) currentRole = 'Student';

        cartItems.forEach(item => {
            const qty = item.quantity || 1;
            const singlePrice = Number(item.price) || 0;
            const singleRegular = Number(item.regularPrice) || singlePrice;
            const singleMrp = Number(item.originalPrice) || singleRegular;

            mrpTotal += singleMrp * qty;

            if (singleMrp > singleRegular) {
                pDiscount += (singleMrp - singleRegular) * qty;
            }

            if (singleRegular > singlePrice) {
                rDiscount += (singleRegular - singlePrice) * qty;
            }

            sub += singlePrice * qty;
            items += qty;
        });

        return {
            totalMRP: mrpTotal,
            totalPlatformDiscount: pDiscount,
            totalRoleDiscount: rDiscount,
            subtotal: sub,
            totalItems: items,
            roleName: currentRole
        };
    }, [cartItems, user]);

    const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount || 0 : 0;
    const subtotalAfterCoupon = Math.max(0, subtotal - couponDiscount);
    const shippingFee = subtotalAfterCoupon >= 100 ? 0 : 50;
    const finalTotal = subtotalAfterCoupon + shippingFee;
    const totalSavingsBreakdown = totalPlatformDiscount + totalRoleDiscount + couponDiscount;

    const handleQtyChange = (id, newQty) => {
        if (newQty < 1) return;
        dispatch(updateQuantity({ id, quantity: newQty }));
    };

    const handleRemove = (id) => {
        dispatch(removeFromCart(id));
    };

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return toast.error('Enter coupon code');
        dispatch(validateCoupon({ code: couponCode, orderAmount: subtotal }))
            .unwrap()
            .then(() => {
                toast.success('Coupon applied successfully! 🌿');
                setCouponCode('');
            })
            .catch(err => toast.error(err || 'Invalid or expired coupon'));
    };

    const handleRemoveCoupon = () => {
        dispatch(removeAppliedCoupon());
        toast.success('Coupon removed');
    };

    /* ===============================
       EMPTY STATE
    =============================== */
    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] bg-gradient-to-b from-stone-50 to-emerald-50/30 flex items-center justify-center px-6">
                <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-emerald-100 text-center max-w-md w-full">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl text-emerald-600">🌿</span>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
                        Your Cart is Empty
                    </h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Looks like you haven’t added any natural herbal remedies to your cart yet.
                    </p>
                    <Link
                        to="/shop"
                        className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-1"
                    >
                        Explore Products
                    </Link>
                </div>
            </div>
        );
    }

    /* ===============================
       MAIN UI
    =============================== */
    return (
        <div className="bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/20 min-h-screen py-14">
            <div className="container-custom max-w-6xl">

                <h1 className="text-4xl font-serif font-extrabold text-gray-900 mb-10 flex items-center gap-3">
                    Shopping Cart
                    <span className="text-emerald-600 text-2xl bg-emerald-50 px-3 py-1 rounded-xl">
                        {totalItems} Item{totalItems !== 1 && 's'}
                    </span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* CART ITEMS */}
                    <div className="lg:w-2/3 space-y-6">
                        {cartItems.map((item) => {
                            const price = Number(item.price) || 0;
                            const mrp = Number(item.originalPrice) || price;
                            const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

                            return (
                                <div
                                    key={item._id}
                                    className="bg-white p-5 rounded-[2rem] shadow-sm border border-emerald-100/50 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-all duration-300 group"
                                >
                                    {/* IMAGE */}
                                    <div className="w-32 h-32 bg-stone-50 rounded-3xl overflow-hidden shrink-0 relative">
                                        {discountPercent > 0 && (
                                            <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full z-10 hidden sm:block">
                                                {discountPercent}% OFF
                                            </span>
                                        )}
                                        <img
                                            src={item.images?.[0]?.url || item.images?.[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* DETAILS */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <Link
                                            to={`/product/${item._id}`}
                                            className="font-bold text-lg text-gray-900 hover:text-emerald-600 transition-colors line-clamp-1 mb-1"
                                        >
                                            {item.name}
                                        </Link>

                                        {/* PRICE */}
                                        <div className="flex items-end gap-3 mb-4">
                                            <span className="text-2xl font-extrabold text-emerald-700 leading-none">
                                                ₹{price.toLocaleString('en-IN')}
                                            </span>
                                            {mrp > price && (
                                                <span className="text-gray-400 line-through text-sm font-medium leading-none mb-0.5">
                                                    ₹{mrp.toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </div>

                                        {/* QTY CONTROLS */}
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-full overflow-hidden shadow-sm">
                                                <button
                                                    onClick={() => handleQtyChange(item._id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="w-10 text-center font-bold text-gray-900 border-x border-stone-200">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQtyChange(item._id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item._id)}
                                                className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                                title="Remove Item"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* SUMMARY CARD */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-100 sticky top-24">

                            <h2 className="text-xl font-bold text-gray-900 mb-6 font-serif">
                                Order Summary
                            </h2>

                            {/* COUPON SECTION */}
                            <div className="mb-6">
                                {!appliedCoupon ? (
                                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                        <div className="relative flex-1">
                                            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="Coupon Code"
                                                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-medium uppercase tracking-wide"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={validateStatus === 'loading'}
                                            className="bg-gray-900 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-70"
                                        >
                                            Apply
                                        </button>
                                    </form>
                                ) : (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex justify-between items-center relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                        <div>
                                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">Coupon Applied</p>
                                            <p className="text-lg font-black text-emerald-700">{appliedCoupon.code}</p>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-md hover:bg-rose-500 hover:text-white transition-colors z-10"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* BREAKDOWN */}
                            <div className="space-y-4 mb-6 text-sm font-medium">
                                <div className="flex justify-between text-gray-500">
                                    <span>Total MRP</span>
                                    <span>₹{totalMRP.toLocaleString('en-IN')}</span>
                                </div>

                                {totalPlatformDiscount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Discount on MRP</span>
                                        <span>- ₹{totalPlatformDiscount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                {totalRoleDiscount > 0 && roleName && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span className="flex items-center gap-1">
                                            {roleName} Discount
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" title={`${roleName} Verified`} />
                                        </span>
                                        <span>- ₹{totalRoleDiscount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Coupon Savings ({appliedCoupon.code})</span>
                                        <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping Fee</span>
                                    {shippingFee === 0 ? (
                                        <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs self-end mb-0.5">Free</span>
                                    ) : (
                                        <span>+ ₹{shippingFee.toLocaleString('en-IN')}</span>
                                    )}
                                </div>

                                <div className="border-t border-gray-100/80 pt-4 flex justify-between items-end">
                                    <div>
                                        <span className="block text-gray-900 font-bold text-lg leading-none mb-1">Total Amount</span>
                                        {totalSavingsBreakdown > 0 && (
                                            <span className="text-xs text-emerald-600 font-bold tracking-wide">
                                                You save ₹{totalSavingsBreakdown.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-3xl font-black text-emerald-700 leading-none">
                                        ₹{finalTotal.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            {/* FREE SHIPPING NOTICE */}
                            <div className="bg-stone-50 border border-stone-200/50 text-gray-700 text-xs font-semibold px-4 py-3 rounded-xl mb-6 flex items-center justify-center gap-2">
                                <span className="text-emerald-600 text-lg">🚚</span>
                                {shippingFee > 0 ? (
                                    <>Add ₹{(100 - subtotalAfterCoupon).toLocaleString('en-IN')} more to unlock <strong>Free Shipping!</strong></>
                                ) : (
                                    <>You have unlocked <strong>Free Shipping!</strong> 🎉</>
                                )}
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold shadow-[0_4px_14px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-0.5 mt-2"
                            >
                                Proceed to Secure Checkout
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;