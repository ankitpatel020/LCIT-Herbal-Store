import React, { useState, useEffect } from 'react';
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

    const { cartItems, totalPrice } = useSelector((state) => state.cart);
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

    const discountAmount = coupon?.discountAmount || 0;
    const finalTotal = Math.max(0, totalPrice - discountAmount);

    useEffect(() => {
        if (user) {
            setShippingAddress(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || '',
                street: user.address?.street || prev.street,
                city: user.address?.city || prev.city,
                state: user.address?.state || prev.state,
                pincode: user.address?.pincode || prev.pincode,
                country: user.address?.country || 'India',
            }));
        }
    }, [user]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
    }, [isError, message, dispatch]);

    const handleChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return toast.error('Please enter a coupon code');
        if (cartItems.length === 0) return toast.error('Your cart is empty');
        dispatch(validateCoupon({ code: couponCode, orderAmount: totalPrice }))
            .unwrap()
            .then(() => { toast.success('Coupon applied!'); setCouponCode(''); })
            .catch((err) => { toast.error(err || 'Failed to apply coupon'); setCouponCode(''); });
    };

    const handleRemoveCoupon = () => {
        dispatch(removeAppliedCoupon());
        setCouponCode('');
        toast.success('Coupon removed');
    };

    const handleOnlinePayment = async (orderData) => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const { data: { key } } = await axios.get(`${API_URL}/payment/getkey`, { headers: { Authorization: `Bearer ${token}` } });

            // Note: Use finalTotal for payment if applicable, but backend usually calculates it.
            // Using orderData.totalPrice calculated on frontend to initiate

            const { data: { order } } = await axios.post(`${API_URL}/payment/checkout`, { amount: orderData.totalPrice }, { headers: { Authorization: `Bearer ${token}` } });

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
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: orderData._id
                        };
                        const { data } = await axios.post(`${API_URL}/payment/verification`, verifyData, { headers: { Authorization: `Bearer ${token}` } });
                        if (data.success) {
                            toast.success('Payment Successful');
                            dispatch(clearCart());
                            dispatch(reset());
                            navigate(`/order/${orderData._id}?success=true`);
                        } else {
                            toast.error('Payment Verification Failed');
                        }
                    } catch {
                        toast.error('Payment Verification Error');
                        navigate(`/order/${orderData._id}`);
                    }
                },
                prefill: { name: user.name, email: user.email, contact: shippingAddress.phone },
                theme: { color: "#16a34a" }
            };
            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            toast.error('Online payment initialization failed.');
            navigate(`/order/${orderData._id}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return toast.error('Your cart is empty');

        const orderData = {
            orderItems: cartItems.map((item) => ({
                product: item._id,
                name: item.name,
                image: item.images?.[0]?.url || '',
                price: item.price,
                quantity: item.quantity,
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice: totalPrice,
            taxPrice: 0,
            shippingPrice: 0,
            discountPrice: discountAmount,
            totalPrice: finalTotal,
            coupon: coupon ? coupon.code : null,
        };

        try {
            const resultAction = await dispatch(createOrder(orderData));
            if (createOrder.fulfilled.match(resultAction)) {
                const newOrder = resultAction.payload.data;
                if (paymentMethod === 'Razorpay') {
                    await handleOnlinePayment(newOrder);
                } else {
                    toast.success('Order placed successfully!');
                    dispatch(clearCart());
                    dispatch(reset());
                    navigate(`/order/${newOrder._id}?success=true`);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container-custom">
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Secure Checkout</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Shipping & Payment */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Shipping Address Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Shipping Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" name="name" value={shippingAddress.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <input type="text" name="phone" value={shippingAddress.phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="+91 9999999999" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Address (Street, Area)</label>
                                    <input type="text" name="street" value={shippingAddress.street} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Flat No, Building, Street" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">City</label>
                                    <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Bilaspur" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">State</label>
                                    <input type="text" name="state" value={shippingAddress.state} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Chhattisgarh" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                                    <input type="text" name="pincode" value={shippingAddress.pincode} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="495001" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${paymentMethod === 'COD' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-green-300'}`}>
                                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-green-600 focus:ring-green-500" />
                                    <div>
                                        <span className="block font-bold text-gray-900">Cash on Delivery</span>
                                        <span className="text-sm text-gray-500">Pay when you receive</span>
                                    </div>
                                </label>
                                <label className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${paymentMethod === 'Razorpay' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-green-300'}`}>
                                    <input type="radio" name="payment" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-green-600 focus:ring-green-500" />
                                    <div>
                                        <span className="block font-bold text-gray-900">Online Payment</span>
                                        <span className="text-sm text-gray-500">UPI, Cards, Netbanking</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-3 text-sm">
                                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <img src={item.images?.[0]?.url || item.images?.[0]} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                            <p className="text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Input */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-500 uppercase">Discount Code</label>
                                <div className="flex gap-2 mt-1">
                                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="ENTER CODE" className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" />
                                    <button type="button" onClick={handleApplyCoupon} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800">Apply</button>
                                </div>
                                {coupon && (
                                    <div className="mt-2 text-xs flex justify-between items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                        <span>Code <b>{coupon.code}</b> applied</span>
                                        <button type="button" onClick={handleRemoveCoupon} className="text-red-500 hover:underline">Remove</button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                {coupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3 mt-2">
                                    <span>Total</span>
                                    <span className="text-green-700">₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button type="submit" disabled={isCouponLoading} className="w-full mt-6 btn bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1">
                                {paymentMethod === 'Razorpay' ? `Pay ₹${finalTotal.toFixed(2)}` : `Place Order`}
                            </button>

                            <p className="text-[10px] text-gray-400 text-center mt-4">
                                By placing this order, you agree to the Department of Science Terms of Service.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
