import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, reset } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { validateCoupon, removeAppliedCoupon } from '../store/slices/couponSlice';
import toast from 'react-hot-toast';
import axios from 'axios';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems } = useSelector((state) => state.cart);
    const { isError, message } = useSelector((state) => state.orders);
    const { user, token } = useSelector((state) => state.auth);
    const { appliedCoupon: coupon, isLoading: isCouponLoading } =
        useSelector((state) => state.coupons);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [couponCode, setCouponCode] = useState('');

    const [shippingAddress, setShippingAddress] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
        country: user?.address?.country || 'India',
    });

    /* ===============================
       CALCULATIONS
    =============================== */
    const {
        totalMRP,
        totalPlatformDiscount,
        totalRoleDiscount,
        subtotal,
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

    const discountAmount = coupon?.discountAmount || 0;
    const subtotalAfterCoupon = Math.max(0, subtotal - discountAmount);
    const shippingFee = subtotalAfterCoupon >= 100 ? 0 : 50;
    const finalTotal = subtotalAfterCoupon + shippingFee;
    const totalSavingsBreakdown = totalPlatformDiscount + totalRoleDiscount + discountAmount;

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
    }, [isError, message, dispatch]);

    const handleChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return toast.error('Enter coupon code');
        dispatch(validateCoupon({ code: couponCode, orderAmount: subtotal }))
            .unwrap()
            .then(() => {
                toast.success('Coupon applied 🌿');
                setCouponCode('');
            })
            .catch(err => toast.error(err || 'Invalid coupon'));
    };

    const handleRemoveCoupon = () => {
        dispatch(removeAppliedCoupon());
        toast.success('Coupon removed');
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return toast.error('Cart is empty');

        const orderData = {
            orderItems: cartItems.map(item => ({
                product: item._id,
                name: item.name,
                image: item.images?.[0]?.url || item.images?.[0] || '',
                price: item.price,
                quantity: item.quantity,
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice: subtotal,
            taxPrice: 0,
            shippingPrice: shippingFee,
            discountPrice: discountAmount,
            totalPrice: finalTotal,
            coupon: coupon ? coupon.code : null,
        };

        if (paymentMethod === 'Razorpay') {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                return;
            }

            try {
                // 1. Create order in our DB (unpaid)
                const dbOrderResult = await dispatch(createOrder(orderData)).unwrap();
                const dbOrder = dbOrderResult.data;

                // 2. Fetch Razorpay key
                const API_URL = process.env.REACT_APP_API_URL || '/api';
                const { data: { key } } = await axios.get(`${API_URL}/payment/getkey`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // 3. Create Razorpay order
                const { data: { order: rzpOrder } } = await axios.post(
                    `${API_URL}/payment/checkout`,
                    { amount: finalTotal },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // 4. Open Razorpay modal
                const options = {
                    key,
                    amount: rzpOrder.amount,
                    currency: rzpOrder.currency,
                    name: 'LCIT Herbal Store',
                    description: 'Checkout Payment',
                    order_id: rzpOrder.id,
                    handler: async function (response) {
                        try {
                            // 5. Verify payment
                            await axios.post(
                                `${API_URL}/payment/verification`,
                                {
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature,
                                    order_id: dbOrder._id
                                },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            toast.success('Payment successful! 🌿');
                            dispatch(clearCart());
                            navigate(`/thank-you?orderId=${dbOrder._id}&success=true`);
                        } catch (err) {
                            toast.error('Payment verification failed');
                            navigate(`/orders`);
                        }
                    },
                    prefill: {
                        name: user?.name || '',
                        email: user?.email || '',
                        ...(shippingAddress.phone || user?.phone ? { contact: shippingAddress.phone || user?.phone } : {})
                    },
                    theme: {
                        color: '#059669' // emerald-600
                    },
                    modal: {
                        ondismiss: function () {
                            toast.error('Payment window closed. You can pay later from Orders.');
                            dispatch(clearCart());
                            navigate(`/orders`);
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();

            } catch (err) {
                console.error(err);
                toast.error(err?.response?.data?.message || err?.message || 'Error initializing payment');
            }
        } else {
            // COD Logic
            const result = await dispatch(createOrder(orderData));

            if (createOrder.fulfilled.match(result)) {
                const newOrder = result.payload.data;
                toast.success('Order placed successfully 🌿');
                dispatch(clearCart());
                navigate(`/thank-you?orderId=${newOrder._id}`);
            }
        }
    };

    /* ===============================
       UI
    =============================== */
    return (
        <div className="bg-gradient-to-b from-stone-50 to-emerald-50/30 min-h-screen py-14">
            <div className="container-custom">

                <div className="flex items-center gap-3 mb-10">
                    <span className="text-3xl">🔒</span>
                    <h1 className="text-4xl font-serif font-bold">
                        Secure Herbal Checkout
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                >

                    {/* LEFT SIDE */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Shipping */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100">
                            <h2 className="text-2xl font-bold mb-6">
                                Shipping Details
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {['name', 'phone', 'street', 'city', 'state', 'pincode'].map(field => (
                                    <input
                                        key={field}
                                        type="text"
                                        name={field}
                                        value={shippingAddress[field]}
                                        onChange={handleChange}
                                        required
                                        placeholder={field.toUpperCase()}
                                        className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100">
                            <h2 className="text-2xl font-bold mb-6">
                                Payment Method
                            </h2>

                            <div className="flex gap-6">
                                {['COD', 'Razorpay'].map(method => (
                                    <label
                                        key={method}
                                        className={`flex items-center gap-3 px-6 py-3 border rounded-2xl cursor-pointer transition ${paymentMethod === method
                                            ? 'border-emerald-600 bg-emerald-50'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            value={method}
                                            checked={paymentMethod === method}
                                            onChange={() => setPaymentMethod(method)}
                                        />
                                        {method}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SUMMARY */}
                    <div>
                        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-emerald-100 sticky top-24">

                            <h2 className="text-xl font-bold mb-6">
                                Order Summary
                            </h2>

                            {/* Coupon */}
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        className="bg-emerald-700 text-white px-5 py-2 rounded-2xl font-semibold"
                                    >
                                        Apply
                                    </button>
                                </div>

                                {coupon && (
                                    <div className="mt-3 text-sm flex justify-between items-center bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl">
                                        <span>
                                            Code <b>{coupon.code}</b> applied
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
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

                                {coupon && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Coupon Savings ({coupon.code})</span>
                                        <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
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

                            <button
                                type="submit"
                                disabled={isCouponLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition"
                            >
                                {paymentMethod === 'Razorpay'
                                    ? `Pay ₹${finalTotal.toLocaleString('en-IN')}`
                                    : 'Place Order'}
                            </button>

                            <div className="text-xs text-gray-500 mt-4 text-center">
                                🔐 100% Secure & Encrypted Payment
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;