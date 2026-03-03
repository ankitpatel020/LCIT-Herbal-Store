import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats, reset } from '../../store/slices/analyticsSlice';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign, FiPlus, FiList, FiStar } from 'react-icons/fi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, isLoading } = useSelector((state) => state.analytics);
    const { token } = useSelector((state) => state.auth);

    const [salesData, setSalesData] = useState(null);
    const [statusData, setStatusData] = useState(null);
    const [chartsLoading, setChartsLoading] = useState(true);

    useEffect(() => {
        dispatch(getDashboardStats());

        const fetchCharts = async () => {
            try {
                setChartsLoading(true);
                const [salesRes, statusRes] = await Promise.all([
                    axios.get(`${API_URL}/analytics/sales?period=month`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_URL}/analytics/order-status`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setSalesData(salesRes.data.data);
                setStatusData(statusRes.data.data);
            } catch (error) {
                console.error('Failed to fetch chart data', error);
            } finally {
                setChartsLoading(false);
            }
        };

        if (token) {
            fetchCharts();
        }

        return () => {
            dispatch(reset());
        };
    }, [dispatch, token]);

    const dashboardStats = [
        {
            title: 'Total Revenue',
            value: `₹${stats?.totalSales?.toLocaleString() || 0}`,
            icon: <FiDollarSign size={24} />,
            bg: 'bg-emerald-500',
            link: '/admin/orders',
            trend: '+12.5%'
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: <FiShoppingBag size={24} />,
            bg: 'bg-blue-500',
            link: '/admin/orders',
            trend: '+5.2%'
        },
        {
            title: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: <FiList size={24} />,
            bg: 'bg-purple-500',
            link: '/admin/products',
            trend: 'Updated'
        },
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: <FiUsers size={24} />,
            bg: 'bg-amber-500',
            link: '/admin/users',
            trend: '+18.1%'
        }
    ];

    const quickActions = [
        {
            title: 'Add New Product',
            icon: <FiPlus />,
            link: '/admin/products',
            color: 'bg-emerald-600 hover:bg-emerald-700'
        },
        {
            title: 'View Orders',
            icon: <FiShoppingBag />,
            link: '/admin/orders',
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            title: 'Manage Users',
            icon: <FiUsers />,
            link: '/admin/users',
            color: 'bg-purple-600 hover:bg-purple-700'
        },
        {
            title: 'Reviews',
            icon: <FiStar />,
            link: '/admin/reviews',
            color: 'bg-amber-500 hover:bg-amber-600'
        }
    ];

    // Chart configs
    const lineChartData = {
        labels: salesData?.map(item => item._id) || [],
        datasets: [
            {
                label: 'Revenue (₹)',
                data: salesData?.map(item => item.totalSales) || [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#10b981',
            }
        ]
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                border: { dash: [4, 4] },
                grid: { color: '#f3f4f6' },
                beginAtZero: true
            }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false }
    };

    const doughnutChartData = {
        labels: statusData?.map(item => item._id) || [],
        datasets: [
            {
                data: statusData?.map(item => item.count) || [],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 0,
            }
        ]
    };

    const doughnutOptions = {
        responsive: true,
        cutout: '75%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { usePointStyle: true, padding: 20 }
            }
        }
    };

    return (
        <div className="section pt-0 px-0 bg-gray-50 min-h-screen pb-12">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your store today.</p>
                    </div>
                    <div className="flex gap-3">
                        {quickActions.map((action, i) => (
                            <Link
                                key={i}
                                to={action.link}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm transition-transform hover:-translate-y-0.5 ${action.color}`}
                            >
                                {action.icon}
                                <span className="hidden sm:inline">{action.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {dashboardStats.map((stat, index) => (
                                <Link to={stat.link} key={index} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 block hover:shadow-lg transition-all duration-300 group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.title}</p>
                                            <h3 className="text-3xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{stat.value}</h3>
                                        </div>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${stat.bg}`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center text-sm">
                                        <span className={`flex items-center font-medium ${stat.trend.includes('+') ? 'text-emerald-500' : 'text-gray-500'}`}>
                                            <FiTrendingUp className="mr-1" />
                                            {stat.trend}
                                        </span>
                                        <span className="text-gray-400 ml-2">vs last month</span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Additional Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg border border-orange-400/50">
                                <h4 className="text-orange-100 text-sm font-semibold uppercase tracking-wider">Pending Orders</h4>
                                <div className="flex items-end gap-3 mt-2">
                                    <span className="text-4xl font-bold">{stats?.pendingOrders || 0}</span>
                                    <span className="text-orange-200 text-sm pb-1">Needs dispatch</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl p-6 text-white shadow-lg border border-red-400/50">
                                <h4 className="text-red-100 text-sm font-semibold uppercase tracking-wider">Low Stock Products</h4>
                                <div className="flex items-end gap-3 mt-2">
                                    <span className="text-4xl font-bold">{stats?.lowStockProducts || 0}</span>
                                    <span className="text-red-200 text-sm pb-1">Needs restock</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg border border-blue-500/50">
                                <h4 className="text-blue-100 text-sm font-semibold uppercase tracking-wider">Monthly Sales</h4>
                                <div className="flex items-end gap-3 mt-2">
                                    <span className="text-4xl font-bold">₹{stats?.monthlySales?.toLocaleString() || 0}</span>
                                    <span className="text-blue-200 text-sm pb-1">This month</span>
                                </div>
                            </div>
                        </div>

                        {/* Analytics Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                                    <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2">
                                        <option>Last 30 Days</option>
                                    </select>
                                </div>
                                <div className="h-[300px] w-full">
                                    {chartsLoading ? (
                                        <div className="h-full flex items-center justify-center text-gray-400">Loading chart...</div>
                                    ) : (
                                        <Line data={lineChartData} options={lineChartOptions} />
                                    )}
                                </div>
                            </div>

                            <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Status</h3>
                                <div className="h-[300px] w-full flex items-center justify-center relative">
                                    {chartsLoading ? (
                                        <div className="text-gray-400">Loading chart...</div>
                                    ) : (
                                        <>
                                            <Doughnut data={doughnutChartData} options={doughnutOptions} />
                                            <div className="absolute inset-0 flex items-center justify-center -mt-8 pointer-events-none">
                                                <div className="text-center">
                                                    <span className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</span>
                                                    <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
