import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSettlement } from '../../store/slices/agentSettlementSlice';
import toast from 'react-hot-toast';

const SettlePaymentModal = ({ agent, pendingOrders, onClose }) => {
    const dispatch = useDispatch();
    const [selectedOrderIds, setSelectedOrderIds] = useState(pendingOrders.map(o => o._id));
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [notes, setNotes] = useState('');

    const toggleOrderSelection = (id) => {
        setSelectedOrderIds(prev =>
            prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
        );
    };

    const selectedAmount = pendingOrders
        .filter(o => selectedOrderIds.includes(o._id))
        .reduce((sum, order) => sum + (order.agentCommission || 0), 0);

    const handleSettle = () => {
        if (selectedOrderIds.length === 0) {
            toast.error("Please select at least one order to settle.");
            return;
        }
        dispatch(createSettlement({
            agentId: agent._id,
            orderIds: selectedOrderIds,
            paymentMethod,
            notes
        }));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">💸</span> Settle Commission Payment
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">

                    {/* Agent Summary Card */}
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={agent?.avatar} alt={agent?.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                            <div>
                                <h4 className="font-bold text-purple-900">{agent?.name}</h4>
                                <p className="text-xs text-purple-700">{agent?.email}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-purple-600 font-semibold mb-1">Total Selected Amount</p>
                            <p className="text-2xl font-black text-purple-700">₹{selectedAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Order Selection */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Select Orders to Settle</h4>
                            <button
                                onClick={() => setSelectedOrderIds(selectedOrderIds.length === pendingOrders.length ? [] : pendingOrders.map(o => o._id))}
                                className="text-xs font-bold text-purple-600 hover:text-purple-800"
                            >
                                {selectedOrderIds.length === pendingOrders.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                {pendingOrders.map(order => (
                                    <div
                                        key={order._id}
                                        onClick={() => toggleOrderSelection(order._id)}
                                        className={`px-4 py-3 flex items-center justify-between border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${selectedOrderIds.includes(order._id) ? 'bg-purple-50/50' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-5 h-5">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrderIds.includes(order._id)}
                                                    readOnly
                                                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                                                <p className="text-xs text-gray-500">Delivered: {new Date(order.deliveredAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-purple-600 bg-white px-2 py-1 rounded shadow-sm border border-purple-100">
                                            ₹{order.agentCommission?.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Payment Details Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Payment Method</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                <option value="upi">UPI Transfer</option>
                                <option value="bank-transfer">Bank Transfer</option>
                                <option value="cash">Cash Settlement</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Notes (Optional)</label>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Transaction ID"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSettle}
                        disabled={selectedOrderIds.length === 0}
                        className={`px-5 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm transition-all flex items-center gap-2
                            ${selectedOrderIds.length === 0 ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 hover:shadow-md hover:shadow-purple-200'}`}
                    >
                        <span>✓</span> Confirm Settlement
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SettlePaymentModal;
