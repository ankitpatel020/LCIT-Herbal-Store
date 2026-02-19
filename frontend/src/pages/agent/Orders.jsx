import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus, reset } from '../../store/slices/orderSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AgentLayout from '../../components/agent/AgentLayout';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading, isError, message } = useSelector((state) => state.orders);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

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

    const statusOptions = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

    // Filter Logic
    const filteredOrders = orders?.filter(order => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (statusFilter === 'All') matchesStatus = true;
        else if (statusFilter === 'Active') matchesStatus = !order.isDelivered;
        else matchesStatus = order.orderStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AgentLayout>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header & Filters */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Order Management</h2>
                        <p className="text-sm text-gray-500 mt-1">View and manage customer orders ({filteredOrders?.length || 0})</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search order ID or customer..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <select
                            className="px-4 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Orders</option>
                            <option value="Active">Active (Unfinished)</option>
                            <optgroup label="Specific Status">
                                {statusOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </optgroup>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading orders...</div>
                    ) : filteredOrders?.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Order Details</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4">Status & Action</th>
                                    <th className="px-6 py-4 text-center">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                                                <span className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                <div className="bg-gray-100 mt-2 px-2 py-1 rounded text-xs inline-block max-w-max">
                                                    ₹{order.totalPrice.toFixed(2)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mr-3">
                                                    {order.user?.name?.charAt(0) || 'G'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{order.user?.name || 'Guest User'}</p>
                                                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${order.isPaid
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-red-50 text-red-700 border-red-200'}
                                            `}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${order.isPaid ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2 max-w-[140px]">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border w-fit
                                                    ${order.isDelivered
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                                                `}>
                                                    {order.isDelivered ? 'Delivered' : order.orderStatus || 'Processing'}
                                                </span>

                                                {/* Status Update Dropdown */}
                                                {!order.isDelivered && (
                                                    <select
                                                        className="block w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400 transition-colors cursor-pointer shadow-sm"
                                                        value={order.orderStatus || 'Pending'}
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {statusOptions.map((opt) => (
                                                            <option key={opt} value={opt}>
                                                                {opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                to={`/order/${order._id}`}
                                                className="inline-flex items-center justify-center px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-50 transition-colors"
                                            >
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
                                <span className="text-4xl" role="img" aria-label="search">🔍</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                            <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                                className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-bold hover:underline"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Footer / Pagination Placeholder */}
                    {filteredOrders?.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                Showing <span className="font-medium">{filteredOrders.length}</span> results
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AgentLayout>
    );
};

export default Orders;
