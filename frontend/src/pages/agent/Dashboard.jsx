import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="section">
            <div className="container-custom">
                <h1 className="text-3xl font-display font-bold mb-8">Agent Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card p-6 border-l-4 border-primary-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium uppercase">Welcome</p>
                                <h3 className="text-xl font-bold mt-1 max-w-[200px] truncate">{user?.name}</h3>
                            </div>
                            <div className="bg-primary-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Role: <span className="font-medium capitalize">{user?.role}</span></span>
                        </div>
                    </div>

                    <Link to="/agent/orders" className="card p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium uppercase">Management</p>
                                <h3 className="text-xl font-bold mt-1">Orders</h3>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                            View & Manage Orders
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
