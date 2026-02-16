import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems, totalItems, totalPrice } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const handleQtyChange = (id, newQty) => {
        if (newQty < 1) return;
        dispatch(updateQuantity({ id, quantity: newQty }));
    };

    const handleRemove = (id) => {
        if (window.confirm('Remove this item from cart?')) {
            dispatch(removeFromCart(id));
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20">
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg">
                    <div className="w-24 h-24 bg-green-50 text-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">
                        Explore our student-made herbal products and support the Department of Science.
                    </p>
                    <Link to="/shop" className="btn bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container-custom">
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-8 flex items-center gap-3">
                    Shopping Cart
                    <span className="text-base font-normal text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">{totalItems} Items</span>
                </h1>

                {/* Discount Banner for verified users */}
                {user?.isLCITFaculty && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <span className="text-2xl">👨‍🏫</span>
                        <div>
                            <span className="font-bold text-blue-700">Faculty Discount Active</span>
                            <p className="text-sm text-gray-500">Your verified LCIT Faculty discount is automatically applied to all products</p>
                        </div>
                    </div>
                )}
                {user?.isLCITStudent && !user?.isLCITFaculty && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <span className="text-2xl">🎓</span>
                        <div>
                            <span className="font-bold text-green-700">Student Discount Active</span>
                            <p className="text-sm text-gray-500">Your verified LCIT Student discount is automatically applied to all products</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition-transform hover:scale-[1.01]">
                                {/* Image */}
                                <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                    {(item.images && item.images.length > 0) ? (
                                        <img src={item.images[0].url || item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 w-full text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                                        <Link to={`/product/${item._id}`} className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors">
                                            {item.name}
                                        </Link>
                                        <span className="text-lg font-bold text-green-700 mt-2 sm:mt-0">₹{item.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">{item.category}</p>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => handleQtyChange(item._id, item.quantity - 1)}
                                                className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                                            >-</button>
                                            <span className="px-3 py-1 font-medium text-gray-900 border-x border-gray-200 w-10 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQtyChange(item._id, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                                            >+</button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-gray-900 sm:hidden">Total: ₹{(item.price * item.quantity).toFixed(2)}</span>
                                            <button
                                                onClick={() => handleRemove(item._id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{Number(totalPrice).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Estimate</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 my-4"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-3xl font-bold text-green-700">₹{Number(totalPrice).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full btn bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-200 transition-all transform hover:-translate-y-1 mb-4 flex justify-between px-6 items-center group"
                            >
                                <span>Checkout</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Secure Checkout by LCIT Dept. of Science
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
