import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyCommission, reset } from '../../store/slices/agentSettlementSlice';
import AgentLayout from '../../components/agent/AgentLayout';
import toast from 'react-hot-toast';

const Payments = () => {
    const dispatch = useDispatch();
    const { myData, myPendingOrders, mySettledOrders, isLoading, isError, message } =
        useSelector((state) => state.agentSettlement);

    useEffect(() => {
        dispatch(getMyCommission());
        return () => dispatch(reset());
    }, [dispatch]);

    useEffect(() => {
        if (isError) toast.error(message);
    }, [isError, message]);

    const summary = myData?.summary;
    const agent = myData?.agent;

    if (isLoading) {
        return (
            <AgentLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
                </div>
            </AgentLayout>
        );
    }

    return (
        <AgentLayout>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900">My Earnings</h2>
                <p className="text-gray-500 text-sm mt-1">Your commission summary and payment history</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Commission Rate */}
                <div className="bg-white rounded-2xl border border-emerald-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 flex items-center gap-5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full" />
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl shrink-0 z-10">💼</div>
                    <div className="z-10">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Commission Rate</p>
                        <h3 className="text-3xl font-black text-emerald-600 mt-1">
                            {agent ? `${(agent.commissionRate * 100).toFixed(0)}%` : '—'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Per delivered order</p>
                    </div>
                </div>

                {/* Pending Commission */}
                <div className="bg-white rounded-2xl border border-amber-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 flex items-center gap-5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full" />
                    <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl shrink-0 z-10">⏳</div>
                    <div className="z-10">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</p>
                        <h3 className="text-3xl font-black text-amber-500 mt-1">
                            ₹{summary?.pendingCommission?.toFixed(2) || '0.00'}
                        </h3>
                        <p className="text-xs text-amber-500/70 mt-1">Awaiting settlement</p>
                    </div>
                </div>

                {/* Settled Commission */}
                <div className="bg-white rounded-2xl border border-emerald-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 flex items-center gap-5 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full" />
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl shrink-0 z-10">✅</div>
                    <div className="z-10">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Settled</p>
                        <h3 className="text-3xl font-black text-emerald-600 mt-1">
                            ₹{summary?.settledCommission?.toFixed(2) || '0.00'}
                        </h3>
                        <p className="text-xs text-emerald-500/70 mt-1">Successfully paid out</p>
                    </div>
                </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100 bg-amber-50/30 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900">Pending Commission Orders</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Delivered orders awaiting admin settlement</p>
                    </div>
                    {myPendingOrders?.length > 0 && (
                        <span className="text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
                            {myPendingOrders.length} Pending
                        </span>
                    )}
                </div>
                <div className="overflow-x-auto">
                    {myPendingOrders?.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Order Total</th>
                                    <th className="px-6 py-4 bg-amber-50/40 text-amber-700">Your Commission</th>
                                    <th className="px-6 py-4 text-center">Delivered On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {myPendingOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link to={`/order/${order._id}`} className="font-bold text-emerald-600 hover:underline text-sm">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                            {order.user?.name || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                            ₹{order.totalPrice?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 bg-amber-50/20">
                                            <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 text-sm">
                                                ₹{order.agentCommission?.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs text-gray-500 font-semibold">
                                            {new Date(order.deliveredAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-400">
                            <div className="inline-block p-4 bg-emerald-50 rounded-full mb-3 border border-emerald-100">
                                <span className="text-3xl">✨</span>
                            </div>
                            <p className="font-bold text-gray-600">All caught up!</p>
                            <p className="text-sm mt-1">No pending commission orders.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Settled Orders History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-emerald-50/20">
                    <h3 className="font-bold text-gray-900">Settlement History</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Recently settled payments (last 20)</p>
                </div>
                <div className="overflow-x-auto">
                    {mySettledOrders?.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Order Total</th>
                                    <th className="px-6 py-4 bg-emerald-50/30 text-emerald-700">Commission Paid</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {mySettledOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link to={`/order/${order._id}`} className="font-bold text-emerald-600 hover:underline text-sm">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                            ₹{order.totalPrice?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 bg-emerald-50/10">
                                            <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 text-sm">
                                                ₹{order.agentCommission?.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                                                SETTLED
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-400">
                            <div className="inline-block p-4 bg-gray-50 rounded-full mb-3 border border-gray-100">
                                <span className="text-3xl">📋</span>
                            </div>
                            <p className="font-bold text-gray-600">No settlement history yet</p>
                            <p className="text-sm mt-1">Completed settlements will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </AgentLayout>
    );
};

export default Payments;
