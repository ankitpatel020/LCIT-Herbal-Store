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
    const { appliedCoupon: coupon, isLoading: isCouponLoading } = useSelector((state) => state.coupons);

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
    const { subtotal, totalSavings } = useMemo(() => {
        let sub = 0;
        let savings = 0;

        cartItems.forEach(item => {
            const price = Number(item.price) || 0;
            const mrp = Number(item.originalPrice) || price;

            sub += price * item.quantity;

            if (mrp > price) {
                savings += (mrp - price) * item.quantity;
            }
        });

        return { subtotal: sub, totalSavings: savings };
    }, [cartItems]);

    const discountAmount = coupon?.discountAmount || 0;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    /* ===============================
       EFFECTS
    =============================== */
    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
    }, [isError, message, dispatch]);

    /* ===============================
       HANDLERS
    =============================== */
    const handleChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return toast.error('Enter coupon code');
        dispatch(validateCoupon({ code: couponCode, orderAmount: subtotal }))
            .unwrap()
            .then(() => {
                toast.success('Coupon applied!');
                setCouponCode('');
            })
            .catch(err => toast.error(err || 'Invalid coupon'));
    };

    const handleRemoveCoupon = () => {
        dispatch(removeAppliedCoupon());
        toast.success('Coupon removed');
    };

    const handleOnlinePayment = async (orderData) => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || '/api';

            const { data: { key } } = await axios.get(`${API_URL}/payment/getkey`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { data: { order } } = await axios.post(
                `${API_URL}/payment/checkout`,
                { amount: orderData.totalPrice },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "LCIT Herbal Store",
                description: "Order Payment",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            ...response,
                            order_id: orderData._id
                        };

                        const { data } = await axios.post(
                            `${API_URL}/payment/verification`,
                            verifyData,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (data.success) {
                            toast.success('Payment Successful');
                            dispatch(clearCart());
                            navigate(`/order/${orderData._id}?success=true`);
                        } else {
                            toast.error('Payment Verification Failed');
                        }
                    } catch {
                        toast.error('Payment Verification Error');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: shippingAddress.phone,
                },
                theme: { color: "#16a34a" }
            };

            new window.Razorpay(options).open();

        } catch (error) {
            toast.error('Payment initialization failed');
        }
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
            shippingPrice: 0,
            discountPrice: discountAmount,
            totalPrice: finalTotal,
            coupon: coupon ? coupon.code : null,
        };

        const result = await dispatch(createOrder(orderData));

        if (createOrder.fulfilled.match(result)) {
            const newOrder = result.payload.data;

            if (paymentMethod === 'Razorpay') {
                await handleOnlinePayment(newOrder);
            } else {
                toast.success('Order placed successfully!');
                dispatch(clearCart());
                navigate(`/order/${newOrder._id}?success=true`);
            }
        }
    };

    /* ===============================
       UI
    =============================== */
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8">Secure Checkout</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-8">

                        <div className="bg-white p-8 rounded-2xl shadow border">
                            <h2 className="text-xl font-bold mb-6">Shipping Details</h2>

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
                                        className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow border">
                            <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                            <div className="flex gap-6">
                                {['COD', 'Razorpay'].map(method => (
                                    <label key={method} className="flex items-center gap-2 cursor-pointer">
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
                        <div className="bg-white p-6 rounded-2xl shadow-lg border sticky top-24">

                            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                            {/* Coupon Input */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-500 uppercase">Discount Code</label>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="ENTER CODE"
                                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {coupon && (
                                    <div className="mt-2 text-xs flex justify-between items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                        <span>Code <b>{coupon.code}</b> applied</span>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>

                                {totalSavings > 0 && (
                                    <div className="flex justify-between text-green-600 font-semibold">
                                        <span>You Saved</span>
                                        <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                {coupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}

                                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-green-700">
                                        ₹{finalTotal.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isCouponLoading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
                            >
                                {paymentMethod === 'Razorpay'
                                    ? `Pay ₹${finalTotal.toLocaleString('en-IN')}`
                                    : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
