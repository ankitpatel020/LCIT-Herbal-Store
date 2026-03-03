import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAgentSettlements } from '../../store/slices/agentSettlementSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AgentPayments = () => {
    const dispatch = useDispatch();
    const { agents, isLoading, isError, message } = useSelector(
        (state) => state.agentSettlement
    );

    useEffect(() => {
        dispatch(getAgentSettlements());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Agent Payments</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage agent commissions and settlements</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                {agents?.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Agent Details</th>
                                <th className="px-6 py-4">Total Orders Delivered</th>
                                <th className="px-6 py-4">Pending Commission</th>
                                <th className="px-6 py-4">Settled Commission</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {agents.map((agent) => (
                                <tr key={agent._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                                                <img
                                                    src={agent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}`}
                                                    alt={agent.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                                                <p className="text-xs text-gray-500">{agent.email}</p>
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">
                                                    {(agent.commissionRate * 100).toFixed(0)}% Rate
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{agent.totalOrders}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                            ₹{agent.pendingCommission?.toFixed(2) || '0.00'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                            ₹{agent.settledCommission?.toFixed(2) || '0.00'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Link
                                            to={`/admin/agent-payments/${agent._id}`}
                                            className="inline-flex items-center justify-center px-4 py-1.5 border border-purple-600 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                        >
                                            View & Settle
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-16 text-center text-gray-500">
                        <div className="inline-block p-4 rounded-full bg-gray-50 mb-4 border border-gray-100">
                            <span className="text-4xl" role="img" aria-label="empty">💸</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No agents found</h3>
                        <p className="text-sm mt-1">There are no agents in the system yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentPayments;
