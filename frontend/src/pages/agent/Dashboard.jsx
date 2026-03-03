import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../store/slices/orderSlice';
import AgentLayout from '../../components/agent/AgentLayout';
import { FiTrendingUp, FiShoppingBag, FiTruck, FiCheckCircle } from 'react-icons/fi';

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
            icon: <FiTrendingUp size={24} />,
            bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            trend: '+12.5%'
        },
        {
            title: 'Total Orders',
            value: totalOrders,
            icon: <FiShoppingBag size={24} />,
            bg: 'bg-blue-50 text-blue-600 border-blue-100',
            trend: '+5.2%'
        },
        {
            title: 'Pending Delivery',
            value: pendingOrders,
            icon: <FiTruck size={24} />,
            bg: 'bg-amber-50 text-amber-600 border-amber-100',
            trend: 'Action Required'
        },
        {
            title: 'Agent Status',
            value: 'Active',
            icon: <FiCheckCircle size={24} />,
            bg: 'bg-purple-50 text-purple-600 border-purple-100',
            trend: 'Online'
        }
    ];

    return (
        <AgentLayout>
            <div className="pt-2">
                {/* Dashboard Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Agent Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Metrics and recent activities for your region.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {statsCards.map((stat, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform ${stat.bg}`}>
                                            {stat.icon}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100/50">
                                            30 Days
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">{stat.value}</h3>
                                        <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
                                    </div>
                                    <div className="mt-4 flex items-center text-xs">
                                        <span className={`font-medium ${stat.trend.includes('+') ? 'text-emerald-500' : 'text-gray-500'}`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Orders Table */}
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                                    <h3 className="font-bold text-lg text-gray-900">Recent Assignments</h3>
                                    <Link to="/agent/orders" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                                        View All
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead>
                                            <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                                <th className="px-6 py-4">Order ID</th>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {recentOrders.length > 0 ? (
                                                recentOrders.map((order) => (
                                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm font-mono font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200/50">
                                                                #{order._id.slice(-6).toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-bold text-gray-900">{order.user?.name || 'Guest'}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                                                                ${order.isDelivered ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}
                                                            `}>
                                                                {order.isDelivered ? 'Delivered' : 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-extrabold text-gray-900 text-right">
                                                            ₹{order.totalPrice.toLocaleString('en-IN')}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center">
                                                        <div className="inline-flex flex-col items-center justify-center text-gray-400">
                                                            <FiShoppingBag size={32} className="mb-3 text-gray-300" />
                                                            <span className="text-sm font-medium text-gray-500">No recent orders assigned.</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Quick Actions / Profile Card */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <Link to="/agent/orders" className="flex items-center justify-center w-full p-3.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm transition-all text-sm font-bold text-gray-600">
                                            Manage Queue
                                        </Link>
                                        <Link to="/profile" className="flex items-center justify-center w-full p-3.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm transition-all text-sm font-bold text-gray-600">
                                            Update Profile
                                        </Link>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-[0_8px_30px_rgba(16,185,129,0.2)] p-6 text-white relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-lg mb-2">Support Hub</h3>
                                        <p className="text-emerald-100 text-sm mb-6 leading-relaxed">Require assistance with a specific delivery or app malfunction?</p>
                                        <Link to="/support" className="inline-block bg-white text-emerald-700 font-bold tracking-wide py-2.5 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                            Open Ticket
                                        </Link>
                                    </div>
                                    <div className="absolute -bottom-8 -right-8 text-white opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AgentLayout>
    );
};

export default Dashboard;
