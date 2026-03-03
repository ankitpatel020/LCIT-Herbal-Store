import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../store/slices/orderSlice';

const MyOrders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    /* ===============================
       LOADING
    =============================== */
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    /* ===============================
       EMPTY STATE
    =============================== */
    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-14 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-200 rounded-full flex items-center justify-center mb-6 text-4xl">
                    📦
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    No Orders Yet
                </h2>

                <p className="text-gray-500 mb-8 max-w-sm">
                    Once you place your first order, it will appear here.
                </p>

                <Link
                    to="/shop"
                    className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/30 transition"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    /* ===============================
       UI
    =============================== */
    return (
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex items-center justify-between px-1">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        My Orders
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
                    </p>
                </div>
            </div>

            {/* ORDER CARDS */}
            {orders.map((order) => {

                const statusColor =
                    order.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : order.orderStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700';

                return (
                    <div
                        key={order._id}
                        className="bg-white rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >

                        {/* TOP BAR */}
                        <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">

                            <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm">

                                <div>
                                    <span className="block text-xs uppercase font-bold text-gray-400">
                                        Placed On
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div>
                                    <span className="block text-xs uppercase font-bold text-gray-400">
                                        Total
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        ₹{order.totalPrice.toFixed(2)}
                                    </span>
                                </div>

                                <div>
                                    <span className="block text-xs uppercase font-bold text-gray-400">
                                        Order ID
                                    </span>
                                    <span className="font-mono text-gray-900">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </span>
                                </div>

                            </div>

                            <div className="flex items-center gap-4">
                                <Link
                                    to={`/order/${order._id}`}
                                    className="text-emerald-600 font-semibold text-sm hover:underline"
                                >
                                    View Details
                                </Link>

                                <Link
                                    to={`/invoice/${order._id}`}
                                    className="text-gray-500 text-sm hover:text-gray-800"
                                >
                                    Invoice
                                </Link>
                            </div>

                        </div>

                        {/* BODY */}
                        <div className="p-6 flex flex-col lg:flex-row justify-between gap-8">

                            {/* ITEMS */}
                            <div className="flex-1 space-y-4">

                                {order.orderItems.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4">

                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                            <img
                                                src={item.image}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <Link
                                                to={`/product/${item.product?._id || item.product}`}
                                                className="font-semibold text-gray-900 hover:text-emerald-600 line-clamp-1"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Qty: {item.quantity} • ₹{item.price}
                                            </p>
                                        </div>

                                    </div>
                                ))}

                                {order.orderItems.length > 3 && (
                                    <p className="text-xs text-gray-400">
                                        + {order.orderItems.length - 3} more items
                                    </p>
                                )}

                            </div>

                            {/* STATUS */}
                            <div className="flex flex-col items-start lg:items-end gap-3">

                                <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${statusColor}`}>
                                    {order.orderStatus || 'Processing'}
                                </span>

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
    );
};

export default MyOrders;