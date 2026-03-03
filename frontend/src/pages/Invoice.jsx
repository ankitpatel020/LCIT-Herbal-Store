import React, { useEffect, useMemo } from 'react';
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
            document.title = `LCIT_Invoice_${order._id.slice(-6).toUpperCase()}`;
            // Intentionally not auto-printing immediately so user can review
        }
    }, [order, isLoading]);

    /* ===============================
       FORMATTER
    =============================== */
    const formatINR = (value) =>
        Number(value || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const invoiceNumber = useMemo(() => {
        if (!order) return '';
        return `INV-${new Date(order.createdAt).getFullYear()}-${order._id.slice(-6).toUpperCase()}`;
    }, [order]);

    /* ===============================
       TABLE COMPUTATIONS
    =============================== */
    const { tableRows, totals } = useMemo(() => {
        if (!order) return { tableRows: [], totals: {} };

        let totalGross = 0;
        let totalDiscount = 0;
        let totalTaxable = 0;
        let totalIgst = 0;
        let totalFinal = 0;

        const rows = order.orderItems.map((item) => {
            const product = item.product || {};

            // Assume 5% IGST for herbal products
            const igstRate = 0.05;

            // Base pricing
            const finalPricePerUnit = Number(item.price) || 0;
            const finalAmount = finalPricePerUnit * item.quantity;

            // If the schema originalPrice isn't available, fallback to the paid price as gross
            const baseMrpPerUnit = Number(product.originalPrice) || Number(product.regularPrice) || finalPricePerUnit;
            const grossAmount = baseMrpPerUnit * item.quantity;

            // Difference represents any platform/faculty/student discounts given
            const itemBaseDiscount = Math.max(0, grossAmount - finalAmount);

            // Deduct proportional coupon discount if one exists
            // To spread out the total coupon discount across items:
            const itemShareOfTotal = finalAmount / (order.itemsPrice || 1);
            const itemCouponDiscount = (order.discountAmount || 0) * itemShareOfTotal;

            const finalDiscountTotal = itemBaseDiscount + itemCouponDiscount;
            const amountAfterDiscount = grossAmount - finalDiscountTotal;

            // Reverse calculate Taxable Value and IGST from the post-discount string
            const taxableValue = amountAfterDiscount / (1 + igstRate);
            const igstAmount = amountAfterDiscount - taxableValue;

            // Add back to totals
            totalGross += grossAmount;
            totalDiscount += finalDiscountTotal;
            totalTaxable += taxableValue;
            totalIgst += igstAmount;
            totalFinal += amountAfterDiscount;

            return {
                title: product.name || item.name,
                sac: product.sacCode || '30049011', // Ayurvedic medicaments default SAC
                qty: item.quantity,
                grossAmount,
                discount: finalDiscountTotal,
                taxableValue,
                igstAmount,
                finalAmount: amountAfterDiscount
            };
        });

        return {
            tableRows: rows,
            totals: {
                totalGross,
                totalDiscount,
                totalTaxable,
                totalIgst,
                totalFinal
            }
        };
    }, [order]);

    if (isLoading)
        return <div className="text-center p-10 font-mono text-gray-500">Loading Invoice...</div>;

    if (isError || !order)
        return <div className="text-center p-10 text-red-600 font-mono">Invoice Not Found.</div>;

    const qrData = encodeURIComponent(`Invoice: ${invoiceNumber}\nAmount: INR ${formatINR(order.totalPrice)}\nOrder ID: ${order._id}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

    return (
        <div className="bg-white p-8 md:p-12 min-h-screen text-gray-900 font-sans max-w-5xl mx-auto">

            {/* PRINT BUTTON */}
            <div className="flex justify-end mb-6 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Print Invoice
                </button>
            </div>

            <div className="border border-gray-300 rounded-sm">

                {/* HEADER */}
                <div className="flex justify-between items-start border-b border-gray-300 p-8">
                    <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100 shrink-0">
                            <span className="text-3xl">🌿</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold uppercase tracking-wider text-emerald-800">
                                LCIT Herbal Store
                            </h1>
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                <strong>Department of Chemistry</strong><br />
                                LCIT College of Commerce & Science<br />
                                Bodri, Bilaspur (Chhattisgarh) - 495001<br />
                                India
                            </p>
                            <p className="text-xs text-gray-500 mt-2 font-medium">
                                GSTIN/UIN: 22AAAAA0000A1Z5
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                                State Name: Chhattisgarh, Code: 22
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-gray-300 uppercase tracking-widest mb-4">
                            Tax Invoice
                        </h2>

                        <div className="w-24 h-24 ml-auto border p-1 rounded-md bg-white">
                            <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
                        </div>
                    </div>
                </div>

                {/* DETAILS ROW */}
                <div className="grid grid-cols-2 divide-x border-b border-gray-300">
                    <div className="p-6">
                        <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2">Billed To</h3>
                        <p className="font-bold text-gray-900 border-b pb-2 mb-2 inline-block">
                            {order.shippingAddress?.name || order.user?.name}
                        </p>
                        <div className="text-xs text-gray-700 leading-relaxed font-medium mt-1">
                            <p>{order.shippingAddress?.street || order.shippingAddress?.address}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                            <p>{order.shippingAddress?.pincode}</p>
                            <p>India</p>
                            <p className="mt-2 text-gray-600">
                                Phone: {order.shippingAddress?.phone}
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        <table className="w-full text-xs">
                            <tbody>
                                <tr>
                                    <td className="text-gray-500 font-medium pb-2 w-1/3">Invoice No.</td>
                                    <td className="font-bold text-gray-900 pb-2">: {invoiceNumber}</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-500 font-medium pb-2">Invoice Date</td>
                                    <td className="font-bold text-gray-900 pb-2">: {new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-500 font-medium pb-2">Payment Mode</td>
                                    <td className="font-bold text-gray-900 pb-2 uppercase">: {order.paymentMethod}</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-500 font-medium pb-4">Payment Status</td>
                                    <td className="pb-4">
                                        : <span className={`inline-block px-2 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {order.isPaid ? 'PAID' : 'PENDING'}
                                        </span>
                                    </td>
                                </tr>
                                {order.paymentInfo?.id && (
                                    <tr>
                                        <td className="text-gray-500 font-medium border-t border-gray-100 pt-3">Transaction ID</td>
                                        <td className="font-mono text-gray-600 border-t border-gray-100 pt-3">: {order.paymentInfo.id}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 text-[10px] text-gray-600 uppercase tracking-wider text-right border-b border-gray-300">
                        <tr>
                            <th className="p-3 text-left font-bold border-r border-gray-200 w-1/4">Product Title</th>
                            <th className="p-3 font-bold border-r border-gray-200">SAC</th>
                            <th className="p-3 font-bold border-r border-gray-200">Qty</th>
                            <th className="p-3 font-bold border-r border-gray-200">Gross Amount ₹</th>
                            <th className="p-3 font-bold border-r border-gray-200">Discounts<br />/Coupons ₹</th>
                            <th className="p-3 font-bold border-r border-gray-200">Taxable<br />Value ₹</th>
                            <th className="p-3 font-bold border-r border-gray-200">IGST ₹</th>
                            <th className="p-3 font-bold text-gray-900">Total ₹</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs text-gray-800 text-right">
                        {tableRows.map((row, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="p-3 text-left border-r border-gray-200">
                                    <p className="font-semibold text-gray-900 leading-snug">{row.title}</p>
                                </td>
                                <td className="p-3 font-mono text-gray-500 border-r border-gray-200">{row.sac}</td>
                                <td className="p-3 font-mono font-medium border-r border-gray-200 text-center">{row.qty}</td>
                                <td className="p-3 font-mono border-r border-gray-200">{formatINR(row.grossAmount)}</td>
                                <td className="p-3 font-mono text-green-600 border-r border-gray-200">
                                    {row.discount > 0 ? `-${formatINR(row.discount)}` : '-'}
                                </td>
                                <td className="p-3 font-mono border-r border-gray-200">{formatINR(row.taxableValue)}</td>
                                <td className="p-3 font-mono border-r border-gray-200">
                                    {formatINR(row.igstAmount)}<br />
                                    <span className="text-[9px] text-gray-400 font-sans tracking-wide">5%</span>
                                </td>
                                <td className="p-3 font-bold font-mono text-gray-900 bg-gray-50/50">{formatINR(row.finalAmount)}</td>
                            </tr>
                        ))}
                    </tbody>

                    {/* TABLE FOOTER / TOTALS */}
                    <tfoot className="bg-stone-50 text-right text-xs font-bold border-b border-gray-300 text-gray-800">
                        <tr>
                            <td colSpan="3" className="p-3 text-left uppercase tracking-widest border-r border-gray-200">Calculated Totals</td>
                            <td className="p-3 font-mono border-r border-gray-200">{formatINR(totals.totalGross)}</td>
                            <td className="p-3 font-mono text-emerald-700 border-r border-gray-200">-{formatINR(totals.totalDiscount)}</td>
                            <td className="p-3 font-mono border-r border-gray-200">{formatINR(totals.totalTaxable)}</td>
                            <td className="p-3 font-mono border-r border-gray-200">{formatINR(totals.totalIgst)}</td>
                            <td className="p-3 font-mono text-sm bg-stone-100 border-t-2 border-emerald-600 text-emerald-900">
                                {formatINR(totals.totalFinal)}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* BOTTOM COMPOSITE TOTALS */}
                <div className="flex bg-white flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-gray-300">

                    {/* TERMS */}
                    <div className="w-full md:w-3/5 p-6 text-[10px] text-gray-500 leading-relaxed">
                        <strong className="uppercase tracking-widest text-gray-700 block mb-2">Terms & Conditions</strong>
                        <ol className="list-decimal pl-4 space-y-1">
                            <li>Subject to Bilaspur jurisdiction only.</li>
                            <li>Products manufactured under academic supervision.</li>
                            <li>Prices are inclusive of all taxes where applicable.</li>
                            <li>Return policy valid for 7 days from delivery date.</li>
                        </ol>
                    </div>

                    {/* GRAND SUMMARY */}
                    <div className="w-full md:w-2/5 p-6 bg-stone-50">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between font-medium text-gray-600">
                                <span>Total Taxable Amount</span>
                                <span className="font-mono">{formatINR(totals.totalTaxable)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-gray-600">
                                <span>Total IGST (5%)</span>
                                <span className="font-mono">{formatINR(totals.totalIgst)}</span>
                            </div>
                            {(order.shippingPrice > 0) && (
                                <div className="flex justify-between font-medium text-gray-600 border-t border-gray-200 pt-2">
                                    <span>Shipping Fee</span>
                                    <span className="font-mono">+{formatINR(order.shippingPrice)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-300 pt-3 mt-1 items-end">
                                <div>
                                    <span className="text-xl uppercase tracking-wider block">Grand Total</span>

                                    <span className="text-[10px] text-emerald-600 font-semibold tracking-wider font-sans uppercase">
                                        Total Savings: {formatINR(totals.totalDiscount)}
                                    </span>
                                </div>
                                <span className="text-2xl font-mono text-emerald-800">
                                    ₹{formatINR(totals.totalFinal + (order.shippingPrice || 0))}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="text-center mt-10 print:mt-16 text-[10px] text-gray-400 font-mono">
                <p>This is a computer-generated invoice and requires no signature or physical stamp.</p>
                <p className="mt-1">Generated electronically on {new Date().toLocaleString()}</p>
            </div>

        </div>
    );
};

export default Invoice;