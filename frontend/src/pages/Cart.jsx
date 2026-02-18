import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cartItems } = useSelector((state) => state.cart);
    // const { user } = useSelector((state) => state.auth); // user unused

    /* ===============================
       CALCULATIONS
    =============================== */
    const { subtotal, totalSavings, totalItems } = useMemo(() => {
        let sub = 0;
        let savings = 0;
        let items = 0;

        cartItems.forEach(item => {
            const price = Number(item.price) || 0;
            const mrp = Number(item.originalPrice) || price;

            sub += price * item.quantity;
            items += item.quantity;

            if (mrp > price) {
                savings += (mrp - price) * item.quantity;
            }
        });

        return {
            subtotal: sub,
            totalSavings: savings,
            totalItems: items,
        };
    }, [cartItems]);

    /* ===============================
       HANDLERS
    =============================== */
    const handleQtyChange = (id, newQty) => {
        if (newQty < 1) return;
        dispatch(updateQuantity({ id, quantity: newQty }));
    };

    const handleRemove = (id) => {
        if (window.confirm('Remove this item from cart?')) {
            dispatch(removeFromCart(id));
        }
    };

    /* ===============================
       EMPTY CART
    =============================== */
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-12 rounded-3xl shadow-sm border text-center max-w-lg">
                    <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                    <Link
                        to="/shop"
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    /* ===============================
       MAIN UI
    =============================== */
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container-custom">

                <h1 className="text-3xl font-bold mb-8">
                    Shopping Cart ({totalItems} Items)
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* ITEMS */}
                    <div className="lg:w-2/3 space-y-4">
                        {cartItems.map((item) => {
                            const price = Number(item.price) || 0;
                            const mrp = Number(item.originalPrice) || price;
                            const hasDiscount = mrp > price;

                            const discountPercent = hasDiscount
                                ? Math.round(((mrp - price) / mrp) * 100)
                                : 0;

                            const itemSavings = hasDiscount
                                ? (mrp - price) * item.quantity
                                : 0;

                            return (
                                <div
                                    key={item._id}
                                    className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col sm:flex-row gap-6"
                                >
                                    {/* IMAGE */}
                                    <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden">
                                        <img
                                            src={
                                                item.images?.[0]?.url ||
                                                item.images?.[0]
                                            }
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* DETAILS */}
                                    <div className="flex-1">
                                        <Link
                                            to={`/product/${item._id}`}
                                            className="font-bold text-lg hover:text-green-600"
                                        >
                                            {item.name}
                                        </Link>

                                        {/* PRICE */}
                                        <div className="mt-2">
                                            {hasDiscount && (
                                                <div className="text-xs text-gray-400 line-through">
                                                    ₹{mrp.toLocaleString('en-IN')}
                                                </div>
                                            )}

                                            <div className="text-lg font-bold text-green-700">
                                                ₹{price.toLocaleString('en-IN')}
                                            </div>

                                            {hasDiscount && (
                                                <>
                                                    <div className="text-xs text-green-600 font-semibold">
                                                        {discountPercent}% OFF
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        You Save ₹
                                                        {itemSavings.toLocaleString('en-IN')}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* QTY */}
                                        <div className="flex items-center mt-4">
                                            <button
                                                onClick={() =>
                                                    handleQtyChange(
                                                        item._id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                className="px-3 py-1 border"
                                            >
                                                -
                                            </button>
                                            <span className="px-4">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQtyChange(
                                                        item._id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="px-3 py-1 border"
                                            >
                                                +
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleRemove(item._id)
                                                }
                                                className="ml-6 text-red-500 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* SUMMARY */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border sticky top-24">

                            <h2 className="text-xl font-bold mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>
                                        ₹{subtotal.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                {totalSavings > 0 && (
                                    <div className="flex justify-between text-green-600 font-semibold">
                                        <span>You Saved</span>
                                        <span>
                                            -₹{totalSavings.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                )}

                                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-green-700">
                                        ₹{subtotal.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
