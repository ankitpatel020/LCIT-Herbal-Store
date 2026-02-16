import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders, reset } from '../store/slices/orderSlice';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading, isError, message } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getMyOrders());
        return () => { dispatch(reset()); };
    }, [dispatch]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div></div>;

    if (orders && orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg">
                    <div className="w-24 h-24 bg-green-50 text-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Past Orders</h2>
                    <p className="text-gray-500 mb-8">
                        Start your journey with LCIT Herbal Store today.
                    </p>
                    <Link to="/shop" className="btn bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container-custom">
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">My Orders</h1>
                <p className="text-gray-500 mb-8">Track and manage your recent purchases.</p>

                <div className="space-y-6">
                    {orders && orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex gap-8 text-sm text-gray-600">
                                    <div>
                                        <span className="block text-gray-400 text-xs uppercase font-bold">Order Placed</span>
                                        <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-400 text-xs uppercase font-bold">Total</span>
                                        <span className="font-medium text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="hidden sm:block">
                                        <span className="block text-gray-400 text-xs uppercase font-bold">Order ID</span>
                                        <span className="font-mono text-gray-900">#{order._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                </div>
                                <Link to={`/order/${order._id}`} className="text-green-600 font-bold text-sm hover:underline">
                                    View Invoice & Details
                                </Link>
                            </div>

                            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex-1 space-y-3">
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <Link to={`/product/${item.product?._id || item.product}`} className="font-bold text-gray-900 hover:text-green-600 line-clamp-1">
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-right flex flex-col items-end gap-2">
                                    <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide
                                        ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'}`}>
                                        {order.orderStatus || 'Processing'}
                                    </div>
                                    {order.isDelivered && (
                                        <p className="text-xs text-gray-500">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;
