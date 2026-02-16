import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrderStatus, reset } from '../../store/slices/orderSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, isLoading, isError, message } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getAllOrders());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    const handleStatusUpdate = (id, status) => {
        if (window.confirm(`Are you sure you want to update status to ${status}?`)) {
            dispatch(updateOrderStatus({ id, status }));
        }
    };

    const statusOptions = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

    return (
        <div className="section">
            <div className="container-custom">
                <h1 className="text-3xl font-display font-bold mb-8">Manage Orders</h1>

                {isLoading ? (
                    <div className="text-center py-10">Loading orders...</div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="p-4 font-semibold text-gray-600">ORDER ID</th>
                                    <th className="p-4 font-semibold text-gray-600">USER</th>
                                    <th className="p-4 font-semibold text-gray-600">DATE</th>
                                    <th className="p-4 font-semibold text-gray-600">TOTAL</th>
                                    <th className="p-4 font-semibold text-gray-600">PAID</th>
                                    <th className="p-4 font-semibold text-gray-600">DELIVERED</th>
                                    <th className="p-4 font-semibold text-gray-600">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.map((order) => (
                                    <tr key={order._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-500">{order._id.substring(20)}...</td>
                                        <td className="p-4 font-medium">{order.user?.name || 'Unknown'}</td>
                                        <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">₹{order.totalPrice.toFixed(2)}</td>
                                        <td className="p-4">
                                            {order.isPaid ? (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                    Paid ({new Date(order.paidAt).toLocaleDateString()})
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                                    Not Paid
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {order.isDelivered ? (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                    Delivered ({new Date(order.deliveredAt).toLocaleDateString()})
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col space-y-2">
                                                <Link to={`/order/${order._id}`} className="text-blue-600 hover:underline text-sm mb-2">
                                                    Details
                                                </Link>
                                                {!order.isDelivered && (
                                                    <select
                                                        className="text-sm border rounded px-2 py-1"
                                                        value={order.orderStatus} // Assuming backend returns orderStatus
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    >
                                                        {statusOptions.map((opt) => (
                                                            <option key={opt} value={opt}>
                                                                {opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!orders || orders.length === 0) && (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500">
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
