import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getOrderById,
    cancelOrder,
    reset,
    updatePaymentStatus,
    updateOrderStatus
} from '../store/slices/orderSlice';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { order, isLoading, isError, message } = useSelector((state) => state.orders);
    const { user } = useSelector((state) => state.auth);

    const [showSuccess, setShowSuccess] = React.useState(false);
    const [isEditPaymentOpen, setIsEditPaymentOpen] = React.useState(false);
    const [isEditStatusOpen, setIsEditStatusOpen] = React.useState(false);

    const [editPaymentData, setEditPaymentData] = React.useState({
        isPaid: false,
        paymentMethod: 'COD',
        paymentId: '',
        paymentStatus: ''
    });

    const [statusData, setStatusData] = React.useState({
        status: '',
        trackingNumber: '',
        comment: ''
    });

    useEffect(() => {
        dispatch(getOrderById(id));
        return () => dispatch(reset());
    }, [dispatch, id]);

    useEffect(() => {
        if (order) {
            setEditPaymentData({
                isPaid: order.isPaid || false,
                paymentMethod: order.paymentMethod || 'COD',
                paymentId: order.paymentInfo?.id || '',
                paymentStatus: order.paymentInfo?.status || ''
            });

            setStatusData({
                status: order.orderStatus,
                trackingNumber: order.trackingNumber || '',
                comment: ''
            });
        }
    }, [order]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success')) {
            setShowSuccess(true);
            window.history.replaceState({}, '', `/order/${id}`);
        }
    }, [id]);

    const isAdminOrAgent =
        user && (user.role === 'admin' || user.role === 'agent');

    const handleCancel = async () => {
        if (window.confirm('Cancel this order?')) {
            const reason = window.prompt('Reason for cancellation:', 'Changed my mind');
            if (reason) {
                dispatch(cancelOrder({ id: order._id, reason }))
                    .unwrap()
                    .then(() => {
                        toast.success('Order cancelled');
                        dispatch(getOrderById(id));
                    })
                    .catch(err => toast.error(err || 'Failed to cancel'));
            }
        }
    };

    const handleUpdatePayment = () => {
        dispatch(updatePaymentStatus({ id: order._id, paymentData: editPaymentData }))
            .unwrap()
            .then(() => {
                toast.success('Payment updated');
                setIsEditPaymentOpen(false);
                dispatch(getOrderById(id));
            })
            .catch(err => toast.error(err || 'Failed to update payment'));
    };

    const handleUpdateStatus = () => {
        dispatch(updateOrderStatus({ id: order._id, ...statusData }))
            .unwrap()
            .then(() => {
                toast.success('Order status updated');
                setIsEditStatusOpen(false);
                dispatch(getOrderById(id));
            })
            .catch(err => toast.error(err || 'Failed to update status'));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 to-emerald-50/30">
                <div className="animate-spin h-14 w-14 border-t-2 border-b-2 border-emerald-600 rounded-full"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
                <p className="text-red-600 text-lg font-semibold mb-4">{message}</p>
                <Link to="/orders" className="text-emerald-600 hover:underline">
                    Back to Orders
                </Link>
            </div>
        );
    }

    if (!order) return null;

    const steps = ['Processing', 'Shipped', 'Delivered'];
    const currentStep = steps.indexOf(order.orderStatus);
    const isCancelled = order.orderStatus === 'Cancelled';

    return (
        <div className="bg-gradient-to-b from-stone-50 via-stone-50 to-emerald-50/30 min-h-screen py-14">
            <div className="container-custom max-w-5xl">

                {/* SUCCESS MESSAGE */}
                {showSuccess && (
                    <div className="mb-10 bg-emerald-50 border border-emerald-200 rounded-3xl p-10 text-center shadow-lg">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                            ✓
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-emerald-800 mb-3">
                            Order Confirmed
                        </h2>
                        <p className="text-emerald-700 text-lg">
                            Your herbal formulation is being prepared with care.
                        </p>
                    </div>
                )}

                {/* HEADER */}
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <Link to="/orders" className="text-sm text-gray-500 hover:text-emerald-600">
                            ← Back
                        </Link>
                        <h1 className="text-4xl font-serif font-bold mt-2">
                            Order #{order._id.slice(-6).toUpperCase()}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        {order.orderStatus === 'Delivered' && (
                            <Link
                                to={`/order/${order._id}/invoice`}
                                target="_blank"
                                className="bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 px-5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <span>Download Invoice</span>
                            </Link>
                        )}

                        {!isCancelled && order.orderStatus !== 'Delivered' && (
                            <button
                                onClick={handleCancel}
                                className="bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                {/* MAIN CARD */}
                <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">

                    {/* STATUS TRACKER */}
                    <div className="bg-emerald-50/40 p-10 border-b border-emerald-100">
                        {isCancelled ? (
                            <div className="bg-red-100 text-red-700 p-4 rounded-xl text-center font-semibold">
                                This order has been cancelled.
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 -translate-y-1/2 rounded-full"></div>
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 rounded-full transition-all"
                                    style={{
                                        width:
                                            currentStep >= 0
                                                ? `${(currentStep / (steps.length - 1)) * 100}%`
                                                : '0%'
                                    }}
                                ></div>

                                <div className="relative flex justify-between">
                                    {steps.map((step, index) => (
                                        <div key={step} className="flex flex-col items-center z-10">
                                            <div
                                                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${index <= currentStep
                                                    ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 shadow-md'
                                                    : 'bg-stone-200 text-stone-500'
                                                    }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <span
                                                className={`text-xs mt-2 font-semibold ${index <= currentStep
                                                    ? 'text-emerald-700'
                                                    : 'text-gray-400'
                                                    }`}
                                            >
                                                {step}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CONTENT */}
                    <div className="grid md:grid-cols-2 gap-10 p-10">

                        {/* ITEMS */}
                        <div>
                            <h3 className="text-lg font-bold mb-6">Items Ordered</h3>

                            <div className="space-y-6">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100">
                                            <img
                                                src={item.image}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <Link
                                                to={`/product/${item.product?._id || item.product}`}
                                                className="font-semibold hover:text-emerald-600 transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.quantity} × ₹{item.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SUMMARY */}
                        <div className="space-y-8">

                            {/* ADDRESS */}
                            <div>
                                <h3 className="font-bold mb-3">Delivery Address</h3>
                                <div className="text-sm text-gray-600 leading-relaxed">
                                    <p className="font-semibold text-gray-900">
                                        {order.shippingAddress?.name}
                                    </p>
                                    <p>{order.shippingAddress?.street}</p>
                                    <p>
                                        {order.shippingAddress?.city},{' '}
                                        {order.shippingAddress?.state} -{' '}
                                        {order.shippingAddress?.pincode}
                                    </p>
                                </div>
                            </div>

                            {/* PAYMENT */}
                            <div>
                                <h3 className="font-bold mb-3">Payment</h3>

                                <div className="flex justify-between text-sm mb-3">
                                    <span>Method</span>
                                    <span className="bg-stone-100 px-3 py-1 rounded-full font-semibold">
                                        {order.paymentMethod}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm items-center">
                                    <span>Status</span>
                                    <div className="flex items-center gap-2">
                                        {order.isPaid ? (
                                            <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
                                                PAID
                                            </span>
                                        ) : (
                                            <span className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
                                                PENDING
                                            </span>
                                        )}
                                        {isAdminOrAgent && order.orderStatus !== 'Cancelled' && (
                                            <button
                                                onClick={() => setIsEditPaymentOpen(prev => !prev)}
                                                className="text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                                            >
                                                ✏️ Edit
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Inline Payment Edit Form */}
                                {isEditPaymentOpen && isAdminOrAgent && (
                                    <div className="mt-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Update Payment</p>

                                        <div className="flex items-center justify-between text-sm">
                                            <label className="font-semibold text-gray-700">Mark as Paid</label>
                                            <button
                                                onClick={() => setEditPaymentData(prev => ({ ...prev, isPaid: !prev.isPaid }))}
                                                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${editPaymentData.isPaid ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                            >
                                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${editPaymentData.isPaid ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>

                                        <div className="text-sm">
                                            <label className="font-semibold text-gray-700 block mb-1">Payment Method</label>
                                            <select
                                                value={editPaymentData.paymentMethod}
                                                onChange={e => setEditPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                                className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-sm outline-none focus:ring-2 focus:ring-emerald-100"
                                            >
                                                <option value="COD">COD</option>
                                                <option value="UPI">UPI</option>
                                                <option value="Card">Card</option>
                                                <option value="NetBanking">Net Banking</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={handleUpdatePayment}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => setIsEditPaymentOpen(false)}
                                                className="flex-1 bg-stone-100 hover:bg-stone-200 text-gray-700 text-xs font-bold py-2 rounded-xl transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TOTAL */}
                            <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-100">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{order.itemsPrice}</span>
                                    </div>

                                    <div className="flex justify-between font-bold text-lg border-t pt-3">
                                        <span>Total</span>
                                        <span className="text-emerald-700 text-xl">
                                            ₹{order.totalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;