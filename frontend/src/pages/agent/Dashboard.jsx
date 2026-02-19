import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../store/slices/orderSlice';
import AgentLayout from '../../components/agent/AgentLayout';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector((state) => state.orders);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    // Calculate Stats
    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter(o => !o.isDelivered).length || 0;
    const totalRevenue = orders?.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0) || 0;

    // Get recent orders (last 5)
    const recentOrders = orders ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5) : [];

    const statsCards = [
        {
            title: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: <span role="img" aria-label="revenue">💰</span>,
            bg: 'bg-green-50 text-green-700',
            border: 'border-green-200'
        },
        {
            title: 'Total Orders',
            value: totalOrders,
            icon: <span role="img" aria-label="orders">📦</span>,
            bg: 'bg-blue-50 text-blue-700',
            border: 'border-blue-200'
        },
        {
            title: 'Pending Delivery',
            value: pendingOrders,
            icon: <span role="img" aria-label="pending">🚚</span>,
            bg: 'bg-orange-50 text-orange-700',
            border: 'border-orange-200'
        },
        {
            title: 'Agent Status',
            value: 'Active',
            icon: <span role="img" aria-label="status">✅</span>,
            bg: 'bg-purple-50 text-purple-700',
            border: 'border-purple-200'
        }
    ];

    return (
        <AgentLayout>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsCards.map((stat, idx) => (
                            <div key={idx} className={`card p-6 border ${stat.border} hover:shadow-md transition-shadow`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.bg}`}>
                                        {stat.icon}
                                    </div>
                                    <span className="text-xs font-bold uppercase text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                        Last 30 Days
                                    </span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Orders Table */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-gray-800">Recent Orders</h3>
                                <Link to="/agent/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                                    View All
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                            <th className="px-6 py-4 font-semibold">Order ID</th>
                                            <th className="px-6 py-4 font-semibold">Customer</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentOrders.length > 0 ? (
                                            recentOrders.map((order) => (
                                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        #{order._id.slice(-6).toUpperCase()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {order.user?.name || 'Guest'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                                                            ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                                                        `}>
                                                            {order.isDelivered ? 'Delivered' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        ₹{order.totalPrice.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                    No recent orders found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Quick Actions / Profile Card */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link to="/agent/orders" className="block w-full p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all text-center font-medium text-gray-600">
                                        Manage Orders
                                    </Link>
                                    <Link to="/profile" className="block w-full p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all text-center font-medium text-gray-600">
                                        Update Profile
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                                    <p className="text-indigo-100 text-sm mb-4">Contact admin support for assistance with orders or account issues.</p>
                                    <Link to="/help-center" className="inline-block bg-white text-indigo-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-indigo-50 transition-colors">
                                        Support Center
                                    </Link>
                                </div>
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 text-9xl opacity-10">?</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AgentLayout>
    );
};

export default Dashboard;
