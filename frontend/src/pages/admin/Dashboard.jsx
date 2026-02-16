import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats, reset } from '../../store/slices/analyticsSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, isLoading } = useSelector((state) => state.analytics);

    useEffect(() => {
        dispatch(getDashboardStats());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const dashboardStats = [
        {
            title: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            bg: 'bg-green-50',
            link: '/admin/products'
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            bg: 'bg-blue-50',
            link: '/admin/orders'
        },
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            bg: 'bg-purple-50',
            link: '/admin/users'
        },
        {
            title: 'Total Revenue',
            value: `₹${stats?.totalSales?.toLocaleString() || 0}`,
            icon: (
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: 'bg-yellow-50',
            link: '/admin/orders'
        },
    ];

    const quickActions = [
        {
            title: 'Add New Product',
            description: 'Create a new product listing in the store.',
            link: '/admin/products',
            action: 'Create',
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            title: 'View Orders',
            description: 'Manage and update customer orders.',
            link: '/admin/orders',
            action: 'Manage',
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            title: 'Manage Users',
            description: 'View and manage registered users.',
            link: '/admin/users',
            action: 'View',
            color: 'bg-purple-600 hover:bg-purple-700'
        },
        {
            title: 'Manage Reviews',
            description: 'Moderate customer reviews.',
            link: '/admin/reviews',
            action: 'Moderate',
            color: 'bg-yellow-600 hover:bg-yellow-700'
        }
    ];

    return (
        <>
            <div className="section pt-0 px-0">
                <div className="w-full">
                    {isLoading ? (
                        <div className="text-center py-10">Loading statistics...</div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {dashboardStats.map((stat, index) => (
                                    <Link to={stat.link} key={index} className="card p-6 hover:shadow-lg transition-shadow border border-gray-100 block">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{stat.title}</h3>
                                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                                {stat.icon}
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                        <div className="mt-4 flex items-center text-sm text-gray-500">
                                            <span className="text-green-500 font-medium flex items-center mr-2">
                                                Overview
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Additional Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="card p-6 border-l-4 border-orange-500">
                                    <p className="text-gray-500 uppercase text-xs font-bold">Pending Orders</p>
                                    <p className="text-2xl font-bold mt-2">{stats?.pendingOrders || 0}</p>
                                </div>
                                <div className="card p-6 border-l-4 border-red-500">
                                    <p className="text-gray-500 uppercase text-xs font-bold">Low Stock Products</p>
                                    <p className="text-2xl font-bold mt-2">{stats?.lowStockProducts || 0}</p>
                                </div>
                                <div className="card p-6 border-l-4 border-blue-500">
                                    <p className="text-gray-500 uppercase text-xs font-bold">Monthly Sales</p>
                                    <p className="text-2xl font-bold mt-2">₹{stats?.monthlySales?.toLocaleString() || 0}</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {quickActions.map((action, index) => (
                                    <div key={index} className="card p-6 border-t-4 border-gray-200 hover:border-primary-500 transition-colors">
                                        <h3 className="text-lg font-bold mb-2">{action.title}</h3>
                                        <p className="text-gray-600 mb-6 h-12 text-sm">{action.description}</p>
                                        <Link to={action.link} className={`btn w-full ${action.color} text-white text-center block`}>
                                            {action.action}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
