import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById, cancelOrder, reset } from '../store/slices/orderSlice';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { order, isLoading, isError, message } = useSelector((state) => state.orders);
    const [showSuccess, setShowSuccess] = React.useState(false);

    useEffect(() => {
        dispatch(getOrderById(id));
        return () => { dispatch(reset()); };
    }, [dispatch, id]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success')) {
            setShowSuccess(true);
            window.history.replaceState({}, '', `/order/${id}`);
        }
    }, [id]);

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            const reason = window.prompt('Please provide a reason:', 'Changed my mind');
            if (reason) {
                dispatch(cancelOrder({ id: order._id, reason }))
                    .unwrap()
                    .then(() => {
                        toast.success('Order cancelled successfully');
                        dispatch(getOrderById(id));
                    })
                    .catch((err) => toast.error(err || 'Failed to cancel order'));
            }
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

    if (isError) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <div className="text-red-500 text-xl font-bold mb-4">{message}</div>
            <Link to="/orders" className="text-green-600 hover:underline">Back to Orders</Link>
        </div>
    );

    if (!order) return null;

    const steps = ['Processing', 'Shipped', 'Delivered'];
    const currentStep = steps.indexOf(order.orderStatus) !== -1 ? steps.indexOf(order.orderStatus) : 0;
    const isCancelled = order.orderStatus === 'Cancelled';

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container-custom max-w-4xl">

                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-8 bg-green-50 border border-green-200 rounded-3xl p-8 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-3xl font-bold text-green-800 mb-2">Order Confirmed!</h2>
                            <p className="text-green-700">Thank you for supporting the Department of Science.</p>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-100 rounded-full opacity-50 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-green-100 rounded-full opacity-50 blur-3xl"></div>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link to="/orders" className="text-gray-400 hover:text-green-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </Link>
                            <span className="text-sm font-bold text-green-600 uppercase tracking-wider">Order Details</span>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h1>
                        <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <div className="flex gap-3">
                        {order.isDelivered && (
                            <Link to={`/order/${order._id}/invoice`} target="_blank" className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Download Invoice
                            </Link>
                        )}
                        {(!isCancelled && (order.orderStatus === 'Pending' || order.orderStatus === 'Processing')) && (
                            <button onClick={handleCancel} className="btn bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 px-4 py-2 rounded-lg text-sm font-medium">
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Status Bar */}
                    <div className="bg-gray-50 p-8 border-b border-gray-100">
                        {isCancelled ? (
                            <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center font-bold">
                                This order has been cancelled.
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
                                <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-1000" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
                                <div className="relative flex justify-between">
                                    {steps.map((step, index) => (
                                        <div key={step} className="flex flex-col items-center gap-2 bg-gray-50 px-2 z-10">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${index <= currentStep ? 'bg-green-600 text-white ring-4 ring-green-100' : 'bg-gray-200 text-gray-500'}`}>
                                                {index + 1}
                                            </div>
                                            <span className={`text-xs font-bold uppercase transition-colors ${index <= currentStep ? 'text-green-700' : 'text-gray-400'}`}>{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Items */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Items Ordered</h3>
                            <div className="space-y-4">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <Link to={`/product/${item.product?._id || item.product}`} className="font-bold text-gray-900 hover:text-green-600 line-clamp-1">{item.name}</Link>
                                            <div className="flex justify-between mt-1 text-sm">
                                                <span className="text-gray-500">{item.quantity} x ₹{item.price}</span>
                                                <span className="font-bold text-gray-900">₹{(item.quantity * item.price).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary Side */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Delivery Address</h3>
                                <div className="text-sm text-gray-600 leading-relaxed">
                                    <p className="font-bold text-gray-900 text-base">{order.shippingAddress?.name}</p>
                                    <p>{order.shippingAddress?.street}</p>
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                                    <p className="mt-2 text-gray-500">Phone: <span className="text-gray-900">{order.shippingAddress?.phone}</span></p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Payment Info</h3>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Method</span>
                                    <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-3">
                                    <span className="text-gray-600">Status</span>
                                    {order.isPaid ? (
                                        <span className="text-green-700 bg-green-100 px-3 py-1 rounded font-bold">PAID</span>
                                    ) : (
                                        <span className="text-orange-700 bg-orange-100 px-3 py-1 rounded font-bold">PENDING</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl">
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{(order.itemsPrice || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>₹0.00</span>
                                    </div>
                                    <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-lg text-gray-900">
                                        <span>Total</span>
                                        <span className="text-green-700">₹{Number(order.totalPrice).toFixed(2)}</span>
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
