import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoice, reset } from '../store/slices/orderSlice';

const Invoice = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { order, isLoading, isError } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getInvoice(id));
        return () => { dispatch(reset()); };
    }, [dispatch, id]);

    useEffect(() => {
        if (order && !isLoading) {
            document.title = `Invoice_${order._id}`;
            window.print();
        }
    }, [order, isLoading]);

    if (isLoading) return <div className="text-center p-10 font-mono text-gray-500">Loading Invoice...</div>;
    if (isError || !order) return <div className="text-center p-10 text-red-600 font-mono">Invoice Not Found.</div>;

    return (
        <div className="bg-white p-12 min-h-screen text-gray-900 font-serif max-w-4xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-start border-b-2 border-gray-800 pb-8 mb-12">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-900 text-white flex items-center justify-center font-bold text-2xl rounded-lg">
                        LH
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900">LCIT Herbal</h1>
                        <p className="text-sm font-bold text-gray-600 uppercase tracking-widest mt-1">Department of Science</p>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                            LCIT College of Commerce & Science,<br />
                            Bodri, Bilaspur (C.G.) - 495001
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-5xl font-bold text-gray-200 uppercase tracking-widest mb-2">Invoice</h2>
                    <p className="font-bold text-gray-700 text-lg"># {order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-gray-500 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
            </header>

            {/* Address Details */}
            <section className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Bill To</h3>
                    <p className="font-bold text-xl text-gray-800 mb-1">{order.user?.name}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>{order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                        <p>{order.shippingAddress?.pincode}</p>
                        <p className="mt-2 text-gray-500 font-mono text-xs">Phone: {order.shippingAddress?.phone}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="mb-6">
                        <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Payment Method</h3>
                        <p className="font-bold text-gray-800">{order.paymentMethod}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {order.isPaid ? 'Paid' : 'Pending Payment'}
                        </span>
                    </div>
                </div>
            </section>

            {/* Items Table */}
            <table className="w-full mb-12 border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-100">
                        <th className="py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest w-1/2">Item Description</th>
                        <th className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Qty</th>
                        <th className="py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Unit Price</th>
                        <th className="py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                    {order.orderItems.map((item, index) => (
                        <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                            <td className="py-4 pr-4">
                                <p className="font-bold text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Product ID: {item.product?._id || item.product}</p>
                            </td>
                            <td className="py-4 text-center font-mono">{item.quantity}</td>
                            <td className="py-4 text-right font-mono text-gray-600">₹{item.price.toFixed(2)}</td>
                            <td className="py-4 text-right font-bold text-gray-900 font-mono">₹{(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-16">
                <div className="w-1/2 md:w-1/3 space-y-3">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span className="font-mono text-gray-900">₹{Number(order.itemsPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span>
                        <span className="font-mono text-gray-900">₹{Number(order.shippingPrice || 0).toFixed(2)}</span>
                    </div>
                    {order.taxPrice > 0 && (
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Tax</span>
                            <span className="font-mono text-gray-900">₹{Number(order.taxPrice || 0).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-xl font-bold border-t-2 border-gray-900 pt-4 mt-2">
                        <span>Total Due</span>
                        <span className="font-mono text-gray-900">₹{Number(order.totalPrice || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto text-center border-t border-gray-100 pt-8">
                <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">Thank you for your support!</h4>
                <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed mb-8">
                    This is a computer-generated invoice. No signature required.<br />
                    For questions about your order, please contact <strong>science.dept@lcit.edu.in</strong>
                </p>
                <div className="text-[10px] text-gray-300 font-mono">
                    Generated on {new Date().toLocaleString()} | Order ID: {order._id}
                </div>
                <div className="mt-8 flex justify-center gap-4 print:hidden">
                    <button onClick={() => window.print()} className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                        Print Invoice
                    </button>
                    <button onClick={() => window.close()} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                        Close
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Invoice;
