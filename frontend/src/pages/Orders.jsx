import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders, reset } from '../store/slices/orderSlice';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getMyOrders());
        return () => { dispatch(reset()); };
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 to-emerald-50/30">
                <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (orders && orders.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-stone-50 to-emerald-50/30 flex flex-col items-center justify-center py-24 px-6">
                <div className="bg-white p-14 rounded-3xl shadow-xl border border-emerald-100 text-center max-w-lg">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-8">
                        📦
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
                        No Orders Yet
                    </h2>
                    <p className="text-gray-600 mb-10">
                        Your herbal journey hasn’t started yet. Explore lab-crafted remedies today.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-10 py-4 rounded-2xl font-semibold shadow-lg shadow-emerald-200 transition"
                    >
                        🌿 Explore Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-stone-50 to-emerald-50/30 min-h-screen py-14">
            <div className="container-custom">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                        My Orders
                    </h1>
                    <p className="text-gray-600">
                        Track your purchases and review your herbal formulations.
                    </p>
                </div>

                <div className="space-y-8">
                    {orders && orders.map((order) => {

                        const statusStyles =
                            order.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-700'
                                : order.orderStatus === 'Cancelled'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700';

                        return (
                            <div
                                key={order._id}
                                className="bg-white rounded-3xl shadow-lg border border-emerald-100 overflow-hidden hover:shadow-xl transition"
                            >

                                {/* Top Bar */}
                                <div className="bg-emerald-50/40 px-8 py-6 border-b border-emerald-100 flex flex-col md:flex-row justify-between gap-6">

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">

                                        <div>
                                            <span className="block text-xs uppercase text-gray-500 font-semibold tracking-wide">
                                                Order Date
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="block text-xs uppercase text-gray-500 font-semibold tracking-wide">
                                                Total Paid
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                ₹{order.totalPrice.toLocaleString('en-IN')}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="block text-xs uppercase text-gray-500 font-semibold tracking-wide">
                                                Order ID
                                            </span>
                                            <span className="font-mono text-gray-900">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/order/${order._id}`}
                                        className="text-emerald-700 font-semibold hover:underline self-start md:self-center"
                                    >
                                        View Details →
                                    </Link>
                                </div>

                                {/* Items */}
                                <div className="p-8 flex flex-col lg:flex-row gap-10 justify-between">

                                    <div className="flex-1 space-y-5">
                                        {order.orderItems.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-5">

                                                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <div>
                                                    <Link
                                                        to={`/product/${item.product?._id || item.product}`}
                                                        className="font-semibold text-gray-900 hover:text-emerald-600 line-clamp-1"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-500">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Status */}
                                    <div className="flex flex-col items-start lg:items-end gap-3">
                                        <div className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyles}`}>
                                            {order.orderStatus || 'Processing'}
                                        </div>

                                        {order.isDelivered && (
                                            <p className="text-xs text-gray-500">
                                                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Orders;