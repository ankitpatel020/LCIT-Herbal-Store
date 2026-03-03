import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getAgentSummary, getPendingOrders, clearSelectedAgent } from '../../store/slices/agentSettlementSlice';
import toast from 'react-hot-toast';
import SettlePaymentModal from '../../components/admin/SettlePaymentModal';

const AgentDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        selectedAgent: agent,
        agentSummary: summary,
        pendingOrders,
        isLoading,
        isError,
        message,
        isSuccess
    } = useSelector((state) => state.agentSettlement);

    useEffect(() => {
        dispatch(getAgentSummary(id));
        dispatch(getPendingOrders(id));

        return () => {
            dispatch(clearSelectedAgent());
        };
    }, [dispatch, id]);

    // Refresh after successful settlement (modal closes, isSuccess is triggered)
    useEffect(() => {
        if (isSuccess && !isModalOpen) {
            dispatch(getAgentSummary(id));
        }
    }, [isSuccess, isModalOpen, dispatch, id])

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    if (isLoading && (!agent || !summary)) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header Navigation */}
            <div className="mb-6 flex items-center justify-between">
                <Link to="/admin/agent-payments" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-purple-600 transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Agent List
                </Link>

                {pendingOrders?.length > 0 && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-purple-200 transition-all flex items-center gap-2"
                    >
                        <span>💸</span> Settle All Payments
                    </button>
                )}
            </div>

            {/* Agent Profile & Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col items-center text-center">
                    <img src={agent?.avatar} alt={agent?.name} className="w-24 h-24 rounded-full border-4 border-purple-50 shadow-sm mb-4" />
                    <h2 className="text-xl font-black text-gray-900">{agent?.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">{agent?.email}</p>

                    <div className="w-full pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Commission Rate</span>
                            <span className="font-bold text-gray-900">{(agent?.commissionRate * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Phone</span>
                            <span className="font-bold text-gray-900">{agent?.phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Orders</p>
                            <h3 className="text-4xl font-black text-blue-600">{summary?.totalOrders || 0}</h3>
                            <p className="text-xs text-gray-400 mt-2">Delivered by agent</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-amber-100 p-6 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-1">Pending Commission</p>
                            <h3 className="text-4xl font-black text-amber-500">₹{summary?.pendingCommission?.toFixed(2) || '0.00'}</h3>
                            <p className="text-xs text-amber-600/60 mt-2">Awaiting settlement</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-emerald-100 p-6 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">Settled Earnings</p>
                            <h3 className="text-4xl font-black text-emerald-500">₹{summary?.settledCommission?.toFixed(2) || '0.00'}</h3>
                            <p className="text-xs text-emerald-600/60 mt-2">Successfully paid out</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Orders Table */}
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Pending Orders</h3>
                        <p className="text-sm text-gray-500 mt-1">Orders delivered but commission not paid</p>
                    </div>
                    {pendingOrders?.length > 0 && (
                        <div className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                            {pendingOrders.length} Orders Pending
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    {pendingOrders?.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4 bg-purple-50/30 text-purple-700">Commission Earned</th>
                                    <th className="px-6 py-4 text-center">Delivered On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendingOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link to={`/admin/order/${order._id}`} className="font-bold text-purple-600 hover:text-purple-800 text-sm hover:underline">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900">{order.user?.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-600">₹{order.totalPrice.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4 bg-purple-50/10">
                                            <span className="font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded shadow-sm border border-purple-100">
                                                ₹{order.agentCommission?.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                                {new Date(order.deliveredAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-16 text-center text-gray-500">
                            <div className="inline-block p-4 rounded-full bg-emerald-50 mb-4 border border-emerald-100">
                                <span className="text-4xl" role="img" aria-label="all clear">✨</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
                            <p className="text-sm mt-1">There are no pending commission payments for this agent.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <SettlePaymentModal
                    agent={agent}
                    pendingOrders={pendingOrders}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AgentDetails;
