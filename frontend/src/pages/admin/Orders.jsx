import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus, reset } from '../../store/slices/orderSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiExternalLink, FiSearch } from 'react-icons/fi';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading, isError, message } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getAllOrders());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    const handleStatusUpdate = (id, status) => {
        if (window.confirm(`Are you sure you want to update status to ${status}?`)) {
            dispatch(updateOrderStatus({ id, status }));
        }
    };

    const statusOptions = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Pending':
            case 'Processing':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="section pt-0 px-0 bg-gray-50 min-h-screen pb-12">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* HEADERS */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <FiShoppingBag className="text-emerald-600" />
                            Manage Orders
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">View, track, and update all recent store orders.</p>
                    </div>

                    {/* SEARCH / FILTER (MOCK FOR UI) */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search order ID..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none w-full sm:w-64"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders && orders.map((order) => (
                                        <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    #{order._id.substring(20).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">{order.user?.name || 'Guest User'}</div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="p-4 font-bold text-gray-900">
                                                ₹{order.totalPrice.toLocaleString('en-IN')}
                                            </td>
                                            <td className="p-4 flex flex-col gap-1 items-start justify-center pt-5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${order.paymentMethod === 'Razorpay' || order.paymentMethod === 'Online'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                        : 'bg-stone-100 text-stone-700 border-stone-200'
                                                    }`}>
                                                    {order.paymentMethod}
                                                </span>
                                                {order.isPaid ? (
                                                    <span className="text-[10px] text-emerald-600 font-bold ml-1">PAID</span>
                                                ) : (
                                                    <span className="text-[10px] text-red-500 font-bold ml-1">UNPAID</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                                                        <select
                                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-medium cursor-pointer"
                                                            value={order.orderStatus}
                                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                        >
                                                            {statusOptions.map((opt) => (
                                                                <option key={opt} value={opt}>
                                                                    {opt}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}

                                                    <Link
                                                        to={`/order/${order._id}`}
                                                        className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FiExternalLink size={14} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!orders || orders.length === 0) && (
                                        <tr>
                                            <td colSpan="7" className="p-12 text-center">
                                                <div className="inline-flex flex-col items-center justify-center text-gray-400">
                                                    <FiShoppingBag size={48} className="mb-4 text-gray-300" />
                                                    <p className="text-lg font-medium text-gray-900">No Orders Found</p>
                                                    <p className="text-sm mt-1">There are currently no orders in the system.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
